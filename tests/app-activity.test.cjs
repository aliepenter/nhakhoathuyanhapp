const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname, '../lib/appActivity.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: exportsObject, AbortController });
const { createActivityTracker } = exportsObject;
const settle = () => new Promise(setImmediate);

test('no heartbeat while logged out or in background', async () => {
    let token = null, calls = 0;
    const tracker = createActivityTracker({ readToken: async () => token, send: async () => calls++ });
    tracker.setActive(true); await settle();
    assert.equal(calls, 0);
    tracker.setActive(false); token = 'login'; await tracker.tick();
    assert.equal(calls, 0);
    tracker.setActive(true); await settle(); assert.equal(calls, 1);
});

test('navigation is deduplicated; heartbeat resumes each minute and on foreground', async () => {
    let time = 0, calls = 0;
    const tracker = createActivityTracker({ now: () => time, readToken: async () => 'token', send: async () => calls++ });
    tracker.setActive(true); await settle();
    for (let i = 0; i < 5; i++) await tracker.tick();
    assert.equal(calls, 1);
    time = 60000; await tracker.tick(); assert.equal(calls, 2);
    tracker.setActive(false); time = 120000; await tracker.tick(); assert.equal(calls, 2);
    tracker.setActive(true); await settle(); assert.equal(calls, 3);
});

test('new login is counted without waiting for the previous token throttle', async () => {
    let token = 'A'; const sent = [];
    const tracker = createActivityTracker({ now: () => 0, readToken: async () => token, send: async value => sent.push(value) });
    tracker.setActive(true); await settle();
    token = null; await tracker.tick();
    token = 'B'; await tracker.tick();
    assert.deepEqual(sent, ['A', 'B']);
});

test('background transition cancels in-flight work and prevents overlapping requests', async () => {
    const requests = []; let finish;
    const tracker = createActivityTracker({ readToken: async () => 'token', send: async (_, signal) => {
        requests.push(signal); await new Promise(resolve => { finish = resolve; });
    } });
    tracker.setActive(true); await settle(); await tracker.tick(true);
    assert.equal(requests.length, 1);
    tracker.setActive(false); assert.equal(requests[0].aborted, true);
    finish(); await settle();
});

test('a stale token read cannot send after a background transition', async () => {
    let resolve, calls = 0;
    const tracker = createActivityTracker({ readToken: () => new Promise(done => { resolve = done; }), send: async () => calls++ });
    tracker.setActive(true); tracker.setActive(false);
    resolve('old-token'); await settle(); assert.equal(calls, 0);
});

test('network errors are silent and retry only on the next interval, without replay', async () => {
    let time = 0, calls = 0;
    const tracker = createActivityTracker({ now: () => time, readToken: async () => 'token', send: async () => {
        calls++; throw Error('API not deployed or offline');
    } });
    tracker.setActive(true); await settle();
    await tracker.tick(); assert.equal(calls, 1);
    time = 60000; await tracker.tick(); assert.equal(calls, 2);
});
