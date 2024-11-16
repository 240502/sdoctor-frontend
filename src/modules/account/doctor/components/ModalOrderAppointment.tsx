import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

import {
    Button,
    Modal,
    Form,
    Image,
    Input,
    Radio,
    Select,
    InputRef,
    DatePicker,
    RadioChangeEvent,
    Switch,
} from 'antd';
import type { DatePickerProps } from 'antd';

import { baseURL } from '../../../../constants/api';
import axios from 'axios';
import {
    handleFocusInput,
    handleFocusSelect,
    isEmpty,
    isEmptyRadio,
    isEmptySelect,
    showSuccess,
    validateEmail,
    validateName,
    validatePhone,
    validatePhoneLength,
} from '../../../../utils/global';
import socket from '../../../../socket';
import { PatientProfileService } from '../../../../services/patient_profileService';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
    patientProfileState,
    patientProfileValue,
} from '../../../../stores/patientAtom';
import { Appointment } from '../../../../models/appointment';
import { appointmentListState } from '../../../../stores/appointmentAtom';
import { NewsManagement } from '../../../auth/news';

const { TextArea } = Input;
export const ModalOrderAppointment = ({
    isModalOpen,
    doctor,
    setIsModalOpen,
    time,
    date,
    openNotificationWithIcon,
}: any): JSX.Element => {
    const dateFormat = 'YYYY-MM-DD';
    const setPatientProfile = useSetRecoilState(patientProfileState);
    const patientProfile = useRecoilValue(patientProfileValue);
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

    const [isSaveProfile, setIsSaveProfile] = useState<boolean>(false);

    const [newAppointment, setNewAppointment] = useState<Appointment>(
        {} as Appointment
    );
    const [wards, setWards] = useState([{ ward_id: 0, ward_name: '' }]);
    const [ward, setWard] = useState({ ward_id: 0, ward_name: '' });
    const inputPatientNameRef = useRef<InputRef>(null);
    const inputPatientPhoneRef = useRef<InputRef>(null);
    const inputPatientEmailRef = useRef<InputRef>(null);
    const inputVillageRef = useRef<InputRef>(null);
    const radioGenderRef = useRef<any>(undefined);
    const radioGenderValue = useRef<string | undefined>(undefined);
    const selectProvinceRef = useRef<any>(null);
    const selectDistrictRef = useRef<any>(null);
    const selectWardRef = useRef<any>(null);
    const [birthday, setBirthday] = useState<string>();
    const [examinationReason, setExaminationReason] = useState<string>();
    const [paymentMethod, setPaymentMethod] = useState(1);
    const [birthdayError, setBirthDayError] = useState<any>();

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        setBirthday(String(dateString));
        setNewAppointment({ ...newAppointment, birthday: String(dateString) });
    };

    const onSwitchChange = (checked: boolean) => {
        setIsSaveProfile(checked);
    };

    const validateBirthday = (date: any) => {
        const now = new Date();
        let error: boolean = false;
        if (date.getFullYear() === now.getFullYear()) {
            if (date.getMonth() === now.getMonth()) {
                if (date.getDate() === now.getDate()) {
                    error = true;
                } else {
                    error = false;
                }
            }
            if (date.getMonth() > now.getMonth()) {
                error = true;
            }
            if (date.getMonth() < now.getMonth()) {
                error = false;
            }
        }
        if (date.getFullYear() > now.getFullYear()) {
            error = true;
        }
        if (date.getFullYear() < now.getFullYear()) {
            error = false;
        }
        if (error) {
            setBirthDayError({ message: 'Ngày/ Tháng/ Năm sinh không hợp lệ' });
        }
        return error;
    };
    const handleEmptyPatientBirthday = () => {
        if (newAppointment?.birthday) {
            return false;
        }
        return true;
    };

    const handleOk = () => {
        const isEmptyPatientName = isEmpty(inputPatientNameRef.current?.input);
        const isEmptyPatientPhone = isEmpty(
            inputPatientPhoneRef.current?.input
        );
        const isEmptyPatientEmail = isEmpty(
            inputPatientEmailRef.current?.input
        );

        const isEmptyRadioGender =
            patientProfile !== null
                ? false
                : isEmptyRadio(
                      radioGenderRef.current,
                      radioGenderValue.current
                  );
        const provinceId = province.province_id;
        const districtId = district.district_id;
        const wardId = ward.ward_id;
        const isEmptySelectProvince = isEmptySelect(
            selectProvinceRef.current,
            provinceId
        );
        const isEmptySelectDistrict = isEmptySelect(
            selectDistrictRef.current,
            districtId
        );
        const isEmptySelectWard = isEmptySelect(selectWardRef.current, wardId);

        if (
            newAppointment.birthday !== null &&
            !isEmptyPatientName &&
            !isEmptyPatientPhone &&
            !isEmptyPatientEmail &&
            !isEmptyRadioGender &&
            !isEmptySelectProvince &&
            !isEmptySelectDistrict &&
            !isEmptySelectWard
        ) {
            const isErrorPatientName = validateName(
                inputPatientNameRef.current?.input
            );
            const isErrorPatientEmail = validateEmail(
                inputPatientEmailRef.current?.input
            );
            const isErrorPatientPhone = validatePhone(
                inputPatientPhoneRef.current?.input
            );

            const isErrorPhoneLength = validatePhoneLength(
                inputPatientPhoneRef.current?.input
            );
            const isErrorBirthday =
                patientProfile === null
                    ? false
                    : validateBirthday(new Date(newAppointment.birthday));

            if (
                !isErrorPatientName &&
                !isErrorPatientEmail &&
                !isErrorPatientPhone &&
                !isErrorPhoneLength &&
                !isErrorBirthday
            ) {
                const appointment = {
                    doctor_id: doctor.id,
                    appointment_date: date,
                    patient_name: inputPatientNameRef.current?.input?.value,
                    patient_phone: inputPatientPhoneRef.current?.input?.value,
                    patient_email: inputPatientEmailRef.current?.input?.value,
                    birthday: newAppointment.birthday,
                    province: province.province_name,
                    district: district.district_name,
                    commune: ward.ward_name,
                    examination_reason: examinationReason,
                    time_id: time.id,
                    gender: radioGenderValue.current,
                    doctor_name: doctor.full_name,
                    time_value: time.value,
                    price: doctor.fee,
                    location: doctor.location,
                    type: 'Bác sĩ',
                };
                CreateAppointment(appointment);

                if (isSaveProfile) {
                    const uuid = uuidv4();
                    const newProfile = {
                        patient_name: inputPatientNameRef.current?.input?.value,
                        patient_phone:
                            inputPatientPhoneRef.current?.input?.value,
                        patient_email:
                            inputPatientEmailRef.current?.input?.value,
                        birthday: birthday,
                        province: province.province_name,
                        district: district.district_name,
                        commune: ward.ward_name,
                        gender: radioGenderValue.current,
                        uuid: uuid,
                    };
                    CreatePatientProfile(newProfile);
                }
            }
        }
    };

    const CreatePatientProfile = async (data: any) => {
        try {
            const res = await PatientProfileService.createPatientProfile(data);
            localStorage.setItem('patientProfile', JSON.stringify(data));
            setPatientProfile(data);
        } catch (err: any) {}
    };

    const CreateAppointment = async (data: any) => {
        try {
            const res: any = await axios.post(
                baseURL + 'api/appointment/create',
                data
            );
            openNotificationWithIcon(
                'success',
                'Thông báo',
                'Đặt lịch hẹn thành công!'
            );
            setIsModalOpen(false);

            socket.emit('addApp', data);
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'error',
                'Thông báo',
                'Đặt lịch hẹn không thành công!'
            );
        }
    };

    const handleOnChangeRadioPaymentMethod = (e: any) => {
        setPaymentMethod(Number(e.target.value));
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleChange = (e: RadioChangeEvent) => {
        radioGenderValue.current = e.target.value;
        setNewAppointment({ ...newAppointment, gender: e.target.value });
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
                (item) => item?.province_name === patientProfile.province
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
                (item) => item.district_name === patientProfile.district
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
                (item) => item.ward_name === patientProfile.commune
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
        setNewAppointment({
            ...newAppointment,
            patient_name: patientProfile.patient_name,
            patient_phone: patientProfile.patient_phone,
            patient_email: patientProfile.patient_email,
            birthday: patientProfile.birthday,
            province: patientProfile.province,
            district: patientProfile.district,
            commune: patientProfile.commune,
            gender: patientProfile.gender,
        });
    }, []);

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
                                onFocus={(e: any) => {
                                    handleFocusInput(e.target);
                                }}
                                ref={inputPatientNameRef}
                                className="form-control patient_name "
                                id="patient_name"
                                value={newAppointment.patient_name}
                                onChange={(e) =>
                                    setNewAppointment({
                                        ...newAppointment,
                                        patient_name: e.target.value,
                                    })
                                }
                            ></Input>

                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            ></div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Giới tính
                            </label>
                            <Radio.Group
                                value={newAppointment.gender}
                                onFocus={() => {
                                    showSuccess(radioGenderRef.current);
                                }}
                                className="d-block"
                                ref={radioGenderRef}
                                onChange={handleChange}
                            >
                                <Radio value={1}>Nam</Radio>
                                <Radio value={2}>Nữ</Radio>
                                <Radio value={3}>Khác</Radio>
                            </Radio.Group>
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            ></div>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="patient_phone"
                                className="form-label fw-bold"
                            >
                                Số điện thoại
                            </label>
                            <Input
                                onFocus={(e: any) => {
                                    handleFocusInput(e.target);
                                }}
                                ref={inputPatientPhoneRef}
                                value={newAppointment.patient_phone}
                                className=" form-control patient_phone"
                                id="patient_phone"
                                onChange={(e) =>
                                    setNewAppointment({
                                        ...newAppointment,
                                        patient_phone: e.target.value,
                                    })
                                }
                            ></Input>
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            ></div>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="patient_email"
                                className="form-label fw-bold"
                            >
                                Email
                            </label>
                            <Input
                                onFocus={(e: any) => {
                                    handleFocusInput(e.target);
                                }}
                                ref={inputPatientEmailRef}
                                onChange={(e) =>
                                    setNewAppointment({
                                        ...newAppointment,
                                        patient_email: e.target.value,
                                    })
                                }
                                value={newAppointment.patient_email}
                                className="form-control patient_email"
                                id="patient_email"
                            ></Input>
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            ></div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Ngày/ Tháng/ Năm Sinh
                            </label>
                            <DatePicker
                                onFocus={() => {
                                    setBirthDayError({});
                                }}
                                onChange={onChange}
                                className="d-block mt-2"
                                type="date"
                                defaultValue={dayjs(
                                    patientProfile.birthday,
                                    dateFormat
                                )}
                                format={dateFormat}
                            />
                            {birthdayError?.message && (
                                <div
                                    className="error_message mt-3"
                                    style={{ color: 'red' }}
                                >
                                    {birthdayError.message}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Tỉnh/ Thành phố
                            </label>
                            <Select
                                ref={selectProvinceRef}
                                className="d-block"
                                showSearch
                                value={province.province_id}
                                onFocus={(e) =>
                                    handleFocusSelect(selectProvinceRef.current)
                                }
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
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            ></div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Quận/ Huyện
                            </label>
                            <Select
                                ref={selectDistrictRef}
                                value={district.district_id}
                                className="d-block"
                                onFocus={(e) =>
                                    handleFocusSelect(selectDistrictRef.current)
                                }
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
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            ></div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Xã/ Phường
                            </label>
                            <Select
                                ref={selectWardRef}
                                value={ward.ward_id}
                                onFocus={(e) =>
                                    handleFocusSelect(selectWardRef.current)
                                }
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
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            ></div>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="patient_village"
                                className="form-label fw-bold"
                            >
                                Tổ/ Khu/ Thôn/ Xóm
                            </label>
                            <Input
                                onFocus={(e: any) => {
                                    handleFocusInput(e.target);
                                }}
                                ref={inputVillageRef}
                                className="form-control patient_village"
                                id="patient_village"
                            ></Input>
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            ></div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Lý do khám
                            </label>
                            <TextArea
                                className="form-control"
                                onChange={(e) => {
                                    setExaminationReason(e.target.value);
                                }}
                            ></TextArea>
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            ></div>
                        </div>
                        {patientProfile === null ? (
                            <div className="mb-3">
                                <Switch
                                    className=""
                                    onChange={onSwitchChange}
                                ></Switch>
                                <label htmlFor="" className="ms-3">
                                    Lưu thông tin hồ sơ
                                </label>
                            </div>
                        ) : (
                            <></>
                        )}
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
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            ></div>
                        </div>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};
