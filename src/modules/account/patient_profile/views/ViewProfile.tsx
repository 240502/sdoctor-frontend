import {
    Button,
    Card,
    DatePicker,
    DatePickerProps,
    Input,
    InputRef,
    Radio,
    Select,
    notification,
} from 'antd';
import {
    handleFocusInput,
    handleFocusSelect,
    isEmpty,
    isEmptyRadio,
    isEmptySelect,
    showSuccess,
    validateBirthday,
    validateEmail,
    validateName,
    validatePhone,
    validatePhoneLength,
} from '../../../../utils/global';
import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { patientProfileState } from '../../../../stores/patientAtom';
import { PatientProfileService } from '../../../../services/patient_profileService';
import { PatientProfileLayout } from '../components/PatientProfileLayout';
import { ModalViewAppointment } from '../components/ModalViewAppointment';
import { ModalConfirmDeletePatientProfile } from '../components/ModalConfirmDeletePatientProfile';
import { PatientProfile } from '../../../../models/patient_profile';
import { ProvinceType, DistrictType, WardType } from '../../../../models/other';
type NotificationType = 'success' | 'error';
const ViewProfile = () => {
    const [patientProfile, setPatientProfile] =
        useRecoilState(patientProfileState);
    const [profileCopy, setProfileCopy] = useState<PatientProfile>(
        {} as PatientProfile
    );
    const dateFormat = 'YYYY-MM-DD';
    const inputPatientNameRef = useRef<InputRef>(null);
    const inputPatientPhoneRef = useRef<InputRef>(null);
    const inputPatientEmailRef = useRef<InputRef>(null);
    const radioGenderRef = useRef<any>(undefined);
    const selectProvinceRef = useRef<any>(null);
    const selectDistrictRef = useRef<any>(null);
    const selectWardRef = useRef<any>(null);

    const [isView, setIsView] = useState<boolean>(true);
    const [isOpenModalAddProfile, setIsOpenModalAddProfile] =
        useState<boolean>(false);
    const [isOpenModalConfirm, setIsOpenModalConfirm] =
        useState<boolean>(false);

    const [provinces, setProvinces] = useState<ProvinceType[]>([]);
    const [districts, setDistricts] = useState<DistrictType[]>([]);
    const [wards, setWards] = useState<WardType[]>([]);
    const [province, setProvince] = useState<ProvinceType>({} as ProvinceType);
    const [district, setDistrict] = useState<DistrictType>({} as DistrictType);
    const [ward, setWard] = useState<WardType>({} as WardType);

    const [api, contextHolder] = notification.useNotification();
    const [error, setError] = useState<any>();
    const [searchValue, setSearchValue] = useState<string>('');
    const openNotificationWithIcon = (
        type: NotificationType,
        title: string,
        des: string
    ) => {
        api[type]({
            message: title,
            description: des,
        });
    };
    const onBirthDayChange: DatePickerProps['onChange'] = (
        date,
        dateString
    ) => {
        setPatientProfile({ ...patientProfile, birthday: String(dateString) });
    };
    const handleUpdate = () => {
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
                const newProfile = {
                    patient_name: inputPatientNameRef.current?.input?.value,
                    patient_phone: inputPatientPhoneRef.current?.input?.value,
                    patient_email: inputPatientEmailRef.current?.input?.value,
                    birthday: patientProfile.birthday.toString().slice(0, 10),
                    province: province.province_name,
                    district: district.district_name,
                    commune: ward.ward_name,
                    gender: patientProfile.gender,
                    uuid: patientProfile.uuid,
                    id: patientProfile.id,
                };
                UpdateProfile(newProfile);
            }
        }
    };
    const UpdateProfile = async (newProfile: any) => {
        try {
            const res = await PatientProfileService.updatePatientProfile(
                newProfile
            );
            openNotificationWithIcon(
                'success',
                'Thông báo!',
                'Cập nhật thông tin thành công!'
            );
            setPatientProfile(newProfile);
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'error',
                'Thông báo!',
                'Cập nhật thông tin không thành công!'
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
    const handleCancelModal = () => {
        setIsOpenModalAddProfile(false);
    };
    const handleCancelModalConfirm = () => {
        setIsOpenModalConfirm(false);
    };
    const handleDeleteProfile = async (uuid: string) => {
        try {
            const res = await PatientProfileService.deletePatientProfile(uuid);
            openNotificationWithIcon(
                'success',
                'Thông báo!',
                'Xóa thành công!'
            );
            localStorage.removeItem('uuid');
            setPatientProfile({} as PatientProfile);
            handleCancelModalConfirm();
            setProvinces([]);
            setDistricts([]);
            setWards([]);
            setProvince({} as ProvinceType);
            setDistrict({} as DistrictType);
            setWard({} as WardType);
            window.scrollTo(0, 0);
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'error',
                'Thông báo!',
                'Xóa không thành công!'
            );
        }
    };
    const handleGetProfileByPhoneOrEmail = () => {
        if (searchValue === '') {
            setError({
                ...error,
                searchContentError: 'Vui lòng nhập thông tin tìm kiếm',
            });
        } else {
            const data = { searchContent: searchValue };
            getProfileByPhoneOrEmail(data);
        }
    };
    const getProfileByPhoneOrEmail = async (data: any) => {
        try {
            const res = await PatientProfileService.getProfileByPhoneOrEmail(
                data
            );
            console.log(res);
            localStorage.setItem('uuid', res.uuid);
            setPatientProfile(res);
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'error',
                'Thông báo!',
                'Không tìm thấy hồ sơ nào!'
            );
        }
    };
    useEffect(() => {
        if (patientProfile.uuid) {
            setProfileCopy(patientProfile);
        }
    }, []);
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
        if (patientProfile.uuid) {
            console.log('get provinces');
            getProvinces();
        }
        window.scrollTo(0, 0);
    }, [patientProfile.uuid]);

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
    }, [provinces.length, patientProfile.uuid]);
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
            console.log('get district');

            getDistrict();
        }
    }, [districts.length]);
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
            console.log('get ward');

            getWards();
        }
    }, [wards.length]);

    return (
        <>
            {contextHolder}
            <PatientProfileLayout breadcrumb="Hồ sơ">
                {patientProfile?.uuid !== undefined ? (
                    <Card title="Hồ sơ bệnh nhân" bordered={false}>
                        <div className="info__item mb-3">
                            <label htmlFor="">Họ và tên</label>
                            <Input
                                onFocus={(e) => handleFocusInput(e.target)}
                                ref={inputPatientNameRef}
                                className="mt-2"
                                value={patientProfile.patient_name}
                                onChange={(e: any) =>
                                    setPatientProfile({
                                        ...patientProfile,
                                        patient_name: e.target.value,
                                    })
                                }
                            />
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            ></div>
                        </div>
                        <div className="info__item mb-3">
                            <label htmlFor="">Số điện thoại</label>
                            <Input
                                onFocus={(e) => handleFocusInput(e.target)}
                                ref={inputPatientPhoneRef}
                                className="mt-2"
                                value={patientProfile.patient_phone}
                                onChange={(e) =>
                                    setPatientProfile({
                                        ...patientProfile,
                                        patient_phone: e.target.value,
                                    })
                                }
                            />
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            ></div>
                        </div>
                        <div className="info__item mb-3">
                            <label htmlFor="">Email</label>
                            <Input
                                onFocus={(e) => handleFocusInput(e.target)}
                                ref={inputPatientEmailRef}
                                className="mt-2"
                                value={patientProfile.patient_email}
                                onChange={(e) =>
                                    setPatientProfile({
                                        ...patientProfile,
                                        patient_email: e.target.value,
                                    })
                                }
                            />
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            ></div>
                        </div>
                        <div className="info__item mb-3">
                            <label htmlFor="">Giới tính</label>
                            <Radio.Group
                                onFocus={() => {
                                    setError({ ...error, genderError: '' });
                                }}
                                className="ms-3 "
                                value={Number(patientProfile.gender)}
                                ref={radioGenderRef}
                                onChange={(e) =>
                                    setPatientProfile({
                                        ...patientProfile,
                                        gender: e.target.value,
                                    })
                                }
                            >
                                <Radio value={1}>Nam</Radio>
                                <Radio value={2}>Nữ</Radio>
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
                        <div className="info__item mb-3">
                            <label htmlFor="">Ngày sinh</label>
                            <DatePicker
                                onFocus={() => {
                                    setError({
                                        ...error,
                                        birthdayError: '',
                                    });
                                }}
                                onChange={onBirthDayChange}
                                className="d-block mt-2"
                                type="date"
                                defaultValue={dayjs(
                                    patientProfile.birthday
                                        .toString()
                                        .slice(0, 10),
                                    dateFormat
                                )}
                                format={dateFormat}
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
                            <label htmlFor="" className="form-label fw-bold">
                                Tỉnh/ Thành phố
                            </label>
                            <Select
                                onFocus={(e) =>
                                    handleFocusSelect(selectProvinceRef.current)
                                }
                                ref={selectProvinceRef}
                                className="d-block"
                                showSearch
                                onChange={(e) => {
                                    const province: any = provinces.find(
                                        (province: any) => {
                                            return province.province_id === e;
                                        }
                                    );
                                    setProvince(province);
                                    setPatientProfile({
                                        ...patientProfile,
                                        province: province.province_name,
                                    });
                                    setDistrict({} as DistrictType);
                                    setWard({} as WardType);
                                }}
                                value={province.province_id}
                                placeholder="Chọn tỉnh/ thành phố"
                                optionFilterProp="children"
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
                                onFocus={(e) =>
                                    handleFocusSelect(selectDistrictRef.current)
                                }
                                className="d-block"
                                showSearch
                                ref={selectDistrictRef}
                                onChange={(e) => {
                                    const district: any = districts.find(
                                        (item: any) => {
                                            return item.district_id === e;
                                        }
                                    );
                                    setPatientProfile({
                                        ...patientProfile,
                                        district: district.district_name,
                                    });
                                    setDistrict(district);

                                    setWard({} as WardType);
                                }}
                                value={district.district_id}
                                placeholder="Chọn quận/ huyện/ thị xã"
                                optionFilterProp="children"
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
                                onFocus={(e) =>
                                    handleFocusSelect(selectWardRef.current)
                                }
                                className="d-block"
                                showSearch
                                ref={selectWardRef}
                                onChange={(e) => {
                                    const ward: any = wards.find((w: any) => {
                                        return w.ward_id === e;
                                    });
                                    setPatientProfile({
                                        ...patientProfile,
                                        commune: ward.ward_name,
                                    });
                                    setWard(ward);
                                }}
                                placeholder="Chọn xã/ phường"
                                value={ward.ward_id}
                                optionFilterProp="children"
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
                        <div className="group__button d-flex justify-content-between">
                            <Button
                                className="bg-primary text-white "
                                onClick={() => {
                                    handleUpdate();
                                }}
                            >
                                Lưu thông tin
                            </Button>
                            <Button
                                className=" bg-danger text-white"
                                onClick={() => {
                                    setIsOpenModalConfirm(true);
                                }}
                            >
                                Xóa hồ sơ
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="container mt-5">
                        <Card
                            className="mx-auto shadow-lg"
                            style={{ maxWidth: '500px' }}
                        >
                            <div className="mb-4">
                                <label className="form-label">
                                    Nhập số điện thoại hoặc email
                                </label>
                                <Input
                                    onFocus={() => {
                                        setError({});
                                    }}
                                    placeholder="Số điện thoại hoặc email"
                                    value={searchValue}
                                    onChange={(e) => {
                                        setSearchValue(String(e.target.value));
                                    }}
                                />
                                {error?.searchContentError && (
                                    <div
                                        className="error_message mt-3"
                                        style={{ color: 'red' }}
                                    >
                                        {error?.searchContentError}
                                    </div>
                                )}
                                <Button
                                    type="primary"
                                    block
                                    className="mt-3"
                                    onClick={handleGetProfileByPhoneOrEmail}
                                >
                                    Tìm kiếm
                                </Button>
                            </div>

                            <Button
                                type="default"
                                block
                                className="mt-4"
                                onClick={() => {
                                    setIsView(false);
                                    setIsOpenModalAddProfile(true);
                                }}
                            >
                                Thêm mới hồ sơ
                            </Button>
                        </Card>
                    </div>
                )}
                {isOpenModalAddProfile && (
                    <ModalViewAppointment
                        handleCancelModal={handleCancelModal}
                        isModalOpen={isOpenModalAddProfile}
                        appointment={null}
                        isView={isView}
                        openNotificationWithIcon={openNotificationWithIcon}
                    />
                )}
                {isOpenModalConfirm && (
                    <ModalConfirmDeletePatientProfile
                        handleCancelModalConfirm={handleCancelModalConfirm}
                        isOpenModalConfirm={isOpenModalConfirm}
                        handleDeleteProfile={handleDeleteProfile}
                    />
                )}
            </PatientProfileLayout>
        </>
    );
};
export default ViewProfile;
