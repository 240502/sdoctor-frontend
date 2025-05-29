import {
    Button,
    Col,
    Form,
    GetProp,
    Row,
    Upload,
    UploadProps,
    Image,
    Select,
    Input,
    DatePicker,
    Skeleton,
} from 'antd';
import {
    useFetchAllDegrees,
    useFetchAllDepartments,
    useFetchClinicsWithPagination,
    useFetchDistrictsByProvince,
    useFetchDoctorDetail,
    useFetchProvinces,
    useFetchWardsByDistrict,
} from '../../../../hooks';
import { useEffect, useMemo, useState } from 'react';
import { UploadFile } from 'antd/lib';
import { PlusOutlined } from '@ant-design/icons';
import { uploadService } from '../../../../services';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
import dayjs from 'dayjs';
import {
    Clinic,
    Department,
    DistrictType,
    DoctorUpdateDto,
    ProvinceType,
    WardType,
} from '../../../../models';
import { DescriptionEditor, SummaryEditor } from '../../../../components';
import { Degrees } from '../../../../models/degrees';
import { useUpdateDoctor } from '../../../../hooks/doctors/useUpdateDoctor';
import { NoticeType } from 'antd/es/message/interface';
interface OverViewTabProps {
    doctorId: number;
    openMessage: (type: NoticeType, content: string) => void;
}
const OverViewTab = ({ doctorId, openMessage }: OverViewTabProps) => {
    const {
        data: doctor,
        isError,
        isFetching,
        refetch,
        isRefetching,
    } = useFetchDoctorDetail(doctorId);
    const { data: clinicResponse } = useFetchClinicsWithPagination({});
    const clinics = useMemo(() => {
        return clinicResponse?.pages?.flatMap((page) => page?.data) ?? [];
    }, [clinicResponse]);
    const { data: departmentsRes } = useFetchAllDepartments();
    const [selectedProvince, setSelectProvince] = useState<number | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<number | null>(
        null
    );
    const { data: degress } = useFetchAllDegrees();
    const { data: provinces } = useFetchProvinces();
    const { data: districts } = useFetchDistrictsByProvince(selectedProvince);
    const { data: wards } = useFetchWardsByDistrict(selectedDistrict);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm();
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
    const handleChange: UploadProps['onChange'] = ({
        fileList: newFileList,
    }) => {
        setFileList(newFileList);
        form.setFieldsValue({ image: newFileList });
    };

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
    const { mutate: updateDoctor } = useUpdateDoctor();
    const onFinish = (values: any) => {
        const newDoctor: DoctorUpdateDto = {
            doctorId: doctor.doctorId,
            image: values?.image[0]?.url ?? '',
            clinicId: values.clinicId,
            department: values.department,
            fullName: values.fullName,
            gender: values.gender,
            phone: values.phone,
            email: values.email,
            city: values.city,
            district: values.district,
            commune: values.commune,
            title: values.title,
            birthday: dayjs(values.birthday).format('YYYY-MM-DD'),
            summary: values.summary,
            introduction: values.introduction,
        };
        updateDoctor(newDoctor, {
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
        if (provinces) {
            if (doctor) {
                const selectedProvince: any = provinces?.find(
                    (province: ProvinceType) =>
                        province.province_name === doctor?.city
                );
                setSelectProvince(selectedProvince?.province_id);
            }
        }
    }, [provinces, doctor]);

    useEffect(() => {
        if (districts) {
            if (doctor) {
                const selectedDistrict: any = districts?.find(
                    (district: DistrictType) =>
                        district.district_name === doctor?.district
                );
                setSelectedDistrict(selectedDistrict?.district_id);
            }
        }
    }, [districts, doctor]);
    const handleChangeSummaryEditor = (value: string) => {
        form.setFieldsValue({ summary: value });
    };
    const handleChangeIntroductionEditor = (value: string) => {
        form.setFieldsValue({ introduction: value });
    };
    useEffect(() => {
        if (doctor) {
            setFileList(
                doctor.image
                    ? [
                          {
                              uid: '-1',
                              name: 'image',
                              status: 'done',
                              url: doctor.image,
                          },
                      ]
                    : []
            );
            form.setFieldsValue({
                clinicId: doctor?.clinicId,
                department: doctor?.department,
                fullName: doctor?.fullName,
                gender: doctor?.gender?.toString(),
                phone: doctor?.phone,
                email: doctor?.email,
                city: doctor?.city,
                district: doctor?.district,
                commune: doctor?.commune,
                title: doctor?.title,
                birthday: dayjs(doctor?.birthday),
                summary: doctor?.summary,
                introduction: doctor?.introduction,
                image: doctor?.image
                    ? [
                          {
                              uid: '-1',
                              name: 'image',
                              status: 'done',
                              url: doctor?.image,
                          },
                      ]
                    : [],
            });
        }
    }, [doctor]);
    return (
        <Skeleton active loading={isFetching || isRefetching}>
            {isError ? (
                <p>Có lỗi khi lấy thông tin. Vui lòng thử lại sau!</p>
            ) : (
                <Form layout="vertical" form={form} onFinish={onFinish}>
                    <Form.Item
                        label="Ảnh bác sĩ"
                        name={'image'}
                        valuePropName="fileList"
                        className="upload-doctor-image"
                    >
                        <Upload
                            customRequest={UploadDoctorImage}
                            listType="picture-circle"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            maxCount={1}
                        >
                            {fileList.length === 0 && uploadButton}
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
                    <Row gutter={24}>
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
                                label="Khoa"
                                name="department"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn khoa!',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Chọn khoa ..."
                                    allowClear
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {departmentsRes?.departments?.map(
                                        (department: Department) => (
                                            <Select.Option
                                                key={department.id}
                                                value={department.id}
                                            >
                                                {department.name}
                                            </Select.Option>
                                        )
                                    )}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
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
                                        message: 'Tên phải có ít nhất 3 ký tự',
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
                                        message: 'Vui lòng chọn giới tính!',
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
                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số điện thoại!',
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
                                        setSelectProvince(option.key);
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
                                        setSelectedDistrict(option.key);

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
                            <Form.Item label="Học hàm/ học vị" name="title">
                                <Select placeholder="Nhập ...">
                                    {degress &&
                                        degress?.map((degree: Degrees) => {
                                            return (
                                                <Select.Option
                                                    key={degree.id}
                                                    value={degree.id}
                                                    label={degree.name}
                                                >
                                                    {degree.name}
                                                </Select.Option>
                                            );
                                        })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Ngày sinh"
                                name="birthday"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn ngày sinh',
                                    },
                                ]}
                            >
                                <DatePicker
                                    className="d-block"
                                    format={'DD-MM-YYYY'}
                                    placeholder="Chọn ngày sinh"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Mô tả nhanh" name="summary">
                        <SummaryEditor
                            doctor={doctor}
                            handleChangeSummaryEditor={
                                handleChangeSummaryEditor
                            }
                        />
                    </Form.Item>

                    <Form.Item label="Giới thiệu" name="introduction">
                        <DescriptionEditor
                            handleChangeDoctorEditor={
                                handleChangeIntroductionEditor
                            }
                            doctor={doctor}
                        />
                    </Form.Item>
                    <Row>
                        <Button type="primary" htmlType="submit">
                            Lưu
                        </Button>
                    </Row>
                </Form>
            )}
        </Skeleton>
    );
};

export default OverViewTab;
