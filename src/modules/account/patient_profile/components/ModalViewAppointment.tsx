import {
    Button,
    DatePicker,
    Flex,
    Form,
    Input,
    InputRef,
    Modal,
    Radio,
    Select,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { doctorService } from '../../../../services/doctorService';
import { Doctor } from '../../../../models/doctor';
import { Image } from 'antd';
const { Option } = Select;
import dayjs from 'dayjs';
import {
    handleFocusInput,
    handleFocusSelect,
    isEmpty,
    isEmptySelect,
    validateBirthday,
    validateEmail,
    validateName,
    validatePhone,
    validatePhoneLength,
} from '../../../../utils/global';
import { v4 as uuidv4 } from 'uuid';
import { PatientProfileService } from '../../../../services/patient_profileService';
import { useRecoilState } from 'recoil';
import { patientProfileState } from '../../../../stores/patientAtom';
import axios from 'axios';
import { ProvinceType, DistrictType, WardType } from '../../../../models/other';
import { Appointment } from '../../../../models/appointment';

export const ModalViewAppointment = ({
    handleCancelModal,
    isModalOpen,
    appointment,
    isView,
    openNotificationWithIcon,
}: any) => {
    const [patientProfile, setPatientProfile] =
        useRecoilState(patientProfileState);

    const dateFormat = 'YYYY-MM-DD';
    const [doctor, setDoctor] = useState<Doctor>({} as Doctor);
    const getDoctorById = async (id: number) => {
        try {
            const res = await doctorService.getDoctorById(id);
            setDoctor(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const [error, setError] = useState<any>();

    const inputPatientNameRef = useRef<InputRef>(null);
    const inputPatientPhoneRef = useRef<InputRef>(null);
    const inputPatientEmailRef = useRef<InputRef>(null);
    const radioGenderRef = useRef<any>(undefined);
    const selectProvinceRef = useRef<any>(null);
    const selectDistrictRef = useRef<any>(null);
    const selectWardRef = useRef<any>(null);

    const [provinces, setProvinces] = useState<ProvinceType[]>([]);

    const [districts, setDistricts] = useState<DistrictType[]>([]);

    const [wards, setWards] = useState<WardType[]>([]);

    const [province, setProvince] = useState<ProvinceType>({} as ProvinceType);

    const [district, setDistrict] = useState<DistrictType>({} as DistrictType);

    const [ward, setWard] = useState<WardType>({} as WardType);

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

    const handleOk = () => {
        let errorMsg: any = {};
        const isEmptyPatientName = isEmpty(inputPatientNameRef.current?.input);
        const isEmptyPatientPhone = isEmpty(
            inputPatientPhoneRef.current?.input
        );
        const isEmptyPatientEmail = isEmpty(
            inputPatientEmailRef.current?.input
        );

        const isEmptyRadioGender =
            patientProfile.gender === undefined ? true : false;
        if (isEmptyRadioGender) {
            errorMsg = {
                ...errorMsg,
                genderError: 'Không được để trống ô này!',
            };
        }

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
        const isEmptyBirthday =
            patientProfile?.birthday !== undefined ? false : true;
        if (isEmptyBirthday) {
            errorMsg = {
                ...error,
                birthdayError: 'Không được để trống ô này!',
            };
        }
        setError(errorMsg);
        if (
            !isEmptyBirthday &&
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
            const isErrorBirthday = validateBirthday(
                new Date(patientProfile.birthday),
                setError
            );
            if (
                !isErrorPatientName &&
                !isErrorPatientEmail &&
                !isErrorPatientPhone &&
                !isErrorPhoneLength &&
                !isErrorBirthday
            ) {
                const uuid = uuidv4();
                const newProfile = {
                    patient_name: inputPatientNameRef.current?.input?.value,
                    patient_phone: inputPatientPhoneRef.current?.input?.value,
                    patient_email: inputPatientEmailRef.current?.input?.value,
                    birthday: patientProfile.birthday,
                    province: province.province_name,
                    district: district.district_name,
                    commune: ward.ward_name,
                    gender: patientProfile.gender,
                    uuid: uuid,
                };
                CreatePatientProfile(newProfile);
            }
        }
    };
    const CreatePatientProfile = async (data: any) => {
        try {
            const res = await PatientProfileService.createPatientProfile(data);
            localStorage.setItem('uuid', JSON.stringify(data.uuid));
            openNotificationWithIcon(
                'success',
                'Thông báo',
                'Thêm hồ sơ thành công'
            );
            setPatientProfile(data);
            handleCancelModal();
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'error',
                'Thông báo',
                'Thêm hồ sơ không thành công'
            );
        }
    };
    useEffect(() => {
        if (appointment !== null) {
            getDoctorById(appointment.doctor_id);
        }
    }, [appointment]);
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
        console.log('isView', isView);
    }, [isView]);

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

    return (
        <>
            <Modal
                title={
                    <h3 className="fs-5 text-capitalize border border-top-0 border-start-0 border-end-0 pb-2">
                        Phiếu đặt lịch khám
                    </h3>
                }
                onCancel={handleCancelModal}
                open={isModalOpen}
                width={800}
                maskClosable={false}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            handleCancelModal();
                        }}
                    >
                        Đóng
                    </Button>,
                ]}
            >
                <Flex gap={'middle'} className="justify-content-center">
                    {isView && (
                        <div className="col-3 modal__left border border-top-0 border-start-0 border-bottom-0 ">
                            <h6 className="heading mb-4">Thông tin bác sĩ</h6>
                            <div className="doctor__info text-center">
                                <Image
                                    preview={false}
                                    src={doctor.image}
                                    className="rounded-circle"
                                    width={115}
                                ></Image>
                                <h6 className="doctor__name mt-3">
                                    {doctor.full_name}
                                </h6>
                            </div>
                            <div className="appointment__time mt-3">
                                <p className="time">
                                    <strong>Thời gian:</strong>{' '}
                                    {appointment?.time_value}
                                </p>
                                <p className="date">
                                    <strong>Ngày khám:</strong>{' '}
                                    {appointment?.appointment_date
                                        .toString()
                                        .slice(0, 10)}
                                </p>
                            </div>
                            <div className="location mt-3">
                                <span>
                                    {' '}
                                    <strong>Địa điểm:</strong> {doctor.location}
                                </span>
                            </div>
                            <div className="fee mt-3">
                                <span>
                                    <strong>Phí khám:</strong>{' '}
                                    {appointment?.price.toLocaleString(
                                        undefined
                                    )}{' '}
                                    đ
                                </span>
                            </div>
                        </div>
                    )}
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
                                    onFocus={(e) => handleFocusInput(e.target)}
                                    className="form-control patient_name "
                                    id="patient_name"
                                    value={appointment?.patient_name}
                                ></Input>

                                <div
                                    className="error_message mt-3"
                                    style={{ color: 'red' }}
                                ></div>
                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor=""
                                    className="form-label fw-bold"
                                >
                                    Giới tính
                                </label>
                                <Radio.Group
                                    onFocus={() => {
                                        setError({ ...error, genderError: '' });
                                    }}
                                    onChange={(e) => {
                                        setPatientProfile({
                                            ...patientProfile,
                                            gender: Number(e.target.value),
                                        });
                                    }}
                                    ref={radioGenderRef}
                                    value={
                                        appointment !== null
                                            ? Number(appointment.gender)
                                            : patientProfile.gender
                                    }
                                    className="d-block"
                                >
                                    <Radio value={1}>Nam</Radio>
                                    <Radio value={2}>Nữ</Radio>
                                    <Radio value={3}>Khác</Radio>
                                </Radio.Group>
                                {error?.genderError !== '' && (
                                    <div
                                        className="error_message mt-3"
                                        style={{ color: 'red' }}
                                    >
                                        {error?.genderError}
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor="patient_phone"
                                    className="form-label fw-bold"
                                >
                                    Số điện thoại
                                </label>
                                <Input
                                    onFocus={(e) => handleFocusInput(e.target)}
                                    ref={inputPatientPhoneRef}
                                    value={appointment?.patient_phone}
                                    className=" form-control patient_phone"
                                    id="patient_phone"
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
                                    onFocus={(e) => handleFocusInput(e.target)}
                                    ref={inputPatientEmailRef}
                                    value={appointment?.patient_email}
                                    className="form-control patient_email"
                                    id="patient_email"
                                ></Input>
                                <div
                                    className="error_message mt-3"
                                    style={{ color: 'red' }}
                                ></div>
                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor=""
                                    className="form-label fw-bold"
                                >
                                    Ngày/ Tháng/ Năm Sinh
                                </label>
                                <DatePicker
                                    onFocus={() => {
                                        setError({
                                            ...error,
                                            birthdayError: '',
                                        });
                                    }}
                                    onChange={(date, dateString) => {
                                        setPatientProfile({
                                            ...patientProfile,
                                            birthday: String(dateString),
                                        });
                                    }}
                                    defaultValue={
                                        appointment?.birthday
                                            ? dayjs(
                                                  appointment.birthday,
                                                  dateFormat
                                              )
                                            : undefined
                                    }
                                    className="d-block"
                                />
                                {error?.birthdayError !== '' && (
                                    <div
                                        className="error_message mt-3"
                                        style={{ color: 'red' }}
                                    >
                                        {error?.birthdayError}
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor=""
                                    className="form-label fw-bold"
                                >
                                    Tỉnh/ Thành phố
                                </label>

                                {appointment !== null ? (
                                    <Input
                                        value={appointment?.province}
                                    ></Input>
                                ) : (
                                    <>
                                        <Select
                                            ref={selectProvinceRef}
                                            className="d-block"
                                            showSearch
                                            value={province.province_id}
                                            onFocus={(e) =>
                                                handleFocusSelect(
                                                    selectProvinceRef.current
                                                )
                                            }
                                            onChange={(e) => {
                                                const pro: any = provinces.find(
                                                    (province: any) => {
                                                        return (
                                                            province.province_id ===
                                                            e
                                                        );
                                                    }
                                                );
                                                setProvince(pro);
                                                setDistrict({} as DistrictType);
                                                setWard({} as WardType);
                                            }}
                                            optionFilterProp="children"
                                            placeholder="Chọn tỉnh/ thành phố"
                                        >
                                            {provinces.map((item) => {
                                                return (
                                                    <Option
                                                        key={item.province_id}
                                                        value={item.province_id}
                                                        label={
                                                            item.province_name
                                                        }
                                                    >
                                                        {item.province_name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                        <div
                                            className="error_message mt-3"
                                            style={{ color: 'red' }}
                                        ></div>
                                    </>
                                )}
                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor=""
                                    className="form-label fw-bold"
                                >
                                    Quận/ Huyện
                                </label>
                                {appointment != null ? (
                                    <Input
                                        value={appointment?.district}
                                    ></Input>
                                ) : (
                                    <>
                                        <Select
                                            ref={selectDistrictRef}
                                            value={district.district_id}
                                            className="d-block"
                                            onFocus={(e) =>
                                                handleFocusSelect(
                                                    selectDistrictRef.current
                                                )
                                            }
                                            showSearch
                                            onChange={(e) => {
                                                const dis: any = districts.find(
                                                    (item: any) => {
                                                        return (
                                                            item.district_id ===
                                                            e
                                                        );
                                                    }
                                                );

                                                setDistrict(dis);
                                                setWard({} as WardType);
                                            }}
                                            optionFilterProp="children"
                                            placeholder="Chọn quận/ huyện/ thị xã"
                                        >
                                            {districts.map((item) => {
                                                return (
                                                    <Option
                                                        key={item.district_id}
                                                        value={item.district_id}
                                                        label={
                                                            item.district_name
                                                        }
                                                    >
                                                        {item.district_name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                        <div
                                            className="error_message mt-3"
                                            style={{ color: 'red' }}
                                        ></div>
                                    </>
                                )}
                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor=""
                                    className="form-label fw-bold"
                                >
                                    Xã/ Phường
                                </label>
                                {appointment != null ? (
                                    <Input value={appointment?.commune}></Input>
                                ) : (
                                    <>
                                        <Select
                                            ref={selectWardRef}
                                            value={ward.ward_id}
                                            onFocus={(e) =>
                                                handleFocusSelect(
                                                    selectWardRef.current
                                                )
                                            }
                                            className="d-block"
                                            showSearch
                                            onChange={(e) => {
                                                const ward: any = wards.find(
                                                    (w: any) => {
                                                        return w.ward_id === e;
                                                    }
                                                );

                                                setWard(ward);
                                            }}
                                            optionFilterProp="children"
                                            placeholder="Chọn xã/ phường"
                                        >
                                            {wards.map((item) => {
                                                return (
                                                    <Option
                                                        key={item.ward_id}
                                                        value={item.ward_id}
                                                        label={item.ward_name}
                                                    >
                                                        {item.ward_name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                        <div
                                            className="error_message mt-3"
                                            style={{ color: 'red' }}
                                        ></div>
                                    </>
                                )}
                            </div>
                        </Form>
                    </div>
                </Flex>
            </Modal>
        </>
    );
};
