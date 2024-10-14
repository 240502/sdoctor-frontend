import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
} from 'chart.js';
import { useEffect, useRef } from 'react';

// Đăng ký các thành phần cần thiết cho biểu đồ Line
Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale
);

const LineChart = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'line', // Biểu đồ line
                data: {
                    labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                    ],
                    datasets: [
                        {
                            label: 'Revenue',
                            data: [65, 59, 80, 81, 56, 55],
                            fill: false,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            tension: 0.1, // Làm mịn đường
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Cho phép tùy chỉnh chiều cao
                },
            });
        }
    }, []);

    return <canvas ref={canvasRef}></canvas>;
};

export default LineChart;
