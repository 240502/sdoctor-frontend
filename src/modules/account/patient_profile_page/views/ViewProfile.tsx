import {
    Button,
    Card,
    DatePicker,
    DatePickerProps,
    Input,
    Radio,
    Select,
    notification,
    Form,
    Row,
    Col,
    message,
} from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { patientProfileState } from '../../../../stores/patientAtom';
import { patientProfileService } from '../../../../services';
import { PatientProfileLayout } from '../components/PatientProfileLayout';
import { PatientProfile } from '../../../../models/patient_profile';
import { ProvinceType, DistrictType, WardType } from '../../../../models/other';
import { ConfirmModal } from '../../../../components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
type NotificationType = 'success' | 'error';
const ViewProfile = () => {
    const [messageApi, messageContextHolder] = message.useMessage();
    const [patientProfile, setPatientProfile] =
        useRecoilState(patientProfileState);
    const [profileCopy, setProfileCopy] = useState<PatientProfile>(
        {} as PatientProfile
    );
    const [form] = Form.useForm();
    const dateFormat = 'DD-MM-YYYY';
    const [isCreate, setIsCreate] = useState<boolean>(true);
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
        setProfileCopy({
            ...patientProfile,
            birthday: dayjs(date).format('YYYY-MM-DD'),
        });
    };
    const handleUpdate = (values: any) => {
        if (isCreate) {
            const newProfile = {
                patientName: values.patientName,
                patientPhone: values.patientPhone,
                patientEmail: values.patientEmail,
                birthday: dayjs(values.birthday).format('YYYY-MM-DD'),
                province: values.province,
                district: values.district,
                commune: values.commune,
                gender: values.gender,
            };
            CreatePatientProfile(newProfile);
        } else {
            if (
                JSON.stringify({
                    ...profileCopy,
                    birthday: dayjs(profileCopy.birthday).format('YYYY-MM-DD'),
                }) !==
                JSON.stringify({
                    ...patientProfile,
                    birthday: dayjs(patientProfile.birthday).format(
                        'YYYY-MM-DD'
                    ),
                })
            ) {
                const newProfile = {
                    patientName: values.patientName,
                    patientPhone: values.patientPhone,
                    patientEmail: values.patientEmail,
                    birthday: dayjs(values.birthday).format('YYYY-MM-DD'),
                    province: values.province,
                    district: values.district,
                    commune: values.commune,
                    gender: values.gender,
                    uuid: patientProfile.uuid,
                    id: patientProfile.id,
                };
                UpdateProfile(newProfile);
            } else {
                messageApi.open({
                    type: 'warning',
                    content: 'Không có gì thay đổi!',
                    duration: 3000,
                });
            }
        }
    };
    const CreatePatientProfile = async (data: any) => {
        try {
            const res = await patientProfileService.createPatientProfile(data);
            console.log(res.data.result);
            localStorage.setItem('uuid', JSON.stringify(res.data.result.uuid));
            openNotificationWithIcon(
                'success',
                'Thông báo',
                'Thêm hồ sơ thành công'
            );
            setIsCreate(false);
            setPatientProfile(res.data.result);
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'error',
                'Thông báo',
                'Thêm hồ sơ không thành công'
            );
        }
    };
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const navigate = useNavigate();
    const UpdateProfile = async (newProfile: any) => {
        try {
            const res = await patientProfileService.updatePatientProfile(
                newProfile
            );
            console.log(res);
            openNotificationWithIcon(
                'success',
                'Thông báo!',
                'Cập nhật thông tin thành công!'
            );
            setPatientProfile(newProfile);
            const queryParams = new URLSearchParams();
            queryParams.append('doctorId', searchParams.get('index') ?? '');
            queryClient.invalidateQueries({
                queryKey: ['useFetchProfiles', [newProfile.uuid]],
            });
            navigate(`/booking-appointment?${queryParams}`);
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

    const handleCancelModalConfirm = () => {
        setIsOpenModalConfirm(false);
    };
    const handleDeleteProfile = async (uuid: string) => {
        try {
            const res = await patientProfileService.deletePatientProfile(uuid);
            console.log(res);
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
            setPatientProfile({} as PatientProfile);
            form.setFieldValue('patientName', '');
            form.setFieldValue('patientPhone', '');
            form.setFieldValue('patientEmail', '');
            form.setFieldValue('gender', null);
            form.setFieldValue('province', null);
            form.setFieldValue('district', null);
            form.setFieldValue('commune', null);
            form.setFieldValue('birthday', null);

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
            const res = await patientProfileService.getProfileByPhoneOrEmail(
                data
            );
            localStorage.setItem('uuid', res.uuid);
            setIsCreate(false);
            setPatientProfile(res);
            setSearchValue('');
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'error',
                'Thông báo!',
                'Không tìm thấy hồ sơ nào!'
            );
        }
    };
    const getProvinces = async () => {
        console.log('getProvinces');
        try {
            const res = await axios.get(
                'https://vapi.vnappmob.com/api/v2/province'
            );
            setProvinces(res.data.results);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getProvinces();
        window.scrollTo(0, 0);
        if (patientProfile.uuid) {
            setProfileCopy(patientProfile);
            setIsCreate(false);
        }
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
    return (
        <>
            {contextHolder}
            {messageContextHolder}
            <PatientProfileLayout breadcrumb="Hồ sơ">
                <Card title="Hồ sơ bệnh nhân" bordered={false}>
                    {patientProfile?.uuid !== undefined || isCreate ? (
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleUpdate}
                            initialValues={{
                                ...patientProfile,
                                birthday: dayjs(patientProfile.birthday),
                            }}
                        >
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Họ và tên"
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
                                                message:
                                                    'Tên phải có ít nhất 3 ký tự',
                                            },
                                            {
                                                max: 50,
                                                message:
                                                    'Tên không được dài quá 50 ký tự',
                                            },
                                        ]}
                                    >
                                        <Input
                                            onChange={(e: any) =>
                                                setProfileCopy({
                                                    ...patientProfile,
                                                    patientName: e.target.value,
                                                })
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Số điện thoại"
                                        name={'patientPhone'}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng nhập số điện thoại',
                                            },
                                            {
                                                pattern:
                                                    /^(03|05|07|08|09)\d{8}$/,
                                                message:
                                                    'Số điện thoại không hợp lệ. Phải là số di động 10 chữ số',
                                            },
                                        ]}
                                    >
                                        <Input
                                            onChange={(e) =>
                                                setProfileCopy({
                                                    ...patientProfile,
                                                    patientPhone:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Email"
                                        name={'patientEmail'}
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
                                            onChange={(e) =>
                                                setProfileCopy({
                                                    ...patientProfile,
                                                    patientEmail:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Giới tính"
                                        name={'gender'}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng chọn giới tính',
                                            },
                                        ]}
                                    >
                                        <Radio.Group
                                            value={Number(
                                                patientProfile.gender
                                            )}
                                            onChange={(e) =>
                                                setProfileCopy({
                                                    ...patientProfile,
                                                    gender: e.target.value,
                                                })
                                            }
                                        >
                                            <Radio value={1}>Nam</Radio>
                                            <Radio value={2}>Nữ</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Ngày sinh"
                                        name={'birthday'}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Không được để trống ô này',
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            placeholder="Chọn ngày"
                                            onChange={onBirthDayChange}
                                            className="d-block"
                                            type="date"
                                            format={dateFormat}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Tỉnh/Thành phố"
                                        name={'province'}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng chọn tỉnh/thành',
                                            },
                                        ]}
                                    >
                                        <Select
                                            className="d-block"
                                            showSearch
                                            onChange={(
                                                province_name: string
                                            ) => {
                                                const pro: any = provinces.find(
                                                    (province: any) => {
                                                        return (
                                                            province.province_name ===
                                                            province_name
                                                        );
                                                    }
                                                );
                                                setProvince(pro);

                                                setProfileCopy({
                                                    ...patientProfile,
                                                    province: province_name,
                                                });
                                                form.setFieldValue(
                                                    'district',
                                                    null
                                                );
                                                form.setFieldValue(
                                                    'commune',
                                                    null
                                                );
                                            }}
                                            placeholder="Chọn tỉnh/ thành phố"
                                            optionFilterProp="children"
                                        >
                                            {provinces.map(
                                                (province: ProvinceType) => {
                                                    return (
                                                        <Select.Option
                                                            value={
                                                                province.province_name
                                                            }
                                                            key={
                                                                province.province_id
                                                            }
                                                        >
                                                            {
                                                                province.province_name
                                                            }
                                                        </Select.Option>
                                                    );
                                                }
                                            )}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Quận/Huyện"
                                        name={'district'}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng chọn quận/huyện',
                                            },
                                        ]}
                                    >
                                        <Select
                                            className="d-block"
                                            showSearch
                                            onChange={(value: string) => {
                                                const dis: any = districts.find(
                                                    (item: any) => {
                                                        return (
                                                            item.district_name ===
                                                            value
                                                        );
                                                    }
                                                );
                                                setDistrict(dis);

                                                setProfileCopy({
                                                    ...patientProfile,
                                                    district: value,
                                                });
                                                form.setFieldValue(
                                                    'commune',
                                                    null
                                                );
                                            }}
                                            placeholder="Chọn quận/ huyện/ thị xã"
                                            optionFilterProp="children"
                                        >
                                            {districts.map((item) => {
                                                return (
                                                    <Select.Option
                                                        key={item.district_name}
                                                        value={
                                                            item.district_name
                                                        }
                                                    >
                                                        {item.district_name}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Xã/Phường"
                                        name={'commune'}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng chọn xã/phường',
                                            },
                                        ]}
                                    >
                                        <Select
                                            className="d-block"
                                            showSearch
                                            onChange={(value: string) => {
                                                setProfileCopy({
                                                    ...patientProfile,
                                                    commune: value,
                                                });
                                                setWard(ward);
                                            }}
                                            placeholder="Chọn xã/ phường"
                                            optionFilterProp="children"
                                        >
                                            {wards.map((item) => {
                                                return (
                                                    <Select.Option
                                                        key={item.ward_name}
                                                        value={item.ward_name}
                                                    >
                                                        {item.ward_name}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <div className="group__button d-flex justify-content-between">
                                <Button
                                    className="bg-primary text-white "
                                    onClick={() => {
                                        form.submit();
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
                        </Form>
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
                                            setSearchValue(
                                                String(e.target.value)
                                            );
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
                                        setIsCreate(true);
                                        getProvinces();
                                    }}
                                >
                                    Thêm mới hồ sơ
                                </Button>
                            </Card>
                        </div>
                    )}
                </Card>
                {isOpenModalConfirm && (
                    <ConfirmModal
                        message="Bạn chắc chắc muốn xóa hồ sơ này!"
                        openModal={isOpenModalConfirm}
                        handleCancelModal={() => setIsOpenModalConfirm(false)}
                        handleOk={handleDeleteProfile}
                    />
                )}
            </PatientProfileLayout>
        </>
    );
};
export default ViewProfile;
