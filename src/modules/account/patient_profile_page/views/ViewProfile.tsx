import {
    Button,
    Card,
    DatePicker,
    Input,
    Radio,
    Select,
    Form,
    Row,
    Col,
    message,
    List,
    Skeleton,
} from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useRecoilState } from 'recoil';
import { patientProfileState } from '../../../../stores/patientAtom';
import { PatientProfileLayout } from '../components/PatientProfileLayout';
import { ProvinceType, DistrictType } from '../../../../models/other';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmModal } from '../../../../components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
    useFetchDistrictsByProvince,
    useFetchProfiles,
    useFetchProvinces,
    useFetchWardsByDistrict,
} from '../../../../hooks';
import { NoticeType } from 'antd/es/message/interface';
import {
    useCreatePatientProfile,
    useFetchProfileByUuid,
    useUpdatePatientProfile,
} from '../../../../hooks/patient_profile/usePatientProfile';
import { PatientProfile } from '../../../../models';
import {
    EditOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    UserOutlined,
} from '@ant-design/icons';
const ViewProfile = () => {
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [messageApi, messageContextHolder] = message.useMessage();
    const [updatedUuid, setUpdatedUuid] = useState<string>(
        searchParams.get('profile') ?? ''
    );
    const [patientProfile, setPatientProfile] =
        useRecoilState(patientProfileState);
    const {
        data: profiles,
        isError,
        error,
        isFetching,
        refetch,
    } = useFetchProfiles(JSON.parse(localStorage.getItem('uuids') || `[]`));
    const { data: profile, isFetching: isFetchingProfile } =
        useFetchProfileByUuid(updatedUuid);
    const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(
        null
    );
    const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
        null
    );
    const { data: provinces } = useFetchProvinces();
    const { data: districts } = useFetchDistrictsByProvince(selectedProvinceId);
    const { data: wards } = useFetchWardsByDistrict(selectedDistrictId);
    const [form] = Form.useForm();
    const dateFormat = 'DD-MM-YYYY';
    const [isCreate, setIsCreate] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [isOpenModalConfirm, setIsOpenModalConfirm] =
        useState<boolean>(false);
    const openMessage = (type: NoticeType, content: string) => {
        messageApi.open({ type, content });
    };
    const { mutate: createPatientProfile } = useCreatePatientProfile();
    const { mutate: updatePatientProfile } = useUpdatePatientProfile();
    const handleUpdate = (values: any) => {
        if (isCreate) {
            const newProfile = {
                uuid: uuidv4(),
                patientName: values.patientName,
                patientPhone: values.patientPhone,
                patientEmail: values.patientEmail,
                birthday: dayjs(values.birthday).format('YYYY-MM-DD'),
                province: values.province,
                district: values.district,
                commune: values.commune,
                gender: values.gender,
            };
            createPatientProfile(newProfile, {
                onSuccess() {
                    openMessage('success', 'Thêm hồ sơ thành công!');
                    const uuids = JSON.parse(
                        localStorage.getItem('uuids') || '[]'
                    );
                    if (uuids.length > 0) {
                        uuids.push(newProfile.uuid);
                        console.log(uuids);
                        localStorage.setItem('uuids', JSON.stringify(uuids));
                    } else {
                        localStorage.setItem(
                            'uuids',
                            JSON.stringify([newProfile.uuid])
                        );
                    }
                    refetch();
                    setIsCreate(false);
                    setShowForm(false);
                    form.resetFields();
                },
                onError() {
                    openMessage('error', 'Thêm hồ sơ không thành công!');
                },
            });
        } else {
            const newProfile: any = {
                patientName: values.patientName,
                patientPhone: values.patientPhone,
                patientEmail: values.patientEmail,
                birthday: dayjs(values.birthday).format('YYYY-MM-DD'),
                province: values.province,
                district: values.district,
                commune: values.commune,
                gender: values.gender,
                uuid: profile.uuid,
                id: profile.id,
            };
            updatePatientProfile(newProfile, {
                onSuccess() {
                    openMessage('success', 'Cập nhật hồ sơ thành công!');
                    refetch();
                    setShowForm(false);
                    form.resetFields();
                    queryClient.removeQueries({
                        queryKey: ['useFetchProfileByUuid', updatedUuid],
                        exact: true,
                    });
                    if (searchParams.get('index')) {
                        setPatientProfile(newProfile);
                        queryClient.invalidateQueries({
                            queryKey: ['useFetchProfileByUuid', updatedUuid],
                        });
                        const queryParams = new URLSearchParams();
                        queryParams.append(
                            'doctorId',
                            searchParams.get('index') ?? ''
                        );
                        navigate(`/booking-appointment?${queryParams}`);
                    }
                },
                onError() {
                    openMessage('success', 'Cập nhật hồ sơ không thành công!');
                },
            });
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        if (searchParams.get('profile')) {
            setShowForm(true);
        }
    }, []);

    useEffect(() => {
        if (profile?.uuid) {
            if (provinces) {
                const province = provinces.find(
                    (pro: any) => pro.province_name === profile.province
                );
                if (province) {
                    setSelectedProvinceId(province.province_id);
                }
            }
        }
    }, [provinces]);

    useEffect(() => {
        if (profile?.uuid) {
            if (districts) {
                const district = districts.find(
                    (dis: DistrictType) =>
                        dis.district_name === profile.district
                );
                if (district) {
                    setSelectedDistrictId(district?.district_id);
                }
            }
        }
    }, [districts]);

    useEffect(() => {
        if (profile) {
            form.setFieldsValue({
                patientName: profile.patientName,
                patientPhone: profile.patientPhone,
                patientEmail: profile.patientEmail,
                gender: profile.gender,
                birthday: dayjs(profile.birthday),
                province: profile.province,
                district: profile.district,
                commune: profile.commune,
            });
        }
    }, [profile]);
    const handleDelete = (uuid: string) => {};
    return (
        <>
            {messageContextHolder}
            <PatientProfileLayout breadcrumb="Hồ sơ">
                <Skeleton active loading={isFetching}>
                    <List
                        itemLayout="vertical"
                        grid={
                            profiles?.length === 1
                                ? { gutter: 24, column: 1 } // 1 cột khi chỉ có 1 profile
                                : { gutter: 24, column: 2 } // 2 cột khi có 2+ profiles}
                        }
                        dataSource={profiles}
                        renderItem={(profile: PatientProfile) => {
                            return (
                                <List.Item actions={[]}>
                                    <Card
                                        className={
                                            profiles?.length === 1
                                                ? 'shadow w-50 m-auto '
                                                : 'shadow '
                                        }
                                    >
                                        <Row gutter={24} className="">
                                            <Col span={24}>
                                                <Col span={24}>
                                                    <UserOutlined className="fs-6 text-body-tertiary" />
                                                    <span
                                                        className="ms-2 fs-6 fw-medium"
                                                        style={{
                                                            color: '#0378db',
                                                        }}
                                                    >
                                                        {profile.patientName}
                                                    </span>
                                                </Col>
                                                <Col
                                                    span={24}
                                                    className="d-flex"
                                                >
                                                    <div className="col-5">
                                                        <label className="fs-6">
                                                            <i className="fs-6  fa-solid fa-cake-candles d-inline-block  text-body-tertiary"></i>
                                                            <span className="ms-2 fs-6 fw-medium">
                                                                Ngày sinh :
                                                            </span>
                                                        </label>
                                                    </div>
                                                    <div className="col-7">
                                                        <span className="col-6 fs-6 fw-medium">
                                                            {dayjs(
                                                                profile.birthday
                                                            ).format(
                                                                'DD/MM/YYYY'
                                                            )}
                                                        </span>
                                                    </div>
                                                </Col>
                                                <Col
                                                    span={24}
                                                    className="d-flex"
                                                >
                                                    <div className="col-5">
                                                        <label className="fs-6">
                                                            <PhoneOutlined className="text-body-tertiary" />
                                                            <span className="ms-2 fs-6 fw-medium">
                                                                Số điện thoại :
                                                            </span>
                                                        </label>
                                                    </div>
                                                    <div className="col-7">
                                                        <span className="col-6 fs-6 fw-medium">
                                                            {
                                                                profile.patientPhone
                                                            }
                                                        </span>
                                                    </div>
                                                </Col>
                                                <Col
                                                    span={24}
                                                    className="d-flex"
                                                >
                                                    <div className="col-5">
                                                        <label className="fs-6">
                                                            <EnvironmentOutlined className="text-body-tertiary" />
                                                            <span className="ms-2 fs-6 fw-medium">
                                                                Địa chỉ :
                                                            </span>
                                                        </label>
                                                    </div>
                                                    <div className="col-7">
                                                        <span className="col-6 fs-6 fw-medium">
                                                            {profile.commune +
                                                                ',' +
                                                                profile.district +
                                                                ',' +
                                                                profile.province}
                                                        </span>
                                                    </div>
                                                </Col>
                                                <Col
                                                    span={24}
                                                    className="d-flex"
                                                >
                                                    <div className="col-5">
                                                        <label className="fs-6">
                                                            <i className="fa-regular fa-envelope  text-body-tertiary"></i>
                                                            <span className="ms-2 fs-6 fw-medium">
                                                                Địa chỉ email :
                                                            </span>
                                                        </label>
                                                    </div>
                                                    <div className="col-7">
                                                        <span className="col-6 fs-6 fw-medium">
                                                            {
                                                                profile.patientEmail
                                                            }
                                                        </span>
                                                    </div>
                                                </Col>
                                            </Col>
                                            <Col span={24} className="mt-3">
                                                <Row
                                                    gutter={24}
                                                    justify={'space-between'}
                                                >
                                                    <Col
                                                        span={12}
                                                        className="d-flex"
                                                    >
                                                        <Button
                                                            className="bg-danger text-white border-0"
                                                            onClick={() => {
                                                                handleDelete(
                                                                    profile.uuid
                                                                );
                                                            }}
                                                        >
                                                            <i className="fa-solid fa-trash"></i>
                                                            Xóa
                                                        </Button>
                                                        <Button
                                                            style={{
                                                                backgroundColor:
                                                                    'rgba(54,153,255,.1)',
                                                            }}
                                                            className="ms-3 border-0"
                                                            onClick={() => {
                                                                const queryParams =
                                                                    new URLSearchParams();
                                                                queryParams.append(
                                                                    'profile',
                                                                    profile.uuid.toString()
                                                                );
                                                                navigate(
                                                                    `/patient/profile?${queryParams.toString()}`
                                                                );
                                                                setShowForm(
                                                                    true
                                                                );
                                                                setUpdatedUuid(
                                                                    profile.uuid
                                                                );
                                                            }}
                                                        >
                                                            <EditOutlined />
                                                            Chỉnh sửa
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Card>
                                </List.Item>
                            );
                        }}
                    ></List>
                </Skeleton>
                {showForm ? (
                    <Form form={form} layout="vertical" onFinish={handleUpdate}>
                        <Skeleton active loading={isFetchingProfile}>
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
                                        <Input />
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
                                        <Input />
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
                                        <Input />
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
                                                const pro: any =
                                                    provinces?.find(
                                                        (province: any) => {
                                                            return (
                                                                province.province_name ===
                                                                province_name
                                                            );
                                                        }
                                                    );
                                                setSelectedProvinceId(
                                                    pro.province_id
                                                );

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
                                            {provinces?.map(
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
                                                const dis: any =
                                                    districts?.find(
                                                        (item: any) => {
                                                            return (
                                                                item.district_name ===
                                                                value
                                                            );
                                                        }
                                                    );
                                                setSelectedDistrictId(
                                                    dis.district_id
                                                );

                                                form.setFieldValue(
                                                    'commune',
                                                    null
                                                );
                                            }}
                                            placeholder="Chọn quận/ huyện/ thị xã"
                                            optionFilterProp="children"
                                        >
                                            {districts?.map((item) => {
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
                                            placeholder="Chọn xã/ phường"
                                            optionFilterProp="children"
                                        >
                                            {wards?.map((item) => {
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
                            </Row>{' '}
                        </Skeleton>
                        <div className="group__button d-flex justify-content-between">
                            <Button
                                className="bg-primary text-white "
                                onClick={() => {
                                    form.submit();
                                }}
                            >
                                Lưu thông tin
                            </Button>
                            {patientProfile?.uuid && (
                                <Button
                                    className=" bg-danger text-white"
                                    onClick={() => {
                                        setIsOpenModalConfirm(true);
                                    }}
                                >
                                    Xóa hồ sơ
                                </Button>
                            )}
                        </div>
                    </Form>
                ) : (
                    <div className="text-center">
                        <Button
                            type="default"
                            className="mt-4"
                            onClick={() => {
                                setIsCreate(true);
                                setShowForm(true);
                            }}
                        >
                            Thêm mới hồ sơ
                        </Button>
                    </div>
                )}
                {isOpenModalConfirm && (
                    <ConfirmModal
                        message="Bạn chắc chắc muốn xóa hồ sơ này!"
                        isOpenModal={isOpenModalConfirm}
                        onCloseModal={() => setIsOpenModalConfirm(false)}
                        handleOk={() => {
                            console.log('delete');
                        }}
                    />
                )}
            </PatientProfileLayout>
        </>
    );
};
export default ViewProfile;
