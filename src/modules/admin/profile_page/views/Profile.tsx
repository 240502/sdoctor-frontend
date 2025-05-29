import {
    Row,
    Col,
    Image,
    Upload,
    Form,
    Input,
    Select,
    ConfigProvider,
    DatePicker,
    notification,
    Button,
    Flex,
    message,
    Skeleton,
} from 'antd';
import dayjs from 'dayjs';
import type { GetProp, UploadProps, UploadFile } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userValue } from '../../../../stores/userAtom';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
import viVN from 'antd/lib/locale/vi_VN';
import 'dayjs/locale/vi';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { uploadService } from '../../../../services';
import { DistrictType, ProvinceType, WardType } from '../../../../models/other';
import { ChangePasswordModal } from '../components/ChangePassword';
import {
    useFetchDistrictsByProvince,
    useFetchProvinces,
    useFetchWardsByDistrict,
} from '../../../../hooks';
import {
    useFetchUserById,
    useUpdateUser,
} from '../../../../hooks/user/useUser';
import { UserUpdateDTO } from '../../../../models';
import { NoticeType } from 'antd/es/message/interface';
import { useSearchParams } from 'react-router-dom';
dayjs.locale('vi');
dayjs.extend(customParseFormat);

const Profile = () => {
    const [searchParam] = useSearchParams();
    const [form] = Form.useForm();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [birthDayError, setBirthDayError] = useState<any>('');

    const [activeButton, setActiveButton] = useState<string>('profile');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const [selectedProvince, setSelectProvince] = useState<number | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<number | null>(
        null
    );

    const { data: provinces } = useFetchProvinces();
    const { data: districts } = useFetchDistrictsByProvince(selectedProvince);
    const { data: wards } = useFetchWardsByDistrict(selectedDistrict);
    const {
        data: userRes,
        isFetching,
        refetch,
        isRefetching,
    } = useFetchUserById(
        searchParam.get('user') ? Number(searchParam.get('user')) : null
    );
    useEffect(() => {
        if (provinces) {
            if (userRes) {
                const selectedProvince: any = provinces?.find(
                    (province: ProvinceType) =>
                        province.province_name === userRes?.city
                );
                setSelectProvince(selectedProvince?.province_id);
            }
        }
    }, [provinces, userRes]);

    useEffect(() => {
        if (districts) {
            if (userRes) {
                const selectedDistrict: any = districts?.find(
                    (district: DistrictType) =>
                        district.district_name === userRes?.district
                );
                setSelectedDistrict(selectedDistrict?.district_id);
            }
        }
    }, [districts, userRes]);
    const [openChangePasswordModal, setOpenChangePasswordModal] =
        useState<boolean>(false);

    const cancelChangePasswordModal = () => {
        setOpenChangePasswordModal(false);
    };

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {<PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const UploadDoctorImage = async ({ file, onSuccess, onError }: any) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await uploadService.uploadImage(formData);
            const { url } = response.data;
            file.url = url;
            onSuccess?.({}, file);
        } catch (error) {
            onError?.(error);
        }
    };
    const [messageApi, contextHolder] = message.useMessage();
    const openMessage = (type: NoticeType, des: string) => {
        messageApi.open({
            type: type,
            content: des,
        });
    };
    const { mutate: updateUser } = useUpdateUser();
    const onFinish = (values: any) => {
        console.log('values', values);
        const newUser: UserUpdateDTO = {
            id: userRes?.userId,
            fullName: values.fullName,
            image: values?.image[0]?.url ?? '',
            phone: values.phone,
            gender: values.gender,
            email: values.email,
            birthday: values.birthday,
            city: values.city,
            district: values.district,
            commune: values.commune,
        };

        updateUser(newUser, {
            onSuccess() {
                openMessage('success', 'Cập nhật thành công!');
                refetch();
            },
            onError() {
                openMessage('error', 'Cập nhật không thành công!');
            },
        });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        if (userRes) {
            setFileList(
                userRes.image
                    ? [
                          {
                              uid: '-1',
                              name: 'image',
                              status: 'done',
                              url: userRes.image,
                          },
                      ]
                    : []
            );
            form.setFieldsValue({
                ...userRes,
                image: userRes?.image
                    ? [
                          {
                              uid: '-1',
                              name: 'image',
                              status: 'done',
                              url: userRes?.image,
                          },
                      ]
                    : [],
                birthday: userRes?.birthday ? dayjs(userRes.birthday) : null,
            });
        }
    }, [userRes]);

    return (
        <div className="profile-container">
            {contextHolder}
            <Flex className="justify-content-between">
                <div className="col-5">
                    <h5>Hồ sơ cá nhân</h5>
                </div>
                <div className="col-5 text-end">
                    <Button
                        onClick={() => {
                            setOpenChangePasswordModal(true);
                            console.log('oge');
                        }}
                    >
                        Đổi mật khẩu
                    </Button>
                </div>
            </Flex>
            <Skeleton active loading={isFetching || isRefetching}>
                <Row
                    gutter={24}
                    className="border rounded shadow mt-3 pane-container"
                >
                    <Col
                        span={24}
                        id="tab-profile"
                        className={`tab-pane ${
                            activeButton === 'profile' ? 'active' : ''
                        }`}
                    >
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Form.Item
                                valuePropName="fileList"
                                name={'image'}
                                className="upload-doctor-image   d-flex align-items-center"
                            >
                                <Upload
                                    className="d-inline-block"
                                    customRequest={UploadDoctorImage}
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                    maxCount={1}
                                >
                                    {fileList.length === 0 && uploadButton}
                                </Upload>
                                {previewImage && (
                                    <Image
                                        width={250}
                                        wrapperStyle={{ display: 'none' }}
                                        preview={{
                                            visible: previewOpen,
                                            onVisibleChange: (visible) =>
                                                setPreviewOpen(visible),
                                            afterOpenChange: (visible) =>
                                                !visible && setPreviewImage(''),
                                        }}
                                        src={previewImage}
                                    />
                                )}
                            </Form.Item>

                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Họ và tên"
                                        name="fullName"
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
                                        <Input placeholder="Nhập họ và tên ..." />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Giới tính"
                                        name="gender"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng chọn giới tính!',
                                            },
                                        ]}
                                    >
                                        <Select placeholder="Chọn giới tính">
                                            <Select.Option value={1}>
                                                Nam
                                            </Select.Option>
                                            <Select.Option value={2}>
                                                Nữ
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Số điện thoại"
                                        name="phone"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng nhập số điện thoại!',
                                            },
                                            {
                                                pattern: /^[0-9]+$/,
                                                message:
                                                    'Số điện thoại chỉ được chứa các ký tự số!',
                                            },
                                            {
                                                pattern: /^0[0-9]{9}$/,
                                                message:
                                                    'Số điện thoại không hợp lệ! Số hợp lệ phải bắt đầu bằng 0 và gồm 10 chữ số.',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Nhập số điện thoại ..." />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập email!',
                                            },
                                            {
                                                type: 'email',
                                                message: 'Email không hợp lệ!',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Nhập email ..." />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Tỉnh/Thành phố"
                                        name="city"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng nhập địa chỉ',
                                            },
                                        ]}
                                    >
                                        <Select
                                            className="w-100"
                                            placeholder="Chọn tỉnh/thành"
                                            showSearch
                                            optionFilterProp="children"
                                            allowClear
                                            onChange={(e, option: any) => {
                                                setSelectProvince(option?.key);

                                                form.setFieldValue(
                                                    'patientDistrict',
                                                    null
                                                );
                                                form.setFieldValue(
                                                    'patientCommune',
                                                    null
                                                );
                                            }}
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
                                        name="district"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng chọn quận/huyện',
                                            },
                                        ]}
                                    >
                                        <Select
                                            placeholder="Chọn quân/huyện"
                                            showSearch
                                            className="w-100"
                                            allowClear
                                            optionFilterProp="children"
                                            onChange={(e, option: any) => {
                                                setSelectedDistrict(option.key);

                                                form.setFieldValue(
                                                    'commune',
                                                    null
                                                );
                                            }}
                                        >
                                            {districts?.map(
                                                (district: DistrictType) => {
                                                    return (
                                                        <Select.Option
                                                            key={
                                                                district.district_id
                                                            }
                                                            value={
                                                                district.district_name
                                                            }
                                                        >
                                                            {
                                                                district.district_name
                                                            }
                                                        </Select.Option>
                                                    );
                                                }
                                            )}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    {/* Xã phường */}
                                    <Form.Item
                                        label="Xã/Phường"
                                        name="commune"
                                        className="w-100"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng chọn xã/phường',
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
                                            }}
                                        >
                                            {wards?.map((ward: WardType) => {
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
                                </Col>
                                <Col span={12}>
                                    <ConfigProvider locale={viVN}>
                                        <Form.Item
                                            label="Ngày sinh"
                                            name="birthday"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        'Vui lòng chọn ngày sinh',
                                                },
                                            ]}
                                        >
                                            <DatePicker
                                                onFocus={() => {
                                                    setBirthDayError('');
                                                }}
                                                className="d-block"
                                                format={'DD-MM-YYYY'}
                                                placeholder="Chọn ngày sinh"
                                            />
                                            {birthDayError !== '' && (
                                                <p className="text-danger mt-2">
                                                    {birthDayError}
                                                </p>
                                            )}
                                        </Form.Item>
                                    </ConfigProvider>
                                </Col>
                            </Row>

                            <Form.Item className="text-center">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{
                                        width: '10%',
                                    }}
                                    className="p-3"
                                >
                                    Lưu
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Skeleton>

            {openChangePasswordModal && (
                <ChangePasswordModal
                    openChangePasswordModal={openChangePasswordModal}
                    cancelChangePasswordModal={cancelChangePasswordModal}
                />
            )}
        </div>
    );
};

export default Profile;
