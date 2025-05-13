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
import { useEffect } from 'react';
import { useFetchDoctorExperienceByDoctorId } from '../../../../hooks';
import { useSearchParams } from 'react-router-dom';

interface DoctorExperienceTimelineProps {
    experiences: any[];
    handleChangeExperience: (experinece: any) => void;
}

const DoctorExperienceTimeline = ({
    experiences,
    handleChangeExperience,
}: DoctorExperienceTimelineProps) => {
    const [searchParams] = useSearchParams();

    const { data, isFetching, isError } = useFetchDoctorExperienceByDoctorId(
        searchParams.get('doctorId')
            ? Number(searchParams.get('doctorId'))
            : null
    );
    const [form] = Form.useForm();

    const onFinish = (values: {
        date: Dayjs[];
        workplace: string;
        position: string;
    }) => {
        const newExperience: any = {
            position: values.position,
            fromYear: values.date[0].year(),
            toYear: values.date[1].year(),
            workplace: values.workplace,
        };
        handleChangeExperience(newExperience);
        form.resetFields();
    };
    // Chuẩn bị items cho Timeline
    const timelineItems =
        data?.length > 0 && !isError
            ? data.map((experience: any) => ({
                  children: (
                      <>
                          <Typography.Text className="fw-medium">
                              {experience.workplace}
                          </Typography.Text>
                          <p>
                              {experience.position} tại {experience.workplace}
                          </p>
                      </>
                  ),
                  label: `${experience.fromYear} - ${
                      experience.toYear === dayjs().year() || !experience.toYear
                          ? 'Nay'
                          : experience.toYear
                  }`,
              }))
            : experiences.map((experience: any) => ({
                  children: (
                      <>
                          <Typography.Text className="fw-medium">
                              {experience.workplace}
                          </Typography.Text>
                          <p>
                              {experience.position} tại {experience.workplace}
                          </p>
                      </>
                  ),
                  label: `${experience.fromYear} - ${
                      experience.toYear === dayjs().year() || !experience.toYear
                          ? 'Nay'
                          : experience.toYear
                  }`,
              }));
    return (
        <Skeleton active loading={isFetching}>
            {!isFetching && (
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
                                            message:
                                                'Vui lòng nhập nơi làm việc!',
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

                    {timelineItems.length > 0 ? (
                        <Timeline mode="alternate" items={timelineItems} />
                    ) : (
                        <Typography.Text>
                            Chưa có quá trình làm việc. Vui lòng thêm mới.
                        </Typography.Text>
                    )}
                </>
            )}
        </Skeleton>
    );
};

export default DoctorExperienceTimeline;
