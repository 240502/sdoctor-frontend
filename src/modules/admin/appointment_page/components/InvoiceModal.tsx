import {
    Modal,
    Button,
    Row,
    Col,
    Form,
    Input,
    Select,
    DatePicker,
    Card,
    List,
    Popconfirm,
    Skeleton,
} from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import {
    useCreateInvoiceDetail,
    useDeleteInvoiceDetail,
    useFetchInvoiceByAppointment,
    useFetchInvoiceById,
    useUpdateInvoice,
} from '../../../../hooks/invoice/useInvoice';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { DoctorService } from '../../../../models/doctor_service';
import { useFetchDoctorServicesByDoctorId } from '../../../../hooks/doctor_service';
import { DeleteOutlined } from '@ant-design/icons';
import { NoticeType } from 'antd/es/message/interface';

interface InvoiceModalProps {
    openInvoiceModal: boolean;
    cancelInvoiceModal: () => void;
    openMessage: (type: NoticeType, content: string) => void;
    isUpdate: boolean;
}

export const InvoiceModal = ({
    openInvoiceModal,
    cancelInvoiceModal,
    openMessage,
    isUpdate,
}: InvoiceModalProps) => {
    const [form] = Form.useForm();
    const { mutate: createInvoiceDetail } = useCreateInvoiceDetail();
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const [doctorServices, setDoctorServices] = useState<[]>([]);
    const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const { mutate: updateInvoice } = useUpdateInvoice();
    const { data, isError, error, refetch, isFetching, isRefetching } =
        useFetchInvoiceByAppointment(
            searchParams.get('appointment')
                ? Number(searchParams.get('appointment'))
                : null
        );
    const { data: doctorServiceResponse } = useFetchDoctorServicesByDoctorId(
        data?.doctorId || null
    );
    const handleChangeService = (values: number[]) => {
        setSelectedServiceIds(values);
    };

    const onFinish = (values: any) => {
        if (isUpdate) {
            updateInvoice(
                {
                    invoiceId: data?.id,
                    paymentMethod: values.paymentMethod,
                },
                {
                    onSuccess() {
                        queryClient.removeQueries({
                            queryKey: [
                                'useFetchInvoiceById',
                                Number(searchParams.get('invoice')),
                            ],
                        });
                        openMessage('success', 'Cập nhật thành công!');
                        cancelInvoiceModal();
                    },
                    onError() {
                        queryClient.removeQueries({
                            queryKey: [
                                'useFetchInvoiceById',
                                Number(searchParams.get('invoice')),
                            ],
                        });
                        openMessage('error', 'Cập nhật không thành công!');
                    },
                }
            );
        } else {
        }
    };

    const { mutate: deleteInvoiceDetail } = useDeleteInvoiceDetail();
    const handleAddService = () => {
        const availableServices =
            doctorServiceResponse?.filter(
                (service: any) =>
                    !doctorServices.some((ds: any) => ds.id === service.id)
            ) || [];
        if (availableServices.length === 0) {
            openMessage('warning', 'Tất cả dịch vụ đã được thêm!');
            return;
        }
        setIsModalVisible(true);
    };

    const handleServiceModalOk = () => {
        if (isUpdate) {
            const newServiceIds: any = [];
            selectedServiceIds.forEach((id: number) => {
                if (
                    !doctorServices.some(
                        (doctorService: any) => doctorService.id === id
                    )
                ) {
                    newServiceIds.push(id);
                }
            });
            const payload: any[] = [];
            newServiceIds.forEach((id: any) => {
                console.log(doctorServiceResponse);

                const service = doctorServiceResponse.find(
                    (doctorService: DoctorService) => doctorService.id === id
                );
                payload.push({
                    invoiceId: data?.id,
                    serviceId: id,
                    price: Number(service?.customPrice),
                });
            });
            createInvoiceDetail(payload, {
                onSuccess() {
                    setIsModalVisible(false);
                    refetch();
                },
            });
        }
    };
    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                patientName: data?.patientName,
                doctorName: data?.doctorName,
                appointmentDate: dayjs(data?.appointmentDate),
                timeValue: data?.startTime + ' - ' + data?.endTime,
                amount: data?.amount,
                paymentMethod: data?.paymentMethod,
            });
            const serviceIds = data?.serviceIds
                ?.split(',')
                .map((item: any) => Number(item.trim()));
            const serviceNames = data?.serviceNames?.split(',');
            const prices = data?.prices
                ?.split(',')
                .map((price: string) => Number(price));
            const detailIds = data?.detailIds?.split(',');
            const services = serviceIds?.map((id: string, index: number) => ({
                id: Number(id),
                name: serviceNames[index],
                price: prices[index],
                detailId: Number(detailIds[index].trim()),
            }));
            setDoctorServices(services);
            setSelectedServiceIds(serviceIds);
        }
    }, [data]);
    const handleDeleteInvoiceDetail = (id: number) => {
        deleteInvoiceDetail(id, {
            onSuccess: () => {
                openMessage('success', 'Xóa dịch vụ thành công!');
                refetch();
            },
            onError: (error: any) => {
                openMessage('error', 'Xóa dịch vụ không thành công!');
            },
        });
    };
    return (
        <>
            <Modal
                className="w-50"
                title="Chi tiết hóa đơn"
                open={openInvoiceModal}
                onCancel={cancelInvoiceModal}
                footer={[
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() => form.submit()}
                    >
                        Lưu
                    </Button>,
                    <Button onClick={cancelInvoiceModal}>Đóng</Button>,
                ]}
            >
                <Skeleton active loading={isFetching || isRefetching}>
                    <Form onFinish={onFinish} form={form} layout="vertical">
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    label="Bệnh nhân"
                                    name={'patientName'}
                                    className="d-block"
                                >
                                    <Input className="d-block"></Input>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Bác sĩ kiểm tra"
                                    name={'doctorName'}
                                >
                                    <Input className="d-block" readOnly></Input>
                                </Form.Item>
                            </Col>
                            {!isUpdate && (
                                <Col span={12}>
                                    <Form.Item
                                        label="Số điện thoại bệnh nhân"
                                        name={'patientPhone'}
                                    >
                                        <Input></Input>
                                    </Form.Item>
                                </Col>
                            )}
                            <Col span={12}>
                                <Form.Item
                                    label="Ngày khám"
                                    name={'appointmentDate'}
                                >
                                    <DatePicker
                                        className="w-100 pe-none"
                                        format={'DD-MM-YYYY'}
                                    ></DatePicker>
                                </Form.Item>
                            </Col>
                            {isUpdate && (
                                <Col span={12}>
                                    <Form.Item
                                        label="Giờ khám"
                                        name={'timeValue'}
                                    >
                                        <Input
                                            className="d-block"
                                            readOnly={isUpdate}
                                        ></Input>
                                    </Form.Item>
                                </Col>
                            )}

                            <Col span={12}>
                                <Form.Item
                                    name={'amount'}
                                    key={'amount'}
                                    label="Tổng tiền"
                                >
                                    <Input readOnly></Input>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name={'paymentMethod'}
                                    key={'paymentMethod'}
                                    label={'Phương thức thanh toán'}
                                >
                                    <Select
                                        placeholder="Chọn phương thức thanh toán"
                                        allowClear
                                    >
                                        <Select.Option value={1}>
                                            Thanh toán tại cơ sở y tế
                                        </Select.Option>
                                        <Select.Option value={2}>
                                            Thanh toán qua ZaloPay
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24} className="text-center">
                                <h6 className="text-start">Dịch vụ</h6>
                                <Card>
                                    <List
                                        dataSource={doctorServices}
                                        renderItem={(item: any) => (
                                            <List.Item
                                                actions={[
                                                    <Popconfirm
                                                        title={`Bạn có chắc muốn xóa dịch vụ này?`}
                                                        onConfirm={() =>
                                                            handleDeleteInvoiceDetail(
                                                                item.detailId
                                                            )
                                                        }
                                                        okText="Xóa"
                                                        cancelText="Hủy"
                                                    >
                                                        <Button
                                                            type="link"
                                                            icon={
                                                                <DeleteOutlined />
                                                            }
                                                            danger
                                                        >
                                                            Xóa
                                                        </Button>
                                                    </Popconfirm>,
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    className="text-start"
                                                    title={item.name}
                                                />
                                                <List.Item.Meta
                                                    className="text-start"
                                                    title={
                                                        item?.price?.toLocaleString() +
                                                        ' VNĐ'
                                                    }
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                                <Button
                                    className="mt-3"
                                    onClick={handleAddService}
                                >
                                    Thêm dịch vụ
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Skeleton>
            </Modal>
            <Modal
                title="Chọn dịch vụ"
                className="w-50"
                open={isModalVisible}
                onOk={handleServiceModalOk}
                onCancel={() => setIsModalVisible(false)}
                okText="Thêm"
                cancelText="Hủy"
            >
                <Form layout="vertical">
                    <Form.Item label="Dịch vụ">
                        <Select
                            mode="multiple"
                            placeholder="Chọn dịch vụ"
                            value={selectedServiceIds}
                            onChange={(values: number[]) => {
                                if (
                                    selectedServiceIds.length === 1 &&
                                    values.length === 0
                                ) {
                                    openMessage(
                                        'warning',
                                        'Số lượng dịch vụ phải >= 1'
                                    );
                                    return;
                                }

                                handleChangeService(values);
                            }}
                            options={doctorServiceResponse?.map(
                                (service: DoctorService) => ({
                                    value: service.id,
                                    label: `${
                                        service.serviceName
                                    } - ${service.customPrice?.toLocaleString()} VNĐ`,
                                })
                            )}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
