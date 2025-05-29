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
    Popconfirm,
} from 'antd';
const { RangePicker } = DatePicker;

import dayjs, { Dayjs } from 'dayjs';
import {
    useCreateEducation,
    useDeleteEducation,
    useFetchEducationByDoctorId,
    useUpdateEducation,
} from '../../../../hooks';
import { NoticeType } from 'antd/es/message/interface';
import { EducationUpdateDto } from '../../../../models';

interface Education {
    degree: string;
    institution: string;
    fromYear: number;
    toYear: number;
    certificate: string;
}

interface DoctorEducationTimeLineProps {
    doctorId: number | null;
    openMessage: (type: NoticeType, content: string) => void;
}

const EducationTab = ({
    doctorId,
    openMessage,
}: DoctorEducationTimeLineProps) => {
    const { data, isFetching, isError, refetch } =
        useFetchEducationByDoctorId(doctorId);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [educations, setEducations] = useState<any>([]);
    const { mutate: createEducation } = useCreateEducation();
    const { mutate: updateEducation } = useUpdateEducation();
    const { mutate: deleteEducation } = useDeleteEducation();
    const [updatedId, setUpdatedId] = useState<number | null>(null);
    useEffect(() => {
        setEducations(data);
    }, [data]);
    const [form] = Form.useForm();

    const onFinish = (values: {
        degree: string;
        institution: string;
        date: Dayjs[];
        certificate: string;
    }) => {
        if (isUpdate) {
            const newEducation: EducationUpdateDto = {
                id: updatedId,
                degree: values.degree,
                institution: values.institution,
                fromYear: values.date[0].year(),
                toYear: values.date[1].year(),
            };
            updateEducation(newEducation, {
                onSuccess() {
                    openMessage('success', 'Cập nhật thành công!');
                    refetch();
                },
                onError() {
                    openMessage('error', 'Cập nhật không thành công!');
                },
            });
        } else {
            const newEducation: Education = {
                degree: values.degree,
                institution: values.institution,
                fromYear: values.date[0].year(),
                toYear: values.date[1].year(),
                certificate: values.certificate,
            };

            createEducation(
                { doctorId, education: [newEducation] },
                {
                    onSuccess() {
                        openMessage('success', 'Thêm thành công!');
                        refetch();
                    },
                    onError() {
                        openMessage('error', 'Thêm không thành công!');
                    },
                }
            );
        }

        form.resetFields();
    };
    const handleTimeLineItemClick = (education: any) => {
        setIsUpdate(true);
        setUpdatedId(education.educationId);
        form.setFieldsValue({
            degree: education.degree,
            institution: education.institution,
            date: [
                dayjs(`${education.fromYear}-01-01`),
                education.toYear ? dayjs(`${education.toYear}-01-01`) : dayjs(),
            ],
        });
    };
    const timelineItems =
        data?.length > 0 && !isError
            ? data.map((education: any) => ({
                  children: (
                      <div>
                          <div
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleTimeLineItemClick(education)}
                          >
                              <Typography.Text className="fw-medium">
                                  {education.institution}
                              </Typography.Text>
                              <p>
                                  tốt nghiệp {education.degree}{' '}
                                  {education.certificate}
                              </p>
                          </div>
                          <Popconfirm
                              title="Bạn có chắc muốn xóa thông tin  này?"
                              onConfirm={() =>
                                  deleteEducation(education.educationId, {
                                      onSuccess() {
                                          openMessage(
                                              'success',
                                              'Xóa thành công!'
                                          );
                                          refetch();
                                      },
                                      onError() {
                                          openMessage(
                                              'error',
                                              'Xóa không thành công!'
                                          );
                                      },
                                  })
                              }
                              okText="Xóa"
                              cancelText="Hủy"
                          >
                              <Button type="link" danger>
                                  Xóa
                              </Button>
                          </Popconfirm>
                      </div>
                  ),
                  label: `${education.fromYear} - ${
                      education.toYear === dayjs().year() || !education.toYear
                          ? 'Nay'
                          : education.toYear
                  }`,
              }))
            : educations?.length > 0 &&
              educations?.map((education: any) => ({
                  children: (
                      <div>
                          <div
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleTimeLineItemClick(education)}
                          >
                              <Typography.Text className="fw-medium">
                                  {education.institution}
                              </Typography.Text>
                              <p>
                                  tốt nghiệp {education.degree}{' '}
                                  {education.certificate}
                              </p>
                          </div>
                          <Popconfirm
                              title="Bạn có chắc muốn xóa thông tin  này?"
                              onConfirm={() =>
                                  deleteEducation(education.educationId, {
                                      onSuccess() {
                                          openMessage(
                                              'success',
                                              'Xóa thành công!'
                                          );
                                          refetch();
                                      },
                                      onError() {
                                          openMessage(
                                              'error',
                                              'Xóa không thành công!'
                                          );
                                      },
                                  })
                              }
                              okText="Xóa"
                              cancelText="Hủy"
                          >
                              <Button type="link" danger>
                                  Xóa
                              </Button>
                          </Popconfirm>
                      </div>
                  ),
                  label: `${education.fromYear} - ${
                      education.toYear === dayjs().year() || !education.toYear
                          ? 'Nay'
                          : education.toYear
                  }`,
              }));
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
                                        Lưu
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                    {educations?.length > 0 || !isError ? (
                        <Timeline mode="alternate" items={timelineItems} />
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

export default EducationTab;
