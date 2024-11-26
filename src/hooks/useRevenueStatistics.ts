import { useEffect, useState } from 'react';
import { AppointmentService } from '../services/appointmentService';

export const useRevenueStatistics = (
    token: string,
    doctorId: number,
    startOfWeek: string,
    endOfWeek: string
) => {
    const [revenueFigures, setRevenueFigures] = useState<number[]>([]);
    const getTotalPriceAppointmentByWeek = async () => {
        const header = { headers: { authorization: 'Bearer ' + token } };
        const data = { startWeek: startOfWeek, endWeek: endOfWeek };
        try {
            const res = await AppointmentService.getTotalPriceAppointmentByWeek(
                data,
                header
            );
            const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const pricesMap = new Map<string, number>();

            res.forEach((item: any) => {
                const date = new Date(item.appointment_date);
                const day =
                    weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1];
                pricesMap.set(day, Number(item.totalPrice));
            });

            const prices = weekDays.map((day) => pricesMap.get(day) || 0);
            setRevenueFigures(prices);
        } catch (err: any) {
            console.error(err.message);
        }
    };
    useEffect(() => {
        getTotalPriceAppointmentByWeek;
    }, [doctorId, startOfWeek, endOfWeek]);
    return revenueFigures;
};
