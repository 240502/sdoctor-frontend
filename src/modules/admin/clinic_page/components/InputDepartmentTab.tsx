import { Form, Button, Select, Row, Col, Skeleton, Card } from 'antd';
import {
    useCreateClinicSpecialty,
    useFetchAllDepartments,
    useGetClinicSpecialtyByClinicId,
} from '../../../../hooks';
import {
    ClinicSpecialty,
    ClinicSpecialtyCreateDto,
    Department,
} from '../../../../models';
import { NoticeType } from 'antd/es/message/interface';
import { useEffect } from 'react';
interface InputDepartmentTabProps {
    clinicId: number | null;
    openMessage: (type: NoticeType, content: string) => void;
}
const InputDepartmentTab = ({
    clinicId,
    openMessage,
}: InputDepartmentTabProps) => {
    const [form] = Form.useForm();
    const {
        data: departmentResponse,
        isError,
        isFetching,
    } = useFetchAllDepartments();
    const {
        data,
        isError: isGetClinicSpecialtyError,
        isFetching: isFetchingClinicSpecialty,
        refetch,
        isRefetching,
    } = useGetClinicSpecialtyByClinicId(clinicId);

    const onFinish = (values: { departmentId: number }) => {
        const payload: ClinicSpecialtyCreateDto = {
            clinicId: clinicId,
            specialtyId: values.departmentId,
        };
        createClinicSpecialty(payload, {
            onSuccess() {
                openMessage('success', 'Thêm thành công!');
                refetch();
                form.resetFields();
            },
            onError(error) {
                console.log('có lỗi khi thêm clinic specialty', error);
                openMessage('error', 'Thêm không thành công!');
            },
        });
    };
    const { mutate: createClinicSpecialty, isPending } =
        useCreateClinicSpecialty();
    return (
        <>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Chọn chuyên khoa"
                    name="departmentId"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn một chuyên khoa!',
                        },
                    ]}
                >
                    <Select
                        placeholder="Chọn chuyên khoa"
                        loading={isFetching}
                        options={
                            !isError
                                ? departmentResponse?.departments?.map(
                                      (dept: Department) => ({
                                          value: dept.id,
                                          label: dept.name,
                                      })
                                  )
                                : []
                        }
                    />
                </Form.Item>

                <Form.Item className="text-center">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isPending}
                        className="col-2"
                    >
                        Thêm
                    </Button>
                </Form.Item>
            </Form>
            <Skeleton
                active
                loading={isFetchingClinicSpecialty || isRefetching}
            >
                <Row gutter={[24, 24]}>
                    {!isGetClinicSpecialtyError ? (
                        data?.map((clinicSpecialty: ClinicSpecialty) => {
                            return (
                                <Col span={4}>
                                    <Card
                                        className="shadow text-center"
                                        cover={
                                            <img
                                                style={{
                                                    cursor: 'pointer',
                                                }}
                                                src={clinicSpecialty?.imageUrl}
                                            ></img>
                                        }
                                    >
                                        <h6
                                            style={{
                                                height: '50px',
                                                maxHeight: '50px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {clinicSpecialty?.name}
                                        </h6>
                                    </Card>
                                </Col>
                            );
                        })
                    ) : (
                        <p className="fw-bold text-center">
                            Chưa có chuyên khoa nào! Vui lòng thêm mới !
                        </p>
                    )}
                </Row>
            </Skeleton>
        </>
    );
};

export default InputDepartmentTab;
