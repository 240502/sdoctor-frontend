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
import { AppointmentService } from '../../../../services/appointment.service';
import { useNavigate } from 'react-router-dom';
import { DatePickerProps } from 'antd/lib';
import { PatientProfileService } from '../../../../services/patient_profile.service';
import { useSetRecoilState } from 'recoil';
import { patientProfileState } from '../../../../stores/patientAtom';
import { PaymentMethod } from '../../../../models/paymentMethod';
import { PaymentMethodService } from '../../../../services/payment_method.service';
import { MailerService } from '../../../../services/mailer.service';
export const InputAppointmentModal = ({
    openModal,
    cancelModal,
    date,
    doctor,
    patientProfileCopy,
    openNotification,
    setPatientProfileCopy,
    patientProfile,
    setPaymentMethod,
    scheduleDetail,
}: any) => {
    const [provinces, setProvinces] = useState<ProvinceType[]>([]);
    const [districts, setDistricts] = useState<DistrictType[]>([]);
    const [wards, setWards] = useState<WardType[]>([]);
    const [district, setDistrict] = useState<DistrictType>({} as DistrictType);
    const [province, setProvince] = useState<ProvinceType>({} as ProvinceType);
    const [ward, setWard] = useState<WardType>({} as WardType);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [different, setDifferent] = useState<boolean>(false);
    const [saveProfile, setSaveProfile] = useState<boolean>(false);
    const [form] = Form.useForm();
    const setPatientProfile = useSetRecoilState(patientProfileState);
    const navigate = useNavigate();
    const onChangeSwitch = (checked: boolean) => {
        setSaveProfile(checked);
    };
    const getAllPaymentMethod = async () => {
        try {
            const res = await PaymentMethodService.getAllPaymentMethod();
            setPaymentMethods(res?.data);
        } catch (err: any) {
            setPaymentMethods([]);
            console.log(err.message);
        }
    };

    useEffect(() => console.log(paymentMethods), [paymentMethods]);
    useEffect(() => console.log('doctor input', doctor), []);

    const onFinish = (values: any) => {
        setPaymentMethod(values.payment_method);
        const newAppointment = {
            doctorId: doctor?.doctorId,
            appointmentDate: date,
            patientName: values.patientName,
            patientPhone: values.phone,
            patientEmail: values.email,
            birthday: dayjs(values.birthday).format('YYYY-MM-DD'),
            province: values.patientProvince,
            district: values.patientDistrict,
            commune: values.patientCommune,
            gender: values.gender,
            examinationReason: values.reason,
            doctorName: doctor?.fullName,
            location: doctor.location,
            timeValue: `${scheduleDetail.startTime} - ${scheduleDetail.endTime}`,
            timeId: scheduleDetail.timeId,
            price: doctor.price,
            serviceId: doctor.serviceId,
            serviceName: doctor.serviceName,
        };
        CreateAppointment(newAppointment);
        if (saveProfile) {
            UpdateProfile();
        }
    };
    const UpdateProfile = async () => {
        try {
            const res = await PatientProfileService.updatePatientProfile({
                ...patientProfileCopy,
                birthday: patientProfileCopy.birthday.toString().slice(0, 10),
            });
            setPatientProfile(patientProfileCopy);
            console.log(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    const CreateAppointment = async (newAppointment: any) => {
        try {
            const res: any = await AppointmentService.createAppointment(
                newAppointment
            );
            console.log(res);
            const data = {
                patientName: newAppointment.patientName,
                email: newAppointment.patientEmail,
                doctorName: newAppointment.doctorName,
                time: newAppointment.timeValue,
                date: newAppointment.appointmentDate,
                location: newAppointment.location,
                status: 'Chờ xác nhận',
                fee: newAppointment.price,
                serviceName: newAppointment.serviceName,
            };
            sendBookingSuccessMail(data);
            openNotification(
                'success',
                'Thông báo',
                'Đặt lịch hẹn thành công!'
            );
            cancelModal();
            navigate('/booking-success');

            //socket.emit('addApp', newAppointment);
        } catch (err: any) {
            console.log('book appointment error', err.message);
            openNotification(
                'error',
                'Thông báo',
                'Đặt lịch hẹn không thành công!'
            );
        }
    };
    const sendBookingSuccessMail = async (data: any) => {
        try {
            const res = await MailerService.sendBookingSuccessMail(data);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const getWards = async (districtId: any) => {
        try {
            const res = await axios.get(
                `https://vapi.vnappmob.com//api/v2/province/ward/${districtId}`
            );
            setWards(res.data.results);
        } catch (err) {
            console.log(err);
        }
    };
    const getListDistrict = async (provinceId: any) => {
        try {
            const res = await axios.get(
                `https://vapi.vnappmob.com//api/v2/province/district/${provinceId}`
            );

            setDistricts(res.data.results);
        } catch (err) {
            console.log(err);
        }
    };
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        setPatientProfileCopy({ ...patientProfileCopy, birthday: dateString });
    };

    //find province when patient had a profile
    useEffect(() => {
        const getProvince = () => {
            const province: any = provinces.find(
                (item) => item?.province_name === patientProfileCopy.province
            );
            if (province) {
                setProvince(province);
            }
        };
        if (provinces.length > 1) {
            getProvince();
        }
    }, [provinces.length]);

    //find district when patient had a profile
    useEffect(() => {
        const getDistrict = () => {
            const district: any = districts.find(
                (item) => item.district_name === patientProfileCopy.district
            );
            if (district) {
                setDistrict(district);
            }
        };
        if (districts.length > 1) {
            getDistrict();
        }
    }, [districts.length]);
    //find ward when patient had a profile
    useEffect(() => {
        const getWards = () => {
            const ward = wards.find(
                (item) => item.ward_name === patientProfileCopy.commune
            );
            if (ward) {
                setWard(ward);
            }
        };
        if (wards.length > 1) {
            getWards();
        }
    }, [wards.length]);

    //get list district of province when change province
    useEffect(() => {
        if (province.province_id !== 0) {
            getListDistrict(province.province_id);
        }
    }, [province.province_id]);

    //get list ward of district when change district
    useEffect(() => {
        if (districts.length > 1) {
            if (district !== undefined) {
                getWards(district.district_id);
            }
        }
    }, [district.district_id]);
    //find province when patient had a profile
    useEffect(() => {
        const getProvince = () => {
            const province: any = provinces.find(
                (item) => item?.province_name === patientProfileCopy.province
            );
            if (province) {
                setProvince(province);
            }
        };
        if (provinces.length > 1) {
            getProvince();
        }
    }, [provinces.length]);

    useEffect(() => {
        const getProvinces = async () => {
            try {
                const res = await axios.get(
                    'https://vapi.vnappmob.com/api/v2/province'
                );
                setProvinces(res.data.results);
            } catch (err) {
                console.log(err);
            }
        };
        getProvinces();
        getAllPaymentMethod();
    }, []);
    useEffect(() => {
        if (
            JSON.stringify({
                ...patientProfile,
                birthday: patientProfile.birthday.toString().slice(0, 10),
            }) !==
            JSON.stringify({
                ...patientProfileCopy,
                birthday: patientProfileCopy.birthday.toString().slice(0, 10),
            })
        ) {
            setDifferent(true);
        } else {
            setDifferent(false);
        }
    }, [patientProfileCopy]);

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
                            <strong>Thời gian: </strong>{' '}
                            {scheduleDetail.startTime} -{' '}
                            {scheduleDetail.endTime}
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
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            patientName: patientProfileCopy.patientName,
                            gender: patientProfileCopy.gender, // Giá trị mặc định: Nam,
                            email: patientProfileCopy.patientEmail,
                            phone: patientProfileCopy.patientPhone,
                            birthday: dayjs(
                                patientProfileCopy.birthday,
                                'YYYY-MM-DD'
                            ),
                            patientProvince: patientProfileCopy.province,
                            patientDistrict: patientProfileCopy?.district,
                            patientCommune: patientProfileCopy?.commune,
                            payment_method: 1,
                        }}
                    >
                        {/* Tên bệnh nhân */}
                        <Form.Item
                            label="Họ và Tên"
                            name="patientName"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Vui lòng nhập đầy đủ họ và tên bệnh nhân',
                                },
                                {
                                    pattern: /^[\p{L} ]+$/u,
                                    message:
                                        'Tên chỉ được chứa ký tự chữ cái và khoảng trắng',
                                },
                                {
                                    min: 3,
                                    message: 'Tên phải có ít nhất 3 ký tự',
                                },
                                {
                                    max: 50,
                                    message: 'Tên không được dài quá 50 ký tự',
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập họ và tên..."
                                onChange={(e) => {
                                    setPatientProfileCopy({
                                        ...patientProfileCopy,
                                        patient_name: e.target.value,
                                    });
                                }}
                                // value={patientProfile?.patient_name}
                            />
                        </Form.Item>
                        {/* Giới tính */}
                        <Form.Item
                            label="Giới tính"
                            name="gender"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn giới tính',
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio value={1}>Nam</Radio>
                                <Radio value={2}>Nữ</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {/* Email */}
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email',
                                },
                                {
                                    type: 'email',
                                    message: 'Email không hợp lệ',
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập địa chỉ email..."
                                onChange={(e) => {
                                    setPatientProfileCopy({
                                        ...patientProfileCopy,
                                        patient_email: e.target.value,
                                    });
                                }}
                            />
                        </Form.Item>
                        {/* Phone */}
                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số điện thoại',
                                },
                                {
                                    pattern: /^(03|05|07|08|09)\d{8}$/,
                                    message:
                                        'Số điện thoại không hợp lệ. Phải là số di động 10 chữ số',
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập số điện thoại..."
                                onChange={(e) => {
                                    setPatientProfileCopy({
                                        ...patientProfileCopy,
                                        patient_phone: e.target.value,
                                    });
                                }}
                            />
                        </Form.Item>
                        {/* Birthday */}
                        <Form.Item
                            label="Ngày/Tháng/Năm sinh"
                            name="birthday"
                            rules={[
                                {
                                    required: true,
                                    message: 'Không được để trống ô này',
                                },
                            ]}
                        >
                            <DatePicker
                                onChange={onChange}
                                className="d-block"
                                format={'DD-MM-YYYY'}
                            />
                        </Form.Item>
                        {/* Tỉnh thành */}
                        <Form.Item
                            label="Tỉnh/Thành"
                            name="patientProvince"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn tỉnh/thành',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Chọn tỉnh/thành"
                                showSearch
                                optionFilterProp="children"
                                allowClear
                                onChange={(e) => {
                                    const pro: any = provinces.find(
                                        (province: any) => {
                                            return province.province_name === e;
                                        }
                                    );
                                    setPatientProfileCopy({
                                        ...patientProfileCopy,
                                        province: pro.province_name,
                                    });
                                    setProvince(pro);

                                    form.setFieldValue('patientDistrict', null);
                                    form.setFieldValue('patientCommune', null);
                                }}
                            >
                                {provinces.map((province: ProvinceType) => {
                                    return (
                                        <Select.Option
                                            value={province.province_name}
                                            key={province.province_id}
                                        >
                                            {province.province_name}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                        {/* Quận huyện */}
                        <Form.Item
                            label="Quận/Huyện"
                            name="patientDistrict"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn quận/huyện',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Chọn quân/huyện"
                                showSearch
                                allowClear
                                optionFilterProp="children"
                                onChange={(e) => {
                                    const dis: any = districts.find(
                                        (item: any) => {
                                            return item.district_name === e;
                                        }
                                    );
                                    setPatientProfileCopy({
                                        ...patientProfileCopy,
                                        district: dis.district_name,
                                    });
                                    setDistrict(dis);
                                    form.setFieldValue('patientCommune', null);
                                }}
                            >
                                {districts.map((district: DistrictType) => {
                                    return (
                                        <Select.Option
                                            key={district.district_id}
                                            value={district.district_name}
                                        >
                                            {district.district_name}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                        {/* Xã phường */}
                        <Form.Item
                            label="Xã/Phường"
                            name="patientCommune"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn xã/phường',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Chọn xã/phường"
                                showSearch
                                allowClear
                                optionFilterProp="children"
                                onChange={(e) => {
                                    console.log(e);
                                    setPatientProfileCopy({
                                        ...patientProfileCopy,
                                        commune: e,
                                    });
                                }}
                            >
                                {wards.map((ward: WardType) => {
                                    return (
                                        <Select.Option
                                            key={ward.ward_id}
                                            value={ward.ward_name}
                                        >
                                            {ward.ward_name}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                        {/* Reason */}
                        <Form.Item label="Lý do khám" name="reason">
                            <TextArea placeholder="Nhập lý do khám..." />
                        </Form.Item>
                        <Form.Item
                            label="Phương thức thanh toán"
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
                        {different && (
                            <Form.Item>
                                <Switch onChange={onChangeSwitch} />
                                <label className="ms-2">
                                    Cập nhập lại hồ sơ
                                </label>
                            </Form.Item>
                        )}
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
