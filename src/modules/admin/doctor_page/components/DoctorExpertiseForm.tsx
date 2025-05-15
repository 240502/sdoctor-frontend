import {
    Button,
    Input,
    Form,
    Typography,
    Col,
    Tag,
    Flex,
    Popconfirm,
} from 'antd';
import { useEffect, useState } from 'react';
import {
    useCreateDoctorExpertise,
    useDeleteDoctorExpertise,
    useFetchDoctorExpertiseByDoctorId,
    useUpdateDoctorExpertise,
} from '../../../../hooks';
import { NoticeType } from 'antd/es/message/interface';
interface DoctorExpertiseFormProps {
    doctorId: number | null;
    openMessage: (type: NoticeType, content: string) => void;
}

const DoctorExpertiseForm = ({
    doctorId,
    openMessage,
}: DoctorExpertiseFormProps) => {
    const [expertises, setExpertises] = useState<string[]>([]);
    const { mutate: updateExpertise } = useUpdateDoctorExpertise();
    const { mutate: deleteExpertise } = useDeleteDoctorExpertise();
    const [updatedId, setUpdatedId] = useState<number | null>(null);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const { data, isError, refetch } =
        useFetchDoctorExpertiseByDoctorId(doctorId);
    const [form] = Form.useForm();
    const { mutate: createDoctorExpertise } = useCreateDoctorExpertise();

    useEffect(() => {
        setExpertises(data);
    }, [data]);
    const onFinish = (values: { description: string }) => {
        if (isUpdate) {
            const payload: any = {
                id: updatedId,
                expertise: values.description,
            };
            updateExpertise(payload, {
                onSuccess() {
                    openMessage('success', 'Cập nhật thành công!');
                    refetch();
                },
                onError() {
                    openMessage('error', 'Cập nhật không thành công!');
                },
            });
        } else {
            handleCreateDoctorExpertise(values.description);
        }
        form.resetFields();
    };
    const handleCreateDoctorExpertise = (description: any) => {
        const doctorExpertises = {
            doctorId: doctorId,
            expertises: [description],
        };
        createDoctorExpertise(doctorExpertises, {
            onSuccess() {
                openMessage('success', 'Thêm thành công!');
                refetch();
            },
            onError() {
                openMessage('error', 'Thêm không thành công!');
            },
        });
    };
    const handleTimeLineItemClick = (expertise: any) => {
        setIsUpdate(true);
        setUpdatedId(expertise.id);
        form.setFieldsValue({
            description: expertise.expertise,
        });
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
                    name="description"
                    label="Mô tả"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mô tả!' },
                    ]}
                >
                    <Input placeholder="Ví dụ: Theo dõi thai sản" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {'Lưu'}
                    </Button>
                </Form.Item>
                {isUpdate && (
                    <Form.Item>
                        <Popconfirm
                            title="Bạn có chắc muốn xóa thông tin này?"
                            onConfirm={() =>
                                deleteExpertise(updatedId, {
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
                    </Form.Item>
                )}
            </Form>

            {data?.length > 0 && !isError ? (
                <Flex wrap gap="middle" align="stretch">
                    {data?.map((expertise: any) => {
                        return (
                            <Col
                                span={6}
                                className="gutter-row"
                                style={{ cursor: 'pointer' }}
                                onClick={() =>
                                    handleTimeLineItemClick(expertise)
                                }
                            >
                                <Tag
                                    color="rgb(248, 249, 252)"
                                    className="text-dark p-2 fw-medium rounded-5 shadow w-100 text-center text-wrap"
                                >
                                    <Typography.Text>
                                        {expertise.expertise}
                                    </Typography.Text>
                                </Tag>
                            </Col>
                        );
                    })}
                </Flex>
            ) : expertises?.length > 0 ? (
                <Flex wrap gap="middle" align="stretch">
                    {expertises?.map((expertise) => {
                        return (
                            <Col
                                span={6}
                                className="gutter-row"
                                style={{ cursor: 'pointer' }}
                                onClick={() =>
                                    handleTimeLineItemClick(expertise)
                                }
                            >
                                <Tag
                                    color="rgb(248, 249, 252)"
                                    className="text-dark p-2 fw-medium rounded-5 shadow w-100 text-center text-wrap"
                                >
                                    <Typography.Text>
                                        {expertise}
                                    </Typography.Text>
                                </Tag>
                            </Col>
                        );
                    })}
                </Flex>
            ) : (
                <Typography.Text>
                    Chưa có thế mạnh chuyên môn nào. Vui lòng thêm mới.
                </Typography.Text>
            )}
        </>
    );
};

export default DoctorExpertiseForm;
