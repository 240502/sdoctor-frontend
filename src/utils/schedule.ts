// import { Time } from '../models/time';

// export const handleTimeOverRealTime = (times: any) => {
//     const now = new Date();
//     const hours = String(now.getHours()).padStart(2, '0');
//     const minutes = String(now.getMinutes()).padStart(2, '0');
//     let newTimes: any = [];
//     newTimes = times.map((time: Time) => {
//         const startMinute = time?.startTime?.split(':')[1];
//         const startHour = time?.startTime?.split(':')[0];
//         if (Number(hours) === Number(startHour)) {
//             if (Number(startMinute) - Number(minutes) <= 15) {
//                 return { ...time, disable: true };
//             } else {
//                 return { ...time, disable: false };
//             }
//         }
//         if (Number(hours) > Number(startHour)) {
//             return { ...time, disable: true };
//         }
//         if (Number(hours) < Number(startHour)) {
//             return { ...time, disable: false };
//         }
//     });
//     console.log(newTimes);

//     return newTimes;
// };

import { Time } from '../models/time';

// Định nghĩa interface Time (nếu chưa có)
// interface Time {
//     startTime?: string; // Chuỗi dạng "HH:mm", ví dụ: "14:00"
//     disable?: boolean;
//     // Các thuộc tính khác của Time
// }

export const handleTimeOverRealTime = (times: any): Time[] => {
    const now = new Date();

    return times.map((time: Time) => {
        // Kiểm tra xem startTime có hợp lệ không
        if (!time.startTime || !/^\d{2}:\d{2}$/.test(time.startTime)) {
            return { ...time, disable: true }; // Nếu startTime không hợp lệ, disable
        }

        // Tách giờ và phút từ startTime
        const [startHour, startMinute] = time.startTime.split(':').map(Number);

        // Tạo đối tượng Date cho startTime (dùng ngày hiện tại)
        const startTimeDate = new Date(now);
        startTimeDate.setHours(startHour, startMinute, 0, 0);

        // Tính khoảng cách thời gian (mili-giây)
        const timeDiffMs = startTimeDate.getTime() - now.getTime();
        const timeDiffMinutes = timeDiffMs / (1000 * 60); // Chuyển sang phút

        // Nếu startTime đã qua hoặc cách hiện tại dưới 20 phút, disable = true
        const isDisabled = timeDiffMinutes <= 20;

        return { ...time, disable: isDisabled };
    });
};
