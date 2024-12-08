import { Button, Calendar, Col, Row } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
export const CalendarDoctor = () => {
    const onPanelChange = (
        value: Dayjs,
        mode: CalendarProps<Dayjs>['mode']
    ) => {
        console.log(value.format('YYYY-MM-DD'), mode);
    };

    return (
        <>
            <Calendar fullscreen={false} onPanelChange={onPanelChange} />
            <Row gutter={[16, 16]}>
                <Col span={4}>
                    <Button>10.00 - 11.00</Button>
                </Col>
            </Row>
        </>
    );
};
