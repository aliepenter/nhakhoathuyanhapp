type TreatmentDates = {
    ngay_gan_mc?: string | null;
    orthodontic_status?: string | null;
    orthodontic_ended_on?: string | null;
};
const DAY = 86400000;

// Compare calendar dates in Vietnam, independent of the phone's time zone.
function calendarDay(value: string | Date | null | undefined): number | null {
    if (!value) return null;
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const date = new Date(`${value}T00:00:00Z`);
        return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
            ? date.getTime() / DAY : null;
    }
    const timestamp = new Date(value).getTime();
    return Number.isFinite(timestamp) ? Math.floor((timestamp + 7 * 3600000) / DAY) : null;
}

export function getOrthodonticDuration(user?: TreatmentDates | null, now = new Date()) {
    const stopped = ['retention', 'completed', 'discontinued'].includes(user?.orthodontic_status || '');
    const start = calendarDay(user?.ngay_gan_mc);
    const today = calendarDay(now);
    const end = stopped ? calendarDay(user?.orthodontic_ended_on) : today;
    // Missing/invalid closed-treatment dates must never silently restart the live counter.
    const valid = start !== null && end !== null && today !== null && end >= start && end <= today;
    return {
        days: valid ? end - start : null,
        endedOn: stopped && valid ? new Date(end * DAY).toISOString().slice(0, 10) : null,
        stopped,
    };
}
