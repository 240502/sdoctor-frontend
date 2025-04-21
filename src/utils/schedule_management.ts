export const handleGetDateByActiveDay = (activeDay: number): string => {
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
    const year = dateOfWeek.getFullYear();
    const month = String(dateOfWeek.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0
    const day = String(dateOfWeek.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
