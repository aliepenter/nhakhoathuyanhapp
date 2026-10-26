const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname, '../utils/orthodonticDuration.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: exportsObject });
const duration = exportsObject.getOrthodonticDuration;
const patient = { ngay_gan_mc: '2024-11-01', orthodontic_status: 'retention', orthodontic_ended_on: '2025-11-01' };

test('retention stops at November 1, 2025 instead of continuing until today', () => {
    for (const now of ['2026-10-26T10:00:00Z', '2027-04-01T00:00:00Z']) {
        const result = duration(patient, new Date(now));
        assert.equal(result.days, 365);
        assert.equal(result.endedOn, '2025-11-01');
    }
});
test('completed and discontinued also stop at their recorded date', () => {
    for (const status of ['completed', 'discontinued']) {
        assert.equal(duration({ ...patient, orthodontic_status: status }, new Date('2026-10-26')).days, 365);
    }
});
test('reopening resumes until today and ignores any stale end date', () => {
    const result = duration({ ...patient, orthodontic_status: 'active' }, new Date('2025-11-03T12:00:00Z'));
    assert.equal(result.days, 367);
    assert.equal(result.endedOn, null);
});
test('legacy patients without a status retain their running counter', () => {
    assert.equal(duration({ ngay_gan_mc: '2025-11-01' }, new Date('2025-11-03T12:00:00Z')).days, 2);
});
test('counts Vietnam calendar days for UTC timestamps and date-only values', () => {
    const result = duration({ ...patient, ngay_gan_mc: '2024-10-31T17:00:00Z' }, new Date('2026-10-26'));
    assert.equal(result.days, 365);
    assert.equal(duration({ ngay_gan_mc: '2025-11-01' }, new Date('2025-11-01T17:01:00Z')).days, 1);
    assert.equal(duration({ ...patient, ngay_gan_mc: '2025-11-01' }, new Date('2026-10-26')).days, 0);
});
test('invalid or missing closed dates never fall back to today', () => {
    for (const endedOn of [null, '', 'invalid', '2025-02-30', '2020-01-01', '2099-11-01']) {
        assert.equal(duration({ ...patient, orthodontic_ended_on: endedOn }, new Date('2026-10-26')).days, null);
    }
    assert.equal(duration({ ...patient, ngay_gan_mc: null }).days, null);
    assert.equal(duration(undefined).days, null);
});
