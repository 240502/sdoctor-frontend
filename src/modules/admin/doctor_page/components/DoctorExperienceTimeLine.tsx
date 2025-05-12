import {
    Timeline,
    Button,
    Input,
    DatePicker,
    Form,
    Typography,
    Row,
    Col,
} from 'antd';
const { RangePicker } = DatePicker;
import { Dayjs } from 'dayjs';
import { useEffect } from 'react';

interface DoctorExperienceTimelineProps {
    experiences: any[];
    handleChangeExperience: (experinece: any) => void;
}

const DoctorExperienceTimeline = ({
    experiences,
    handleChangeExperience,
}: DoctorExperienceTimelineProps) => {
    const [form] = Form.useForm();
    useEffect(() => {
        console.log(experiences);
    }, [experiences]);
    const onFinish = (values: {
        date: Dayjs[];
        workplace: string;
        position: string;
    }) => {
        const newExperience: any = {
            position: values.position,
            fromDate: values.date[0],
            toDate: values.date[1],
            workplace: values.workplace,
        };
        handleChangeExperience(newExperience);
        form.resetFields();
    };

    return (
        <>
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                style={{ marginBottom: 20 }}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="position"
                            label="Vị trí"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng vị trí!',
                                },
                            ]}
                        >
                            <Input placeholder="Ví dụ: Bác sĩ răng hàm mặt" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="workplace"
                            label="Nơi làm việc"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập nơi làm việc!',
                                },
                            ]}
                        >
                            <Input placeholder="Ví dụ: Bệnh viện đại học y Hà Nội" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="date"
                            label="Ngày bắt đầu - kết thúc"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày!',
                                },
                            ]}
                        >
                            <RangePicker
                                placeholder={['Từ năm', 'Đến năm']}
                                className="w-100"
                                picker="year"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} className="text-center">
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Thêm kinh nghiệm
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            {experiences.length > 0 ? (
                <Timeline
                    mode="alternate"
                    items={experiences.map((experience: any) => ({
                        children: (
                            <>
                                <Typography.Text className="fw-medium">
                                    {experience.institution}
                                </Typography.Text>
                                <p>
                                    {experience.position} tại{' '}
                                    {experience.workplace}
                                </p>
                            </>
                        ),
                        label: ` ${experience.fromDate.format('DD-MM-YYYY')} -
                                    ${experience.toDate.format('DD-MM-YYYY')}`,
                    }))}
                />
            ) : (
                <Typography.Text>
                    Chưa có quá trình đào tạo. Vui lòng thêm mới.
                </Typography.Text>
            )}
        </>
    );
};

export default DoctorExperienceTimeline;
