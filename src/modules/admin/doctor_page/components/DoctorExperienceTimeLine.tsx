import React, { useState } from 'react';
import { Timeline, Button, Input, DatePicker, Form, Typography } from 'antd';
import { Dayjs } from 'dayjs';

interface Experience {
    label: string;
    children: string;
}

const DoctorExperienceTimeline: React.FC = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [form] = Form.useForm();

    const onFinish = (values: { date: Dayjs; description: string }) => {
        const newExperience: Experience = {
            label: values.date.format('DD-MM-YYYY'),
            children: values.description,
        };
        setExperiences([...experiences, newExperience]);
        form.resetFields();
    };

    return (
        <>
            <Form
                form={form}
                onFinish={onFinish}
                layout="inline"
                style={{ marginBottom: 20 }}
            >
                <Form.Item
                    name="date"
                    label="Ngày"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                >
                    <DatePicker
                        format="DD-MM-YYYY"
                        placeholder="Chọn thời gian"
                    />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mô tả!' },
                    ]}
                >
                    <Input placeholder="Ví dụ: Làm việc tại Bệnh viện Chợ Rẫy" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Thêm kinh nghiệm
                    </Button>
                </Form.Item>
            </Form>

            {/* Hiển thị Timeline hoặc thông báo nếu chưa có kinh nghiệm */}
            {experiences.length > 0 ? (
                <Timeline mode={'alternate'} items={experiences} />
            ) : (
                <Typography.Text>
                    Chưa có kinh nghiệm nào. Vui lòng thêm kinh nghiệm mới.
                </Typography.Text>
            )}
        </>
    );
};

export default DoctorExperienceTimeline;
