export const ACTIVITY_INTERVAL_MS = 60_000;

type ActivityDependencies = {
    readToken: () => Promise<string | null>;
    send: (token: string, signal: AbortSignal) => Promise<unknown>;
    now?: () => number;
};

// One foreground tracker for the entire app, independent of individual screens.
export function createActivityTracker({ readToken, send, now = Date.now }: ActivityDependencies) {
    let active = false;
    let generation = 0;
    let pending: AbortController | null = null;
    let previousToken: string | null = null;
    let lastAttempt = -Infinity;

    const tick = async (force = false) => {
        if (!active || pending) return;
        const controller = new AbortController();
        pending = controller;
        const currentGeneration = generation;
        try {
            const token = await readToken();
            if (!active || generation !== currentGeneration || controller.signal.aborted) return;
            if (!token) {
                previousToken = null;
                lastAttempt = -Infinity;
                return;
            }
            const time = now();
            if (!force && token === previousToken && time - lastAttempt < ACTIVITY_INTERVAL_MS) return;
            previousToken = token;
            lastAttempt = time;
            await send(token, controller.signal);
        } catch {
            // Analytics must never block navigation, authentication, or show an alert.
            // No offline queue: replayed events would incorrectly count users as online.
        } finally {
            if (pending === controller) pending = null;
        }
    };

    const setActive = (value: boolean) => {
        if (active === value) return;
        active = value;
        generation++;
        if (!value) {
            pending?.abort();
            pending = null;
        } else {
            void tick(true);
        }
    };

    return { tick, setActive };
}
