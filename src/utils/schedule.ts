import { Time } from '../models/time';

export const handleTimeOverRealTime = (times: any) => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    let newTimes: any = [];
    newTimes = times.map((time: Time) => {
        const startMinute = time?.startTime?.split(':')[1];
        const startHour = time?.startTime?.split(':')[0];
        if (Number(hours) === Number(startHour)) {
            if (Number(startMinute) - Number(minutes) <= 15) {
                return { ...time, disable: true };
            } else {
                return { ...time, disable: false };
            }
        }
        if (Number(hours) > Number(startHour)) {
            return { ...time, disable: true };
        }
        if (Number(hours) < Number(startHour)) {
            return { ...time, disable: false };
        }
    });
    return newTimes;
};
