import React, { useEffect, useRef, useState } from 'react';
import {
    Chart,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
} from 'chart.js';
import { AppointmentService } from '../../../../services/appointment.service';
import { useRecoilValue } from 'recoil';
import { userValue } from '../../../../stores/userAtom';
import { invoicesService } from '../../../../services/invoices.service';

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

    function nextEvenWithStep(number: number, step: number) {
        // Làm tròn số ban đầu lên bội số gần nhất của step
        let nextMultiple = Math.ceil(number / step) * step;

        // Kiểm tra nếu nextMultiple là số chẵn, nếu không cộng thêm step
        if (nextMultiple % 2 !== 0) {
            nextMultiple += step;
        }

        return nextMultiple;
    }

    const getTotalPriceAppointmentByWeek = async (data: any, config: any) => {
        try {
            const res = await invoicesService.getTotalRevenueByDateInNowWeek(
                data,
                config
            );
            const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
            const pricesMap = new Map<string, number>();

            res.forEach((item: any) => {
                const date = new Date(item.appointment_date);
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

    const statisticsAppointmentsByDay = async (data: any, config: any) => {
        try {
            const res = await AppointmentService.statisticsAppointmentsByDay(
                data,
                config
            );
            console.log(res);
            const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
            const pricesMap = new Map<string, number>();

            res.forEach((item: any) => {
                const date = new Date(item.appointment_date);
                const day =
                    weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1];
                pricesMap.set(day, Number(item.total_appointment));
            });

            const appointments = weekDays.map((day) => pricesMap.get(day) || 0);
            console.log('appointments', appointments);
            setFigures(appointments);
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
            doctorId: user.doctorId,
        };
        if (type === 'appointment') {
            statisticsAppointmentsByDay(data, header);
        } else {
            getTotalPriceAppointmentByWeek(data, header);
        }
    }, []);

    useEffect(() => {
        let maxYValue: number = 0;
        if (figures.length > 0) {
            if (type === 'appointment') {
                maxYValue = findMaxFigure(figures);
            } else {
                maxYValue = findMaxFigure(figures);
                maxYValue = nextEvenWithStep(maxYValue, 500000);
            }
        }
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            // Hủy biểu đồ cũ nếu tồn tại
            if (chartRef.current) {
                chartRef.current.destroy();
            }
            // Tạo gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(75, 192, 192, 0.8)');
            gradient.addColorStop(1, 'rgba(75, 192, 192, 0.2)');

            // Tạo biểu đồ mới
            chartRef.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                    datasets: [
                        {
                            label: `${
                                type === 'appointment'
                                    ? 'Lịch hẹn'
                                    : 'Doanh thu'
                            }`,
                            data: figures,
                            backgroundColor: gradient,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: {
                            enabled: true,
                            callbacks: {
                                label: function (context) {
                                    const value = context.raw;
                                    if (value === 0) {
                                        return ''; // Không hiển thị tooltip nếu giá trị là 0
                                    }
                                    return type === 'appointment'
                                        ? `${value} Lịch hẹn`
                                        : `${value?.toLocaleString()} VND`;
                                },
                            },
                        },
                    },
                    events: [
                        'mousemove',
                        'mouseout',
                        'click',
                        'touchstart',
                        'touchmove',
                    ],
                    scales: {
                        y: {
                            min: 0,
                            max:
                                type === 'appointment'
                                    ? maxYValue + 5
                                    : maxYValue + 500000,
                            ticks: {
                                stepSize: type === 'appointment' ? 1 : 500000,
                                callback: (value: any) => {
                                    return type === 'appointment'
                                        ? value
                                        : `${value.toLocaleString()} VND`;
                                },
                            },
                        },
                    },
                },
            });
        }
    }, [figures]);

    return (
        <div>
            <canvas
                style={{ maxHeight: '250px', pointerEvents: 'auto' }}
                height={200}
                ref={canvasRef}
            ></canvas>
        </div>
    );
};

export default BarChart;
