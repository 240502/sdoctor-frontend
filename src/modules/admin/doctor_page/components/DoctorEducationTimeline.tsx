import React, { useState } from 'react';
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

interface Education {
    degree: string;
    institution: string;
    fromDate: Dayjs;
    toDate: Dayjs;
    certificate: string;
}

interface DoctorEducationTimeLineProps {
    educations: any[];
    handleChangeEducations: (education: any) => void;
}

const DoctorEducationTimeLine = ({
    educations,
    handleChangeEducations,
}: DoctorEducationTimeLineProps) => {
    const [form] = Form.useForm();

    const onFinish = (values: {
        degree: string;
        institution: string;
        date: Dayjs[];
        certificate: string;
    }) => {
        const newEducation: Education = {
            degree: values.degree,
            institution: values.institution,
            fromDate: values.date[0],
            toDate: values.date[1],
            certificate: values.certificate,
        };
        handleChangeEducations(newEducation);
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
                <Row gutter={[24, 24]}>
                    <Col span={12}>
                        <Form.Item
                            name="degree"
                            label="Loại bằng cấp"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập loại bằng cấp!',
                                },
                            ]}
                        >
                            <Input placeholder="Ví dụ: Thạc sĩ" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="institution"
                            label="Cơ sở đào tạo"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên cơ sở đào tạo!',
                                },
                            ]}
                        >
                            <Input placeholder="Ví dụ: Trường Đại học Y Dược Tp. HCM" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="certificate"
                            label="Chuyên khoa"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập chuyên khoa!',
                                },
                            ]}
                        >
                            <Input placeholder="Ví dụ: Sản Phụ Khoa" />
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

            {educations.length > 0 ? (
                <Timeline
                    mode="alternate"
                    items={educations.map((education: Education) => ({
                        children: (
                            <>
                                <Typography.Text className="fw-medium">
                                    {education.institution}
                                </Typography.Text>
                                <p>
                                    tốt nghiệp {education.degree}{' '}
                                    {education.certificate}
                                </p>
                            </>
                        ),
                        label: ` ${education.fromDate.format('DD-MM-YYYY')} -
                                    ${education.toDate.format('DD-MM-YYYY')}`,
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

export default DoctorEducationTimeLine;
