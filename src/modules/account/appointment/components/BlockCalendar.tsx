import { Calendar, Select } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import { useEffect } from 'react';
export const BlockCalendar = ({ setDate, setSchedule, setTimes }: any) => {
    const currentDate = new Date();

    const headerRender: CalendarProps<Dayjs>['headerRender'] = ({
        value,
        onChange,
    }) => {
        const currentYear = value.year();
        const currentMonth = value.month();

        const months = [
            'Tháng 1',
            'Tháng 2',
            'Tháng 3',
            'Tháng 4',
            'Tháng 5',
            'Tháng 6',
            'Tháng 7',
            'Tháng 8',
            'Tháng 9',
            'Tháng 10',
            'Tháng 11',
            'Tháng 12',
        ];

        const handleMonthChange = (month: number) => {
            const newValue = value.clone().month(month);
            onChange(newValue);
        };

        const handleYearChange = (year: number) => {
            const newValue = value.clone().year(year);
            onChange(newValue);
        };

        return (
            <div className="d-flex justify-content-between p-3">
                <Select
                    value={currentMonth}
                    onChange={handleMonthChange}
                    options={months.map((month, index) => ({
                        label: month,
                        value: index,
                    }))}
                    style={{ width: 120 }}
                />
                <Select
                    value={currentYear}
                    onChange={handleYearChange}
                    options={Array.from(
                        { length: 20 },
                        (_, i) => currentYear - 10 + i
                    ).map((year) => ({
                        label: `${year}`,
                        value: year,
                    }))}
                    style={{ width: 100 }}
                />
            </div>
        );
    };
    const handleChangeDate = (value: Dayjs) => {
        setDate(value.format('YYYY-MM-DD'));
        setTimes([]);
    };
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setDate(formattedDate);
    }, []);
    return (
        <Calendar
            onChange={handleChangeDate}
            fullscreen={false}
            headerRender={headerRender}
            disabledDate={(date: Dayjs) => {
                const newDate = new Date(date.toISOString().slice(0, 10));
                if (
                    newDate.getFullYear() === currentDate.getFullYear() &&
                    newDate.getMonth() === currentDate.getMonth() &&
                    newDate.getDate() < currentDate.getDate()
                ) {
                    return true;
                }
                return false;
            }}
        />
    );
};
