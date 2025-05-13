import React, { useEffect, useState } from 'react';
import {
    Timeline,
    Button,
    Input,
    DatePicker,
    Form,
    Typography,
    Row,
    Col,
    Skeleton,
} from 'antd';
const { RangePicker } = DatePicker;

import dayjs, { Dayjs } from 'dayjs';
import { useFetchEducationByDoctorId } from '../../../../hooks';
import { useSearchParams } from 'react-router-dom';

interface Education {
    degree: string;
    institution: string;
    fromYear: number;
    toYear: number;
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
    const [searchParams] = useSearchParams();

    const { data, isFetching, isError } = useFetchEducationByDoctorId(
        searchParams.get('doctorId')
            ? Number(searchParams.get('doctorId'))
            : null
    );
    useEffect(() => {
        console.log('educations', data);
    }, [data]);
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
            fromYear: values.date[0].year(),
            toYear: values.date[1].year(),
            certificate: values.certificate,
        };
        handleChangeEducations(newEducation);
        form.resetFields();
    };

    return (
        <Skeleton loading={isFetching} active>
            {!isFetching && (
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
                                            message:
                                                'Vui lòng nhập loại bằng cấp!',
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
                                            message:
                                                'Vui lòng nhập tên cơ sở đào tạo!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Ví dụ: Trường Đại học Y Dược Tp. HCM" />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="date"
                                    label="Bắt đầu - kết thúc"
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

                    {educations.length > 0 || !isError ? (
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
                                label: ` ${education.fromYear} -
                                    ${
                                        education.toYear === dayjs().year()
                                            ? 'Nay'
                                            : education.toYear
                                    }`,
                            }))}
                        />
                    ) : (
                        <Typography.Text>
                            Chưa có quá trình đào tạo. Vui lòng thêm mới.
                        </Typography.Text>
                    )}
                </>
            )}
        </Skeleton>
    );
};

export default DoctorEducationTimeLine;
