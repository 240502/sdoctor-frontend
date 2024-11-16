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
type NotificationType = 'success' | 'error';
export const ViewProfile = () => {
    const [patientProfile, setPatientProfile] =
        useRecoilState(patientProfileState);
    const dateFormat = 'YYYY-MM-DD';
    const inputPatientNameRef = useRef<InputRef>(null);
    const inputPatientPhoneRef = useRef<InputRef>(null);
    const inputPatientEmailRef = useRef<InputRef>(null);
    const radioGenderRef = useRef<any>(undefined);
    const radioGenderValue = useRef<string | undefined>(undefined);
    const selectProvinceRef = useRef<any>(null);
    const selectDistrictRef = useRef<any>(null);
    const selectWardRef = useRef<any>(null);
    const [birthday, setBirthday] = useState<string>();
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
    const [api, contextHolder] = notification.useNotification();
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
        const isEmptyPatientName = isEmpty(inputPatientNameRef.current?.input);
        const isEmptyPatientPhone = isEmpty(
            inputPatientPhoneRef.current?.input
        );
        const isEmptyPatientEmail = isEmpty(
            inputPatientEmailRef.current?.input
        );
        // const isEmptyPatientBirthday = isEmpty(
        //     inputPatientBirthDateRef.current?.input
        // );
        // const isEmptyRadioGender = isEmptyRadio(
        //     radioGenderRef.current,
        //     radioGenderValue.current
        // );
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
            // !isEmptyPatientBirthday &&
            !isEmptyPatientName &&
            !isEmptyPatientPhone &&
            !isEmptyPatientEmail &&
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
            // const isErrorPatientBirthday = validatePatientBirthDay(
            //     inputPatientBirthDateRef.current?.input
            // );
            const isErrorPhoneLength = validatePhoneLength(
                inputPatientPhoneRef.current?.input
            );

            if (
                !isErrorPatientName &&
                !isErrorPatientEmail &&
                !isErrorPatientPhone &&
                // !isErrorPatientBirthday &&
                !isErrorPhoneLength
            ) {
                const newProfile = {
                    patient_name: inputPatientNameRef.current?.input?.value,
                    patient_phone: inputPatientPhoneRef.current?.input?.value,
                    patient_email: inputPatientEmailRef.current?.input?.value,
                    birthday: patientProfile.birthday,
                    province: province.province_name,
                    district: district.district_name,
                    commune: ward.ward_name,
                    gender: patientProfile.gender,
                    uuid: patientProfile.uuid,
                };
                UpdateProfile(newProfile);
                console.log('newProfile', newProfile);
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
            localStorage.setItem('patientProfile', JSON.stringify(newProfile));
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
        console.log(String(dayjs(patientProfile.birthday, dateFormat)));
        setBirthday(String(dayjs(patientProfile.birthday, dateFormat)));
        getProvinces();
    }, []);
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

    return patientProfile !== null ? (
        <Card title="Hồ sơ bệnh nhân" bordered={false}>
            {contextHolder}
            <div className="infor__item mb-3">
                <label htmlFor="">Họ và tên</label>
                <Input
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
            <div className="infor__item mb-3">
                <label htmlFor="">Số điện thoại</label>
                <Input
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
            <div className="infor__item mb-3">
                <label htmlFor="">Email</label>
                <Input
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
            <div className="infor__item mb-3">
                <label htmlFor="">Giới tính</label>
                <Radio.Group
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
                <div
                    className="error_message mt-3"
                    style={{ color: 'red' }}
                ></div>
            </div>
            <div className="infor__item mb-3">
                <label htmlFor="">Ngày sinh</label>
                <DatePicker
                    onChange={onBirthDayChange}
                    className="d-block mt-2"
                    type="date"
                    defaultValue={dayjs(patientProfile.birthday, dateFormat)}
                    format={dateFormat}
                />
                <div
                    className="error_message mt-3"
                    style={{ color: 'red' }}
                ></div>
            </div>
            <div className="mb-3">
                <label htmlFor="" className="form-label fw-bold">
                    Tỉnh/ Thành phố
                </label>
                <Select
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
                    }}
                    value={province.province_id}
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
                    className="d-block"
                    showSearch
                    ref={selectDistrictRef}
                    onChange={(e) => {
                        const district: any = districts.find((item: any) => {
                            return item.district_id === e;
                        });
                        setDistrict(district);
                    }}
                    value={district.district_id}
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
                    className="d-block"
                    showSearch
                    ref={selectWardRef}
                    onChange={(e) => {
                        const ward: any = wards.find((w: any) => {
                            return w.ward_id === e;
                        });
                        setWard(ward);
                    }}
                    placeholder="Chọn xã/ phường"
                    value={ward.ward_id}
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
            <div className="group__button d-flex justify-content-between">
                <Button
                    className="bg-primary text-white "
                    onClick={() => {
                        console.log('oge');
                        handleUpdate();
                    }}
                >
                    Lưu thông tin
                </Button>
                <Button className=" bg-danger text-white">Xóa hồ sơ</Button>
            </div>
        </Card>
    ) : (
        <Button>Thêm hồ sơ</Button>
    );
};
