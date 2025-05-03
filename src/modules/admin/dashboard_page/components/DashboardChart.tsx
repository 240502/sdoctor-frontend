import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Card } from 'antd';
interface ColumnChartProps {
    title?: string;
    series?: { name: string; data: number[] }[];
    categories: string[];
}

// Functional component for the Column Chart
const DashboardChart: React.FC<ColumnChartProps> = ({
    title,
    series,
    categories,
}) => {
    const options: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: true,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 4,
            },
        },
        dataLabels: {
            enabled: false,
            formatter: function (val) {
                return val.toLocaleString(undefined);
            },
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ['#304758'],
            },
        },
        xaxis: {
            categories: categories,
            title: {
                text: '',
            },
        },
        yaxis: [
            {
                tickAmount: 4,
                title: {
                    text: 'Doanh thu',
                },
                labels: {
                    formatter: function (val) {
                        return val.toLocaleString();
                    },
                },
            },
            {
                opposite: true,
                tickAmount: 4,

                title: {
                    text: 'Lịch hẹn',
                },
                labels: {
                    formatter: function (val) {
                        return `${val}`;
                    },
                },
            },
        ],
        title: {
            text: title || 'Basic Column Chart',
            align: 'left',
        },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: (val: number) => `${val.toLocaleString(undefined)}`,
            },
        },
    };

    return (
        <Card className="column-chart shadow">
            <Chart
                options={options}
                series={series}
                type="bar"
                height={280}
                width="100%"
            />
        </Card>
    );
};

export default DashboardChart;
