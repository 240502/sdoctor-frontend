import {
    Chart,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
} from 'chart.js';
import { useEffect, useRef } from 'react';

// Register the components of Chart.js that are needed
Chart.register(BarController, BarElement, CategoryScale, LinearScale);

const BarChart = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'bar',
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
                            label: 'Sales',
                            data: [12, 19, 3, 5, 2, 3],
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Allow custom height
                },
            });
        }
    }, []);

    return <canvas ref={canvasRef}></canvas>;
};

export default BarChart;
