import { useState, useEffect, useRef } from 'react';
import {
    Button,
    Modal,
    Form,
    Image,
    Input,
    Radio,
    Select,
    InputRef,
    RadioChangeEvent,
} from 'antd';
import { baseURL } from '../../../constants/api';
import axios from 'axios';
import { isEmpty } from '../../../utils/global';
import socket from '../../../socket';
import { ScheduleDetails } from '../../../models/schedule_details';
const { TextArea } = Input;
export const ModalOrderAppointment = ({
    isModalOpen,
    doctor,
    setIsModalOpen,
    time,
    date,
}: any): JSX.Element => {
    const [provinces, setProvinces] = useState([
        { province_id: 0, province_name: '' },
    ]);

    const [districts, setDistricts] = useState([
        { district_id: 0, district_name: '' },
    ]);
    const [district, setDistrict] = useState({
        district_id: 0,
        district_name: '',
    });
    const [province, setProvince] = useState({
        province_id: 0,
        province_name: '',
    });

    const [wards, setWards] = useState([{ ward_id: 0, ward_name: '' }]);
    const [ward, setWard] = useState({ ward_id: 0, ward_name: '' });
    const inputPatientNameRef = useRef<InputRef>(null);
    const inputPatientPhoneRef = useRef<InputRef>(null);
    const inputPatientEmailRef = useRef<InputRef>(null);
    const inputPatientBirthDateRef = useRef<InputRef>(null);
    const inputExaminationRef = useRef<InputRef>(null);
    const inputVillageRef = useRef<InputRef>(null);
    const radioGenderRef = useRef<string | undefined>(undefined);
    const handleOk = () => {
        // const isEmptyPatientName = isEmpty(inputPatientNameRef.current?.input);
        // const isEmptyPatientPhone = isEmpty(
        //     inputPatientPhoneRef.current?.input
        // );
        // const isEmptyPatientEmail = isEmpty(
        //     inputPatientEmailRef.current?.input
        // );
        // const isEmptyPatientBirthday = isEmpty(
        //     inputPatientBirthDateRef.current?.input
        // );
        // if (
        //     !isEmptyPatientBirthday &&
        //     !isEmptyPatientName &&
        //     !isEmptyPatientPhone &&
        //     !isEmptyPatientEmail
        // ) {
        const newAppointment = {
            doctor_id: doctor.id,
            appointment_date: date,
            patient_name: inputPatientNameRef.current?.input?.value,
            patient_phone: inputPatientPhoneRef.current?.input?.value,
            patient_email: inputPatientEmailRef.current?.input?.value,
            birthday: inputPatientBirthDateRef.current?.input?.value,
            province: province.province_name,
            district: district.district_name,
            commune: ward.ward_name,
            examination_reason: inputExaminationRef.current?.input?.value,
            time_id: time.id,
            gender: radioGenderRef.current,
        };

        CreateAppointment(newAppointment);
        // }
    };
    const CreateAppointment = async (data: any) => {
        try {
            // const res: any = await axios.post(
            //     baseURL + 'api/appointment/create',
            //     data
            // );
            socket.emit('addApp', data);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    const [paymentMethod, setPaymentMethod] = useState(1);

    const handleOnChangeRadioPaymentMethod = (e: any) => {
        setPaymentMethod(Number(e.target.value));
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleChange = (e: RadioChangeEvent) => {
        radioGenderRef.current = e.target.value;
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

    useEffect(() => {
        if (province.province_id !== 0) {
            getListDistrict(province.province_id);
        }
    }, [province.province_id]);
    useEffect(() => {
        if (districts.length > 0) {
            if (district !== undefined) {
                getWards(district.district_id);
            }
        }
    }, [district.district_id]);

    return (
        <Modal
            onCancel={handleCancel}
            title={
                <h3 className="fs-5 text-capitalize border border-top-0 border-start-0 border-end-0 pb-2">
                    Phiếu đặt lịch khám
                </h3>
            }
            width={800}
            maskClosable={false}
            open={isModalOpen}
            footer={[
                <Button key="submit" type="primary" onClick={handleOk}>
                    Đặt lịch
                </Button>,
                <Button key="back" onClick={handleCancel}>
                    Đóng
                </Button>,
            ]}
        >
            <div className="row">
                <div className="col-3 modal__left border border-top-0 border-start-0 border-bottom-0 ">
                    <h6 className="heading mb-4">Thông tin bác sĩ</h6>
                    <div className="doctor__info text-center">
                        <Image
                            preview={false}
                            src={baseURL + doctor.image}
                            className="rounded-circle"
                            width={115}
                        ></Image>
                        <h6 className="doctor__name mt-3">
                            {doctor.full_name}
                        </h6>
                    </div>
                    <div className="appointment__time mt-3">
                        <p className="time">
                            <strong>Thời gian:</strong> {time.value}
                        </p>
                        <p className="date">
                            <strong>Ngày khám:</strong> {date}
                        </p>
                    </div>
                    <div className="location mt-3">
                        <span>
                            {' '}
                            <strong>Địa điểm:</strong> {doctor.address}
                        </span>
                    </div>
                    <div className="fee mt-3">
                        <span>
                            <strong>Phí khám:</strong>{' '}
                            {doctor.fee.toLocaleString(undefined)} đ
                        </span>
                    </div>
                </div>
                <div className="col-9">
                    <Form>
                        <div className="mb-3">
                            <label
                                htmlFor="patient_name"
                                className="form-label fw-bold fw-bold"
                            >
                                Tên bệnh nhân
                            </label>
                            <Input
                                ref={inputPatientNameRef}
                                className="form-control patient_name "
                                id="patient_name"
                            ></Input>

                            <div className="error_message"></div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Giới tính
                            </label>
                            <Radio.Group
                                className="d-block"
                                onChange={handleChange}
                            >
                                <Radio value={1}>Nam</Radio>
                                <Radio value={2}>Nữ</Radio>
                                <Radio value={3}>Khác</Radio>
                            </Radio.Group>
                            <div className="error_message"></div>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="patient_phone"
                                className="form-label fw-bold"
                            >
                                Số điện thoại
                            </label>
                            <Input
                                ref={inputPatientPhoneRef}
                                className=" form-control patient_phone"
                                id="patient_phone"
                            ></Input>
                            <div className="error_message"></div>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="patient_email"
                                className="form-label fw-bold"
                            >
                                Email
                            </label>
                            <Input
                                ref={inputPatientEmailRef}
                                className="form-control patient_email"
                                id="patient_email"
                            ></Input>
                            <div className="error_message"></div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Ngày/ Tháng/ Năm Sinh
                            </label>
                            <Input
                                ref={inputPatientBirthDateRef}
                                className=" form-control patient_phone"
                                id="patient_phone"
                                type="date"
                            ></Input>
                            <div className="error_message"></div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Tỉnh/ Thành phố
                            </label>
                            <Select
                                className="d-block"
                                showSearch
                                onChange={(e) => {
                                    const province: any = provinces.find(
                                        (province: any) => {
                                            return province.province_id === e;
                                        }
                                    );
                                    setProvince(province);
                                }}
                                placeholder="Chọn tỉnh/ thành phố"
                                filterOption={(input, option) =>
                                    (option?.province_name)
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                            >
                                {provinces.map((item) => {
                                    return (
                                        <Select.Option
                                            key={item.province_id}
                                            value={item.province_id}
                                        >
                                            {item.province_name}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                            <div className="error_message"></div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Quận/ Huyện
                            </label>
                            <Select
                                className="d-block"
                                showSearch
                                onChange={(e) => {
                                    const district: any = districts.find(
                                        (item: any) => {
                                            return item.district_id === e;
                                        }
                                    );
                                    setDistrict(district);
                                }}
                                placeholder="Chọn quận/ huyện/ thị xã"
                                filterOption={(input, option) =>
                                    (option?.district_name)
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                            >
                                {districts.map((item) => {
                                    return (
                                        <Select.Option
                                            key={item.district_id}
                                            value={item.district_id}
                                        >
                                            {item.district_name}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                            <div className="error_message"></div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Xã/ Phường
                            </label>
                            <Select
                                className="d-block"
                                showSearch
                                onChange={(e) => {
                                    const ward: any = wards.find((w: any) => {
                                        return w.ward_id === e;
                                    });
                                    setWard(ward);
                                }}
                                placeholder="Chọn xã/ phường"
                                filterOption={(input, option) =>
                                    (option?.ward_name)
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                            >
                                {wards.map((item) => {
                                    return (
                                        <Select.Option
                                            key={item.ward_id}
                                            value={item.ward_id}
                                        >
                                            {item.ward_name}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                            <div className="error_message"></div>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="patient_village"
                                className="form-label fw-bold"
                            >
                                Tổ/ Khu/ Thôn/ Xóm
                            </label>
                            <Input
                                ref={inputVillageRef}
                                className="form-control patient_village"
                                id="patient_village"
                            ></Input>
                            <div className="error_message"></div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Lý do khám
                            </label>
                            <TextArea
                                ref={inputExaminationRef}
                                className="form-control"
                            ></TextArea>
                            <div className="error_message"></div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Hình thức thanh toán
                            </label>
                            <Radio.Group
                                className="d-block"
                                onChange={handleOnChangeRadioPaymentMethod}
                                value={paymentMethod}
                            >
                                <Radio value={1}>
                                    Thanh toán sau tại cơ sở y tế
                                </Radio>
                            </Radio.Group>
                            <div className="error_message"></div>
                        </div>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};