import {
    Form,
    Modal,
    Input,
    Button,
    Row,
    Col,
    Image,
    Divider,
    Radio,
    DatePicker,
    Select,
    Switch,
    InputNumber,
} from 'antd';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { ProvinceType, DistrictType, WardType } from '../../../../models/other';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DatePickerProps } from 'antd/lib';
import { useSetRecoilState } from 'recoil';
import { PaymentMethod } from '../../../../models/payment_method';
import { invoicesService, paymentMethodService } from '../../../../services';
import { useCreateAppointment } from '../../../../hooks/appointments';
import {
    useCreateNotification,
    useCreatePayment,
    useSendBookingSuccessMail,
} from '../../../../hooks';
import { invoiceState } from '../../../../stores/invoice';
import {
    EnvironmentFilled,
    EnvironmentOutlined,
    PhoneOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useFetchDoctorServicesByDoctorId } from '../../../../hooks/doctor_service';
import { DoctorService } from '../../../../models/doctor_service';
import { Doctor, InvoicesCreateDto } from '../../../../models';

const InputAppointmentModal = ({
    openModal,
    cancelModal,
    date,
    doctor,
    openMessage,
    patientProfile,
    schedule,
    refetch,
}: any) => {
    const [searchParams] = useSearchParams();
    const { data: doctorService } = useFetchDoctorServicesByDoctorId(
        doctor?.doctorId
    );
    const [selectedServices, setSelectedServices] = useState<
        DoctorService[] | null
    >(null);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const getAllPaymentMethod = async () => {
        try {
            const res = await paymentMethodService.getAllPaymentMethod();
            setPaymentMethods(res?.data);
        } catch (err: any) {
            setPaymentMethods([]);
            console.log(err.message);
        }
    };
    const sendBookingSuccessMail = useSendBookingSuccessMail();
    const { mutate: createAppointment } = useCreateAppointment();
    const handleSendBookingSuccessMail = (payload: any) => {
        sendBookingSuccessMail.mutate(payload, {
            onSuccess() {
                console.log('send mail successful');
            },
            onError(error) {
                console.log('error:', error);
            },
        });
    };
    const setInvoice = useSetRecoilState(invoiceState);
    const CreateInvoice = async (data: any) => {
        try {
            const res = await invoicesService.createInvoice(data);
            console.log('response create invoice', res?.data?.result[0][0]);

            setInvoice(res?.data?.result[0][0]);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const createPayment = useCreatePayment();

    const [paymentMethod, setPaymentMethod] = useState<number>(1);
    const { mutate: createNotification } = useCreateNotification();

    const onFinish = (values: any) => {
        setPaymentMethod(values.payment_method);
        const newAppointment = {
            doctorId: doctor?.doctorId,
            appointmentDate: date,
            examinationReason: values.reason,
            location: doctor.location,
            uuid: patientProfile.uuid,
            scheduleId: schedule.id,
            type: 'doctor',
        };
        createAppointment(newAppointment, {
            onSuccess: (data) => {
                const appointment = data.data.result;
                const mailPayload = {
                    patientName: patientProfile.patientName,
                    email: patientProfile.patientEmail,
                    doctorName: doctor.fullName,
                    time: `${schedule.startTime}-${schedule.endTime}`,
                    date: date,
                    location: doctor.location,
                    status: 'Chờ xác nhận',
                    fee: values.servicePrice,
                    serviceName: selectedServices
                        ?.map((service: DoctorService) => service.serviceName)
                        .join(', '),
                };
                handleSendBookingSuccessMail(mailPayload);
                openMessage('Success', 'Đặt lịch hẹn thành công !');
                const queryParams = new URLSearchParams();
                queryParams.append('appointment', appointment.id.toString());
                queryParams.append('payment', values.payment_method.toString());
                const newInvoice: InvoicesCreateDto = {
                    appointmentId: appointment?.id,
                    doctorId: doctor.doctorId,
                    amount: values.servicePrice,
                    services: selectedServices?.map(
                        (service: DoctorService) => {
                            return {
                                serviceId: service.id,
                                price: service.customPrice,
                            };
                        }
                    ),
                    paymentMethod: values.payment_method,
                };
                CreateInvoice(newInvoice);
                const newNotification = {
                    userId: doctor.doctorId,
                    message: 'Bạn có một lịch hẹn mới!',
                    appointmentId: appointment.id,
                };
                createNotification(newNotification, {
                    onSuccess() {
                        if (values.payment_method === 1) {
                            navigate(`/booking-success?${queryParams}`);
                        } else {
                            console.log(values.payment_method);

                            createPayment.mutate(appointment.id);
                        }
                    },
                });
            },
            onError: (err) => {
                openMessage('Error', 'Đặt lịch hẹn không thành công !');
                console.error('Lỗi:', err.message);
            },
        });
    };

    useEffect(() => {
        getAllPaymentMethod();
    }, []);
    useEffect(() => {
        if (doctorService && doctorService.length > 0) {
            const firstService = doctorService[0];
            form.setFieldsValue({
                serviceId: firstService.id,
                servicePrice: Number(firstService.customPrice),
            });
        }
    }, [doctorService]);
    return (
        <Modal
            title={
                <>
                    <h6>Phiếu đặt lịch khám</h6>
                    <Divider />
                </>
            }
            open={openModal}
            onCancel={cancelModal}
            maskClosable={false}
            footer={[]}
            className="w-50"
        >
            <Row gutter={24}>
                <Col
                    span={8}
                    className="left appointment-info border border-start-0 border-top-0 border-bottom-0"
                >
                    <h6 className="">Thông tin bác sĩ</h6>
                    <div className="doctor-info text-center">
                        <Image
                            src={doctor?.image}
                            preview={false}
                            className="w-25 rounded-circle"
                        />
                        <h6 className="doctor-name w-full mt-3">
                            {doctor?.fullName}
                        </h6>
                    </div>
                    <div className="time">
                        <p className="">
                            <strong>Thời gian: </strong> {schedule.startTime} -{' '}
                            {schedule.endTime}
                        </p>
                        <p>
                            {' '}
                            <strong>Ngày khám: </strong>
                            {dayjs(date).format('DD-MM-YYYY')}
                        </p>
                    </div>
                    <div className="location ">
                        <p>
                            {' '}
                            <strong>Địa điểm: </strong> {doctor.location}
                        </p>
                    </div>
                </Col>
                <Col span={16}>
                    <h6>Thông tin bệnh nhân</h6>
                    <Row gutter={24} className="mb-3">
                        <Col span={24}>
                            <Col span={24} className="d-flex mb-2">
                                <div className="col-5">
                                    <label htmlFor="">
                                        <UserOutlined className="fs-6 text-body-tertiary" />
                                        <span className="ms-2 fs-6 ">
                                            Họ và tên :
                                        </span>
                                    </label>
                                </div>
                                <div className="col-7">
                                    <span className="col-6 fs-6 fw-medium">
                                        {patientProfile.patientName.toUpperCase()}
                                    </span>
                                </div>
                            </Col>
                            <Col span={24} className="d-flex mb-2">
                                <div className="col-5">
                                    <label className="fs-6">
                                        <i className="fs-6  fa-solid fa-cake-candles d-inline-block  text-body-tertiary"></i>
                                        <span className="ms-2 fs-6 ">
                                            Ngày sinh :
                                        </span>
                                    </label>
                                </div>
                                <div className="col-7">
                                    <span className="col-6 fs-6 fw-medium">
                                        {dayjs(patientProfile.birthday).format(
                                            'DD/MM/YYYY'
                                        )}
                                    </span>
                                </div>
                            </Col>
                            <Col span={24} className="d-flex mb-2">
                                <div className="col-5">
                                    <label className="fs-6">
                                        <PhoneOutlined className="text-body-tertiary" />
                                        <span className="ms-2 fs-6 ">
                                            Số điện thoại :
                                        </span>
                                    </label>
                                </div>
                                <div className="col-7">
                                    <span className="col-6 fs-6 fw-medium">
                                        {patientProfile.patientPhone}
                                    </span>
                                </div>
                            </Col>
                            <Col span={24} className="d-flex mb-2">
                                <div className="col-5">
                                    <label className="fs-6">
                                        <EnvironmentOutlined className="text-body-tertiary" />
                                        <span className="ms-2 fs-6 ">
                                            Địa chỉ :
                                        </span>
                                    </label>
                                </div>
                                <div className="col-7">
                                    <span className="col-6 fs-6  fw-medium">
                                        {patientProfile.commune +
                                            ',' +
                                            patientProfile.district +
                                            ',' +
                                            patientProfile.province}
                                    </span>
                                </div>
                            </Col>
                            <Col span={24} className="d-flex mb-2">
                                <div className="col-5">
                                    <label className="fs-6">
                                        <i className="fa-regular fa-envelope  text-body-tertiary"></i>
                                        <span className="ms-2 fs-6 ">
                                            Địa chỉ email :
                                        </span>
                                    </label>
                                </div>
                                <div className="col-7">
                                    <span className="col-6 fs-6 fw-medium">
                                        {patientProfile.patientEmail}
                                    </span>
                                </div>
                            </Col>
                        </Col>
                    </Row>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            payment_method: 1,
                        }}
                    >
                        <Form.Item
                            label={<p className="fw-bold mb-2">Dịch vụ khám</p>}
                            name="serviceId"
                        >
                            <Select
                                placeholder="Chọn dịch vụ khám"
                                className="w-100"
                                mode="multiple"
                                onChange={(values: number[]) => {
                                    console.log('value', values);
                                    let totalPrice: number =
                                        form.getFieldValue('servicePrice');
                                    const selectedServices = values.map(
                                        (value: number, index: number) => {
                                            const selectedService =
                                                doctorService?.find(
                                                    (service: DoctorService) =>
                                                        service.id === value
                                                );

                                            if (index === 0) {
                                                totalPrice += 0;
                                            } else {
                                                totalPrice += Number(
                                                    selectedService.customPrice
                                                );
                                            }

                                            return selectedService;
                                        }
                                    );
                                    console.log(
                                        'selectedServices',
                                        selectedServices
                                    );

                                    setSelectedServices(selectedServices);
                                    form.setFieldsValue({
                                        servicePrice: totalPrice,
                                    });
                                }}
                                options={doctorService?.map(
                                    (service: DoctorService) => ({
                                        label: service.serviceName,
                                        value: service.id,
                                    })
                                )}
                            ></Select>
                        </Form.Item>
                        <Form.Item
                            label={<p className="fw-bold mb-2">Giá vụ khám</p>}
                            name="servicePrice"
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                readOnly
                                addonAfter="VND"
                                formatter={(value) =>
                                    `${Number(value).toLocaleString()}`
                                }
                            />
                        </Form.Item>
                        <Form.Item
                            label={<p className="fw-bold mb-2">Lý do khám</p>}
                            name="reason"
                        >
                            <TextArea placeholder="Nhập lý do khám..." />
                        </Form.Item>
                        <Form.Item
                            label={
                                <p className="fw-bold mb-2">
                                    Phương thức thanh toán
                                </p>
                            }
                            name="payment_method"
                        >
                            <Radio.Group onChange={(e: any) => {}}>
                                {paymentMethods?.map(
                                    (paymentMethod: PaymentMethod) => {
                                        return (
                                            <Radio
                                                value={paymentMethod.id}
                                                key={paymentMethod.id}
                                                className="w-100 mb-1"
                                            >
                                                {paymentMethod.name}
                                            </Radio>
                                        );
                                    }
                                )}
                            </Radio.Group>
                        </Form.Item>

                        {/* Nút Lưu */}
                        <Form.Item className="text-center">
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-50  pt-3 pb-3"
                            >
                                Đặt lịch
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Modal>
    );
};

export default InputAppointmentModal;
