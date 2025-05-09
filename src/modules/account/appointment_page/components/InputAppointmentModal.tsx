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

    const [provinces, setProvinces] = useState<ProvinceType[]>([]);
    const [districts, setDistricts] = useState<DistrictType[]>([]);
    const [wards, setWards] = useState<WardType[]>([]);
    const [district, setDistrict] = useState<DistrictType>({} as DistrictType);
    const [province, setProvince] = useState<ProvinceType>({} as ProvinceType);
    const [ward, setWard] = useState<WardType>({} as WardType);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [saveProfile, setSaveProfile] = useState<boolean>(false);
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
    useEffect(() => console.log(paymentMethods), [paymentMethods]);

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
                    fee: 10000,
                    serviceName: doctor.serviceName,
                };
                handleSendBookingSuccessMail(mailPayload);
                openMessage('Success', 'Đặt lịch hẹn thành công !');
                const queryParams = new URLSearchParams();
                queryParams.append('appointment', appointment.id.toString());
                queryParams.append('payment', values.payment_method.toString());
                const newInvoice = {
                    appointmentId: appointment.id,
                    doctorId: doctor.doctorId,
                    serviceId: doctor.serviceId,
                    amount: doctor.price,
                    paymentMethod: paymentMethod,
                };
                CreateInvoice(newInvoice);
                const newNotification = {
                    userId: doctor.doctorId,
                    message: 'Bạn có một lịch hẹn mới!',
                    appointmentId: appointment.id,
                };
                createNotification(newNotification);
                if (values.payment_method === 1) {
                    navigate(`/booking-success?${queryParams}`);
                } else {
                    createPayment.mutate(appointment.id);
                }
            },
            onError: (err) => {
                openMessage('Error', 'Đặt lịch hẹn không thành công !');
                console.error('Lỗi:', err.message);
            },
        });
    };

    useEffect(() => {
        getAllPaymentMethod();
        if (doctor) {
            const doctorId = searchParams.get('doctorId');
        }
    }, []);
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
                    <h6 className="title">Thông tin bác sĩ</h6>
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
                    <div className="fee">
                        <p>
                            {' '}
                            <strong>Phí khám: </strong>{' '}
                            {doctor?.price?.toLocaleString(undefined)} đ
                        </p>
                    </div>
                    <div className="service">
                        <p>
                            <strong>Dịch vụ khám:</strong> {doctor.serviceName}
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
                        {/* Reason */}
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
