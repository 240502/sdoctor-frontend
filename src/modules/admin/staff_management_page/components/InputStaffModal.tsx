import { PlusOutlined } from '@ant-design/icons';
import {
    Modal,
    Input,
    Form,
    Button,
    Select,
    Upload,
    Image,
    UploadFile,
    UploadProps,
    GetProp,
    Skeleton,
    Row,
    Col,
    DatePicker,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import {
    useFetchClinicsWithPagination,
    useFetchDistrictsByProvince,
    useFetchDoctorsWithPagination,
    useFetchProvinces,
    useFetchWardsByDistrict,
} from '../../../../hooks';
import {
    Clinic,
    DistrictType,
    Doctor,
    ProvinceType,
    WardType,
} from '../../../../models';
import dayjs, { Dayjs } from 'dayjs';
import {
    SupportStaffCreateDTO,
    SupportStaffUpdateDTO,
} from '../../../../models/support_staff';
import {
    useCreateSupportStaff,
    useDeleteSupportStaff,
    useFetchSupportStaffById,
    useUpdateSupportStaff,
} from '../../../../hooks/support_staff';
import { NoticeType } from 'antd/es/message/interface';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
interface InputStaffModalProps {
    openModal: boolean;
    closeModal: () => void;
    isUpdate: boolean;
    openMessage: (type: NoticeType, content: string) => void;
    refetch: () => void;
}
const InputStaffModal = ({
    openModal,
    closeModal,
    isUpdate,
    openMessage,
    refetch,
}: InputStaffModalProps) => {
    const [searchParams] = useSearchParams();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [AvtFiles, setAvtFiles] = useState<UploadFile[]>([]);
    const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(
        null
    );
    const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
        null
    );

    const [clinicId, setClinicId] = useState<number | null>(null);
    const { data: supportStaff, isFetching } = useFetchSupportStaffById(
        searchParams.get('employee') ? searchParams.get('employee') : null
    );
    const { mutate: updateSupportStaff } = useUpdateSupportStaff();

    const { data: clinicsResponse } = useFetchClinicsWithPagination({});
    const { data: doctorResponse } = useFetchDoctorsWithPagination({
        clinicId: clinicId,
    });
    const clinics = useMemo(() => {
        return clinicsResponse?.pages.flatMap((page) => page.data) ?? [];
    }, [clinicsResponse]);

    const doctors = useMemo(() => {
        return doctorResponse?.pages.flatMap((page) => page.data) ?? [];
    }, [doctorResponse]);
    const { data: provinces } = useFetchProvinces();
    const { data: districts } = useFetchDistrictsByProvince(selectedProvinceId);
    const { data: wards } = useFetchWardsByDistrict(selectedDistrictId);
    const { mutate: createStaff } = useCreateSupportStaff();
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
    const handleChangeAvt: UploadProps['onChange'] = ({
        fileList: newFileList,
    }) => {
        setAvtFiles(newFileList);
        form.setFieldsValue({ avatar: newFileList });
    };
    const [form] = Form.useForm();
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    const handleFinish = (values: {
        avatar: UploadFile[];
        fullName: string;
        gender: string;
        phone: string;
        email: string;
        birthday: Dayjs;
        city: string;
        district: string;
        commune: string;
        supporterId: number;
    }) => {
        if (isUpdate) {
            const newStaff: SupportStaffUpdateDTO = {
                employeeId: supportStaff?.userId ? supportStaff?.userId : null,
                email: values.email,
                gender: Number(values.gender),
                phone: values.phone || '',
                image: values?.avatar ? values?.avatar[0]?.url : '',
                fullName: values.fullName,
                birthday: values.birthday.format('YYYY-MM-DD'),
                city: values.city,
                district: values.district,
                commune: values.commune,
                supporterId: values.supporterId,
            };
            updateSupportStaff(newStaff, {
                onSuccess() {
                    openMessage('success', 'Cập nhật thành công!');
                    closeModal();
                    refetch();
                },
                onError() {
                    openMessage('error', 'Cập nhật không thành công!');
                },
            });
        } else {
            const newStaff: SupportStaffCreateDTO = {
                email: values.email,
                gender: Number(values.gender),
                phone: values.phone || '',
                image: values?.avatar ? values?.avatar[0]?.url : '',
                fullName: values.fullName,
                birthday: values.birthday.format('YYYY-MM-DD'),
                city: values.city,
                district: values.district,
                commune: values.commune,
                supporterId: values.supporterId,
            };
            createStaff(newStaff, {
                onSuccess() {
                    openMessage('success', 'Thêm thành công!');
                    closeModal();
                    refetch();
                },
                onError() {
                    openMessage('error', 'Thêm không thành công!');
                },
            });
        }
    };
    useEffect(() => {
        if (supportStaff) {
            setClinicId(supportStaff.clinicId);
            form.setFieldsValue({
                fullName: supportStaff.fullName,
                gender: supportStaff.gender.toString(),
                phone: supportStaff.phone,
                email: supportStaff.email,
                birthday: dayjs(supportStaff.birthday),
                city: supportStaff.city,
                district: supportStaff.district,
                commune: supportStaff.commune,
                clinicId: supportStaff.clinicId,
                image: supportStaff.image
                    ? [
                          {
                              uid: '-1',
                              name: 'image',
                              status: 'done',
                              url: supportStaff.image,
                          },
                      ]
                    : [],
                supporterId: supportStaff.supporterId,
            });
            setAvtFiles(
                supportStaff.image
                    ? [
                          {
                              uid: '-1',
                              name: 'image',
                              status: 'done',
                              url: supportStaff.image,
                          },
                      ]
                    : []
            );
        }
    }, [supportStaff]);
    return (
        <Modal
            title="Thông tin nhân viên"
            open={openModal}
            className="w-50"
            maskClosable={false}
            onCancel={closeModal}
            footer={[
                <Button onClick={closeModal}>Đóng</Button>,
                <Button type="primary" onClick={() => form.submit()}>
                    Lưu
                </Button>,
            ]}
        >
            <Skeleton active loading={false}>
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <Form.Item
                                name={'avatar'}
                                label="Ảnh đại diện"
                                className="text-center"
                                valuePropName="fileList"
                            >
                                <Upload
                                    listType="picture-circle"
                                    fileList={AvtFiles}
                                    onPreview={handlePreview}
                                    onChange={handleChangeAvt}
                                    maxCount={1}
                                >
                                    {AvtFiles.length === 0 && uploadButton}
                                </Upload>
                                {previewImage && (
                                    <Image
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
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name={'fullName'}
                                label="Họ và tên"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Vui lòng nhập đầy đủ họ và tên',
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập họ và tên ..." />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name={'gender'}
                                label="Giới tính"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn giới tính',
                                    },
                                ]}
                            >
                                <Select placeholder="Chọn giới tính">
                                    <Select.Option value="1">Nam</Select.Option>
                                    <Select.Option value="2">Nữ</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name={'phone'} label="Số điện thoại">
                                <Input placeholder="Nhập số điện thoại ..." />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name={'email'}
                                label="Email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập email',
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập email ..." />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name={'birthday'} label="Ngày sinh">
                                <DatePicker
                                    className="d-block"
                                    format={'DD-MM-YYYY'}
                                    placeholder="Chọn ngày sinh"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Tỉnh/Thành phố"
                                name="city"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập địa chỉ',
                                    },
                                ]}
                            >
                                <Select
                                    className="w-100"
                                    placeholder="Chọn tỉnh/thành"
                                    showSearch
                                    optionFilterProp="children"
                                    allowClear
                                    onChange={(value: string, option: any) => {
                                        setSelectedProvinceId(option.key);
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
                                                    key={province.province_id}
                                                >
                                                    {province.province_name}
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
                                        message: 'Vui lòng chọn quận/huyện',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Chọn quân/huyện"
                                    showSearch
                                    className="w-100"
                                    allowClear
                                    optionFilterProp="children"
                                    onChange={(value: string, option: any) => {
                                        setSelectedDistrictId(option.key);

                                        form.setFieldValue('commune', null);
                                    }}
                                >
                                    {districts?.map(
                                        (district: DistrictType) => {
                                            return (
                                                <Select.Option
                                                    key={district.district_id}
                                                    value={
                                                        district.district_name
                                                    }
                                                >
                                                    {district.district_name}
                                                </Select.Option>
                                            );
                                        }
                                    )}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Xã/Phường"
                                name="commune"
                                className="w-100"
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
                            <Form.Item
                                label="Cơ sở y tế"
                                name="clinicId"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn cơ sở y tế!',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Chọn cơ sở y tế"
                                    allowClear
                                    showSearch
                                    optionFilterProp="children"
                                    onChange={(value: number) =>
                                        setClinicId(value)
                                    }
                                >
                                    {clinics?.map((clinic: Clinic) => (
                                        <Select.Option
                                            key={clinic.id}
                                            value={clinic.id}
                                        >
                                            {clinic.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Bác sĩ"
                                name="supporterId"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn bác sĩ!',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Chọn bác sĩ"
                                    allowClear
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {doctors?.map((doctor: Doctor) => (
                                        <Select.Option
                                            key={doctor.doctorId}
                                            value={doctor.doctorId}
                                        >
                                            {doctor.fullName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Skeleton>
        </Modal>
    );
};

export default InputStaffModal;
