import React, { useEffect, useRef, useState } from 'react';
import {
    Chart,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
} from 'chart.js';
import { AppointmentService } from '../../../../services/appointmentService';
import { useRecoilValue } from 'recoil';
import { userValue } from '../../../../stores/userAtom';
import { invoicesService } from '../../../../services/invoicesService';

// Register the components of Chart.js that are needed
Chart.register(BarController, BarElement, CategoryScale, LinearScale);

const BarChart = ({ type }: any) => {
    const user = useRecoilValue(userValue);
    const [figures, setFigures] = useState<number[]>([] as number[]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart | null>(null); // Ref lưu trữ instance của biểu đồ

    function getStartOfWeek(date: Date) {
        const givenDate = new Date(date);
        const dayOfWeek = givenDate.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const startOfWeek = new Date(givenDate);
        startOfWeek.setDate(givenDate.getDate() - diff);
        return startOfWeek;
    }

    const getEndOfWeek = (date: Date) => {
        const dayOfWeek = date.getDay();
        const diff = dayOfWeek === 0 ? 6 : 7 - dayOfWeek;
        const endOfWeek = date;
        endOfWeek.setDate(endOfWeek.getDate() + diff);
        return endOfWeek;
    };
    const findMaxFigure = (figures: number[]): number => {
        let max = figures[0];
        figures.forEach((fig) => {
            if (max < fig) {
                max = fig;
            }
        });
        return max;
    };

    const getTotalPriceAppointmentByWeek = async (data: any, config: any) => {
        try {
            const res = await invoicesService.getTotalRevenueByDateInNowWeek(
                data,
                config
            );
            console.log(res);
            const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const pricesMap = new Map<string, number>();

            res.forEach((item: any) => {
                const date = new Date(item.created_at);
                const day =
                    weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1];
                pricesMap.set(day, Number(item.totalPrice));
            });

            const prices = weekDays.map((day) => pricesMap.get(day) || 0);
            setFigures(prices);
        } catch (err: any) {
            console.error(err.message);
        }
    };
    const getTotalAppointmentByWeek = async (data: any, config: any) => {
        try {
            const res = await AppointmentService.getTotalAppointmentByWeek(
                data,
                config
            );
            const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const pricesMap = new Map<string, number>();

            res.forEach((item: any) => {
                const date = new Date(item.appointment_date);
                const day =
                    weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1];
                pricesMap.set(day, Number(item.total_appointment));
            });

            const prices = weekDays.map((day) => pricesMap.get(day) || 0);
            setFigures(prices);
        } catch (err: any) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        const now = new Date();
        const startOfWeek = getStartOfWeek(now).toISOString().slice(0, 10);
        const endOfWeek = getEndOfWeek(now).toISOString().slice(0, 10);
        const header = { headers: { authorization: 'Bearer ' + user.token } };
        const data = {
            startWeek: startOfWeek,
            endWeek: endOfWeek,
            doctorId: user.doctor_id,
        };
        if (type === 'appointment') {
            getTotalAppointmentByWeek(data, header);
        } else {
            getTotalPriceAppointmentByWeek(data, header);
        }
    }, []);
    useEffect(() => {}, [figures]);

    useEffect(() => {
        let maxYValue: number = 0;
        if (figures.length > 0) {
            maxYValue = findMaxFigure(figures);
        }
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            // Hủy biểu đồ cũ nếu tồn tại
            if (chartRef.current) {
                chartRef.current.destroy();
            }

            // Tạo biểu đồ mới
            chartRef.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [
                        {
                            label: 'Revenue',
                            data: figures,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            min: 0, // Đặt giá trị tối thiểu là 0
                            max:
                                type !== 'appointment'
                                    ? maxYValue + 200000
                                    : maxYValue + 2,
                            ticks: {
                                stepSize: type !== 'appointment' ? 100000 : 1,
                                callback: function (value) {
                                    if (type !== 'appointment') {
                                        if (typeof value === 'number') {
                                            return (
                                                value.toLocaleString() + ' VND'
                                            );
                                        }
                                    }
                                    return value;
                                },
                            },
                            // title: {
                            //     display: true,
                            //     text: 'Revenue (VND)',
                            // },
                        },
                    },
                },
            });
        }
    }, [figures]);

    return (
        <div>
            <canvas
                style={{ maxHeight: '250px' }}
                height={200}
                ref={canvasRef}
            ></canvas>
        </div>
    );
};

export default BarChart;
