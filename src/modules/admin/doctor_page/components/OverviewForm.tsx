import { PlusOutlined } from '@ant-design/icons';
import {
    Input,
    Image,
    Upload,
    DatePicker,
    Form,
    Row,
    Col,
    ConfigProvider,
    Select,
} from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import {
    Clinic,
    Department,
    DistrictType,
    DoctorService,
    Major,
    ProvinceType,
    WardType,
} from '../../../../models';
import { uploadService } from '../../../../services';
import dayjs from 'dayjs';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface OverviewFormProps {
    doctor: any;
    doctorServices: any;
    setDoctor: any;
    handleChangeDoctor: (doctor: any) => void;
}

import viVN from 'antd/lib/locale/vi_VN';
import 'dayjs/locale/vi';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import SummaryEditor from './SummaryEditor';
import { DescriptionEditor } from '../../../../components';
import {
    useFetchAllDegrees,
    useFetchAllDepartments,
    useFetchClinicsWithPagination,
    useFetchDistrictsByProvince,
    useFetchProvinces,
    useFetchSpecializationsWithPagination,
    useFetchWardsByDistrict,
} from '../../../../hooks';
import { Degrees } from '../../../../models/degrees';

dayjs.locale('vi');
dayjs.extend(customParseFormat);
export const OverviewForm = ({ doctor, setDoctor }: OverviewFormProps) => {
    const [form] = Form.useForm();
    const [birthDayError, setBirthDayError] = useState<any>('');
    const { data: clinicsResponse } = useFetchClinicsWithPagination({});
    const { data: majors } = useFetchSpecializationsWithPagination({});
    const { data: departments } = useFetchAllDepartments();
    const { data: titles } = useFetchAllDegrees();
    const handleChangeDoctorEditor = (data: any) => {
        setDoctor({ ...doctor, introduction: data });
    };
    const handleChangeSummaryEditor = (data: any) => {
        setDoctor({ ...doctor, summary: data });
    };
    const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(
        null
    );
    const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
        null
    );
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const { data: provinces } = useFetchProvinces();
    const { data: districts } = useFetchDistrictsByProvince(selectedProvinceId);
    const { data: wards } = useFetchWardsByDistrict(selectedDistrictId);
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
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
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
            setDoctor({ ...doctor, image: url });
            onSuccess?.({}, file);
        } catch (error) {
            onError?.(error);
        }
    };

    useEffect(() => {
        if (doctor?.image && doctor?.image?.includes('cloudinary')) {
            const file: UploadFile[] = [
                {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: doctor?.image,
                },
            ];
            setFileList(file);
        }
    }, []);
    const clinics = useMemo(() => {
        return clinicsResponse?.pages.flatMap((page) => page.data) ?? [];
    }, [clinicsResponse]);
    return (
        <Form
            layout="vertical"
            initialValues={{
                ...doctor,
                birthday: doctor?.birthday ? dayjs(doctor?.birthday) : null,
            }}
        >
            <Form.Item
                label="Ảnh bác sĩ"
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
                        name="clinic_id"
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
                                setDoctor({ ...doctor, clinicId: value })
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
                            onChange={(value: number) =>
                                setDoctor({ ...doctor, department: value })
                            }
                        >
                            {departments?.departments?.map(
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
                        label="Chuyên ngành"
                        name="major_id"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn chuyên ngành!',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn chuyên ngành"
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            onChange={(value: number) =>
                                setDoctor({ ...doctor, majorId: value })
                            }
                        >
                            {majors?.majors?.map((major: Major) => (
                                <Select.Option key={major.id} value={major.id}>
                                    {major.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Họ và tên"
                        name="full_name"
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
                                message: 'Tên không được dài quá 50 ký tự',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Nhập họ và tên ..."
                            onBlur={(e: any) =>
                                setDoctor({
                                    ...doctor,
                                    fullName: e.target.value,
                                })
                            }
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
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
                        <Select
                            placeholder="Chọn giới tính"
                            onChange={(value: string) =>
                                setDoctor({ ...doctor, gender: value })
                            }
                        >
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
                        <Input
                            placeholder="Nhập số điện thoại ..."
                            onBlur={(e: any) =>
                                setDoctor({
                                    ...doctor,
                                    phone: e.target.value,
                                })
                            }
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
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
                        <Input
                            placeholder="Nhập email ..."
                            onBlur={(e: any) =>
                                setDoctor({
                                    ...doctor,
                                    email: e.target.value,
                                })
                            }
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
                                setDoctor({
                                    ...doctor,
                                    city: value,
                                });
                                setSelectedProvinceId(option.key);
                                form.setFieldValue('patientDistrict', null);
                                form.setFieldValue('patientCommune', null);
                            }}
                        >
                            {provinces?.map((province: ProvinceType) => {
                                return (
                                    <Select.Option
                                        value={province.province_name}
                                        key={province.province_id}
                                    >
                                        {province.province_name}
                                    </Select.Option>
                                );
                            })}
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
                                setDoctor({
                                    ...doctor,
                                    district: value,
                                });
                                form.setFieldValue('commune', null);
                            }}
                        >
                            {districts?.map((district: DistrictType) => {
                                return (
                                    <Select.Option
                                        key={district.district_id}
                                        value={district.district_name}
                                    >
                                        {district.district_name}
                                    </Select.Option>
                                );
                            })}
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
                                message: 'Vui lòng chọn xã/phường',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn xã/phường"
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            onChange={(value: string) =>
                                setDoctor({
                                    ...doctor,
                                    commune: value,
                                })
                            }
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
                        <Select
                            placeholder="Nhập ..."
                            onChange={(e: any) =>
                                setDoctor({
                                    ...doctor,
                                    title: e,
                                })
                            }
                        >
                            {titles &&
                                titles.map((degree: Degrees) => {
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
                    <ConfigProvider locale={viVN}>
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
                                onFocus={() => {
                                    setBirthDayError('');
                                }}
                                className="d-block"
                                format={'DD-MM-YYYY'}
                                placeholder="Chọn ngày sinh"
                                onChange={(date: any, dateString: any) =>
                                    setDoctor({ ...doctor, dateString })
                                }
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

            <Form.Item label="Mô tả nhanh" name="summary">
                <SummaryEditor
                    doctor={doctor}
                    handleChangeSummaryEditor={handleChangeSummaryEditor}
                />
            </Form.Item>

            <Form.Item label="Giới thiệu" name="details">
                <DescriptionEditor
                    handleChangeDoctorEditor={handleChangeDoctorEditor}
                    doctor={doctor}
                />
            </Form.Item>
        </Form>
    );
};
