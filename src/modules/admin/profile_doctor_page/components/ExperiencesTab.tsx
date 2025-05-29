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
    useCreateDoctorExperience,
    useDeleteWorkExperience,
    useFetchDoctorExperienceByDoctorId,
    useUpdateWorkExperience,
} from '../../../../hooks';
import { WorkExperience, WorkExperienceUpdateDto } from '../../../../models';
import { useEffect, useState } from 'react';
import { NoticeType } from 'antd/es/message/interface';

interface DoctorExperienceTimelineProps {
    doctorId: number | null;
    openMessage: (type: NoticeType, content: string) => void;
}

const ExperiencesTab = ({
    doctorId,
    openMessage,
}: DoctorExperienceTimelineProps) => {
    const [experiences, setExperiences] = useState<any>([]);
    const { mutate: updateExperience } = useUpdateWorkExperience();
    const { mutate: deleteExperience } = useDeleteWorkExperience();

    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [updatedId, setUpdatedId] = useState<number | null>(null);
    const { data, isFetching, refetch } =
        useFetchDoctorExperienceByDoctorId(doctorId);
    useEffect(() => {
        setExperiences(data);
    }, [data]);
    const [form] = Form.useForm();
    const { mutate: createDoctorExperience } = useCreateDoctorExperience();

    const handleTimeLineItemClick = (experience: WorkExperience) => {
        setIsUpdate(true);
        setUpdatedId(experience.experienceId);
        form.setFieldsValue({
            position: experience.position,
            workplace: experience.workplace,
            date: [
                dayjs(`${experience.fromYear}-01-01`),
                experience.toYear
                    ? dayjs(`${experience.toYear}-01-01`)
                    : dayjs(),
            ],
        });
    };
    const onFinish = (values: {
        date: Dayjs[];
        workplace: string;
        position: string;
    }) => {
        if (isUpdate) {
            const newExperience: WorkExperienceUpdateDto = {
                id: updatedId,
                position: values.position,
                fromYear: values.date[0].year(),
                toYear: values.date[1].year(),
                workplace: values.workplace,
            };
            updateExperience(newExperience, {
                onSuccess() {
                    openMessage('success', 'Cập nhật thành công!');
                    refetch();
                },
                onError() {
                    openMessage('error', 'Cập nhật không thành công!');
                },
            });
        } else {
            const newExperience: any = {
                doctorId: doctorId,
                position: values.position,
                fromYear: values.date[0].year(),
                toYear: values.date[1].year(),
                workplace: values.workplace,
            };
            createDoctorExperience(
                {
                    doctorId,
                    workExperience: [newExperience],
                },
                {
                    onSuccess() {
                        openMessage('success', 'Thêm kinh nghiệm thành công!');
                        refetch();
                    },
                    onError() {
                        openMessage(
                            'error',
                            'Thêm kinh nghiệm không thành công!'
                        );
                    },
                }
            );
        }
        form.resetFields();
    };
    useEffect(() => {
        console.log('ex', experiences);
    }, [experiences]);
    const timelineItems =
        data?.length > 0
            ? data?.map((experience: any) => ({
                  children: (
                      <div>
                          <div
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                  handleTimeLineItemClick(experience)
                              }
                          >
                              <Typography.Text className="fw-medium">
                                  {experience.workplace}
                              </Typography.Text>
                              <p>
                                  {experience.position} tại
                                  {experience.workplace}
                              </p>
                          </div>
                          <Popconfirm
                              title="Bạn có chắc muốn xóa kinh nghiệm này?"
                              onConfirm={() =>
                                  deleteExperience(experience.experienceId, {
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
                  label: `${experience.fromYear} - ${
                      experience.toYear === dayjs().year() || !experience.toYear
                          ? 'Nay'
                          : experience.toYear
                  }`,
              }))
            : experiences?.length > 0 &&
              experiences?.map((experience: any) => ({
                  children: (
                      <div>
                          <div
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                  handleTimeLineItemClick(experience)
                              }
                          >
                              <Typography.Text className="fw-medium">
                                  {experience.workplace}
                              </Typography.Text>
                              <p>
                                  {experience.position} tại{' '}
                                  {experience.workplace}
                              </p>
                          </div>
                          <Popconfirm
                              title="Bạn có chắc muốn xóa kinh nghiệm này?"
                              //   onConfirm={() =>
                              //       handleDeleteExperience(
                              //           experience.experience_id
                              //       )
                              //   }
                              okText="Xóa"
                              cancelText="Hủy"
                          >
                              <Button type="link" danger>
                                  Xóa
                              </Button>
                          </Popconfirm>
                      </div>
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
                                        {isUpdate
                                            ? 'Cập nhật'
                                            : 'Thêm kinh nghiệm'}
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

export default ExperiencesTab;
