export const handleGetDateByActiveDay = (activeDay: number) => {
    const now = new Date();
    let dateOfWeek: Date = now;
    let diff: number;
    if (now.getDay() > activeDay) {
        if (Number(activeDay) !== 0) {
            diff = Math.abs(now.getDay() - activeDay);
            now.setDate(now.getDate() - diff);
        } else {
            diff = Math.abs(now.getDay() - activeDay) + 1;
            now.setDate(now.getDate() + diff);
        }
        dateOfWeek = now;
    }
    if (now.getDay() < activeDay) {
        diff = Math.abs(activeDay - now.getDay());
        now.setDate(now.getDate() + diff);
        dateOfWeek = now;
    }
    return dateOfWeek;
};
