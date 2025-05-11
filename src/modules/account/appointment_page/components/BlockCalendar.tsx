import { Calendar, Select } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import { useEffect } from 'react';
import dayjs from 'dayjs';
const BlockCalendar = ({ date, setDate }: any) => {
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
    };
    useEffect(() => {}, []);
    return (
        <Calendar
            onChange={handleChangeDate}
            fullscreen={false}
            headerRender={headerRender}
            disabledDate={(date: Dayjs) => {
                const now = dayjs();
                if (
                    date.year() === now.year() &&
                    date.month() === now.month() &&
                    date.date() < now.date()
                ) {
                    return true;
                }
                if (date.year() < now.year() || date.month() < now.month()) {
                    return true;
                }
                return false;
            }}
        />
    );
};
export default BlockCalendar;
