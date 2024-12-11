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
} from 'antd';
import dayjs from 'dayjs';

import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { ProvinceType, DistrictType, WardType } from '../../../../models/other';
import axios from 'axios';
import { AppointmentService } from '../../../../services/appointmentService';
import socket from '../../../../socket';
import { useNavigate } from 'react-router-dom';
export const InputAppointmentModal = ({
    openModal,
    cancelModal,
    time,
    date,
    doctor,
    patientProfileCopy,
    openNotification,
}: any) => {
    const [provinces, setProvinces] = useState<ProvinceType[]>([]);
    const [districts, setDistricts] = useState<DistrictType[]>([]);
    const [wards, setWards] = useState<WardType[]>([]);
    const [district, setDistrict] = useState<DistrictType>({} as DistrictType);
    const [province, setProvince] = useState<ProvinceType>({} as ProvinceType);
    const [ward, setWard] = useState<WardType>({} as WardType);

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const onFinish = (values: any) => {
        const newAppointment = {
            doctor_id: doctor?.doctor_id,
            appointment_date: date,
            patient_name: values.patientName,
            patient_phone: values.phone,
            patient_email: values.email,
            birthday: dayjs(values.birthday).format('YYYY-MM-DD'),
            province: values.patientProvince,
            district: values.patientDistrict,
            commune: values.patientCommune,
            gender: values.gender,
            examination_reason: values.reason,
            doctor_name: doctor?.full_name,
            location: doctor.location,
            time_value: time.value,
            time_id: time.id,
            price: doctor.price,
            service_id: doctor.service_id,
            service_name: doctor.service_name,
        };
        console.log('newAppointment', newAppointment);
        CreateAppointment(newAppointment);
    };
    const CreateAppointment = async (newAppointment: any) => {
        try {
            const res: any = await AppointmentService.createAppointment(
                newAppointment
            );
            openNotification(
                'success',
                'Thông báo',
                'Đặt lịch hẹn thành công!'
            );
            cancelModal();
            navigate('/booking-success');

            socket.emit('addApp', newAppointment);
        } catch (err: any) {
            console.log(err.message);
            openNotification(
                'error',
                'Thông báo',
                'Đặt lịch hẹn không thành công!'
            );
        }
    };
    const getWards = async (districtId: any) => {
        try {
            const res = await axios.get(
                `https://vapi.vnappmob.com//api/province/ward/${districtId}`
            );
            setWards(res.data.results);
        } catch (err) {
            console.log(err);
        }
    };
    const getListDistrict = async (provinceId: any) => {
        try {
            const res = await axios.get(
                `https://vapi.vnappmob.com//api/province/district/${provinceId}`
            );

            setDistricts(res.data.results);
        } catch (err) {
            console.log(err);
        }
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
                    'https://vapi.vnappmob.com/api/province'
                );
                setProvinces(res.data.results);
            } catch (err) {
                console.log(err);
            }
        };
        getProvinces();
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
            className="w-75"
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
                            {doctor?.full_name}
                        </h6>
                    </div>
                    <div className="time">
                        <p className="">
                            <strong>Thời gian: </strong> {time.value}
                        </p>
                        <p>
                            {' '}
                            <strong>Ngày khám: </strong>
                            {date}
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
                            {doctor.price.toLocaleString(undefined)} đ
                        </p>
                    </div>
                    <div className="service">
                        <p>
                            <strong>Dịch vụ khám:</strong> {doctor.service_name}
                        </p>
                    </div>
                </Col>
                <Col span={16}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            patientName: patientProfileCopy.patient_name,
                            gender: patientProfileCopy.gender, // Giá trị mặc định: Nam,
                            email: patientProfileCopy.patient_email,
                            phone: patientProfileCopy.patient_phone,
                            birthday: dayjs(
                                patientProfileCopy.birthday,
                                'YYYY-MM-DD'
                            ),
                            patientProvince: patientProfileCopy.province,
                            patientDistrict: patientProfileCopy?.district,
                            patientCommune: patientProfileCopy?.commune,
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
                                // value={patientProfile?.patient_email}
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
                                //  value={patientProfile?.patient_phone}
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
                                className="d-block"
                                format={'YYYY-MM-DD'}
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
                                onChange={(e) => {
                                    const dis: any = districts.find(
                                        (item: any) => {
                                            return item.district_name === e;
                                        }
                                    );
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
                            <Select placeholder="Chọn xã/phường">
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
