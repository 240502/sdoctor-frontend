import { NoticeType } from 'antd/es/message/interface';
import React, { useState } from 'react';
import { useFetchServiceByDepartment } from '../../../../hooks/service/useService';
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    List,
    Popconfirm,
    Row,
    Select,
    Skeleton,
} from 'antd';
import {
    useCreateDoctorService,
    useDeleteDoctorService,
    useFetchDoctorServicesByDoctorId,
    useUpdateDoctorService,
} from '../../../../hooks/doctor_service';
import { DeleteOutlined, EditFilled, EditOutlined } from '@ant-design/icons';
import { useFetchAllDepartments } from '../../../../hooks';
import { Department, Service } from '../../../../models';
import {
    DoctorService,
    DoctorServiceCreateDTO,
    DoctorServiceUpdateDTO,
} from '../../../../models/doctor_service';

interface InputServiceTabProps {
    doctorId: number | null;
    openMessage: (type: NoticeType, content: string) => void;
}
const InputServiceTab = ({ doctorId, openMessage }: InputServiceTabProps) => {
    const [form] = Form.useForm();
    const [departmentId, setDepartmentId] = React.useState<number | null>(null);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [updatedId, setUpdatedId] = useState<number | null>(null);
    const { data: serviceResponse } = useFetchServiceByDepartment(departmentId);
    const {
        data: doctorService,
        isFetching,
        refetch,
        isRefetching,
    } = useFetchDoctorServicesByDoctorId(doctorId);
    const { data: departments } = useFetchAllDepartments();
    const { mutate: createDoctorService } = useCreateDoctorService();
    const { mutate: updateDoctorService } = useUpdateDoctorService();
    const { mutate: deleteDoctorService } = useDeleteDoctorService();
    const handleDelete = (id: number) => {
        deleteDoctorService(id, {
            onSuccess: () => {
                openMessage('success', 'Xóa dịch vụ thành công!');
                refetch();
            },
            onError: () => {
                openMessage('error', 'Xóa dịch vụ không thành công');
            },
        });
    };
    const onFinish = (values: {
        departmentId: number;
        serviceId: number;
        customPrice: number;
    }) => {
        if (isUpdate) {
            const doctorService: DoctorServiceUpdateDTO = {
                id: updatedId as number,
                serviceId: values.serviceId,
                customPrice: values.customPrice,
            };
            updateDoctorService(doctorService, {
                onSuccess: () => {
                    openMessage('success', 'Cập nhật thành công!');
                    refetch();
                    form.resetFields();
                    setIsUpdate(false);
                    setUpdatedId(null);
                },
                onError: () => {
                    openMessage('error', 'Cập nhật không thành công');
                },
            });
        } else {
            const doctorService: DoctorServiceCreateDTO = {
                doctorId: doctorId as number,
                serviceId: values.serviceId,
                customPrice: values.customPrice,
            };
            createDoctorService(doctorService, {
                onSuccess: () => {
                    openMessage('success', 'Thêm thành công!');
                    refetch();
                    form.resetFields();
                },
                onError: () => {
                    openMessage('error', 'Thêm không thành công');
                },
            });
        }
    };
    return (
        <>
            <Form
                layout="vertical"
                className="mb-4"
                form={form}
                onFinish={onFinish}
            >
                <Row gutter={[24, 24]}>
                    <Col span={12}>
                        <Form.Item
                            label="Chọn chuyên khoa"
                            name={'departmentId'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn chuyên khoa!',
                                },
                            ]}
                            className="mb-0"
                        >
                            <Select
                                onChange={(value: number) =>
                                    setDepartmentId(value)
                                }
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                placeholder="Chọn chuyên khoa"
                                options={departments?.departments?.map(
                                    (department: Department) => ({
                                        label: department.name,
                                        value: department.id,
                                    })
                                )}
                            ></Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Chọn dịch vụ"
                            name={'serviceId'}
                            className="mb-0"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn dịch vụ!',
                                },
                            ]}
                        >
                            <Select
                                onChange={(value: number) => {
                                    const selectedService =
                                        serviceResponse?.find(
                                            (service: Service) =>
                                                service.id === value
                                        );
                                    form.setFieldsValue({
                                        customPrice: selectedService.basePrice,
                                    });
                                }}
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                placeholder="Chọn dịch vụ"
                                options={serviceResponse?.map(
                                    (service: Service) => ({
                                        label: service.serviceName,
                                        value: service.id,
                                    })
                                )}
                            ></Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Giá dịch vụ"
                            name={'customPrice'}
                            className="mb-0"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá dịch vụ!',
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập giá dịch vụ"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} className="text-center">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full"
                        >
                            Lưu
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Skeleton active loading={isFetching || isRefetching}>
                <Card>
                    <List
                        dataSource={doctorService}
                        renderItem={(item: DoctorService) => (
                            <List.Item
                                actions={[
                                    <Button
                                        type="link"
                                        icon={<EditOutlined />}
                                        onClick={() => {
                                            form.setFieldsValue({
                                                departmentId: item.departmentId,
                                                serviceId: item.serviceId,
                                                customPrice: item.customPrice,
                                            });
                                            setIsUpdate(true);
                                            setUpdatedId(item.id);
                                            setDepartmentId(item.departmentId);
                                        }}
                                    >
                                        Chỉnh sửa
                                    </Button>,
                                    <Popconfirm
                                        title={`Bạn có chắc muốn xóa dịch vụ này?`}
                                        onConfirm={() => handleDelete(item.id)}
                                        okText="Xóa"
                                        cancelText="Hủy"
                                    >
                                        <Button
                                            type="link"
                                            icon={<DeleteOutlined />}
                                            danger
                                        >
                                            Xóa
                                        </Button>
                                    </Popconfirm>,
                                ]}
                            >
                                <List.Item.Meta
                                    title={item.serviceName}
                                    description={`Giá dịch vụ: ${item.customPrice} VNĐ`}
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            </Skeleton>
        </>
    );
};

export default InputServiceTab;
