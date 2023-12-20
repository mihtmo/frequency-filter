export function secondsToTimestamp(time) {
    const hours = String(Math.trunc(time / 3600));
    const minutes = String(Math.trunc((time % 3600) / 60));
    const seconds = String(Math.trunc(time % 60));

    return (
        `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
    )
}