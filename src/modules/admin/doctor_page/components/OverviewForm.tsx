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
import { useEffect, useState } from 'react';
import {
    Clinic,
    DistrictType,
    DoctorService,
    Major,
    ProvinceType,
    WardType,
} from '../../../../models';
import { uploadService } from '../../../../services';
import axios from 'axios';
import dayjs from 'dayjs';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface OverviewFormProps {
    doctor: any;
    clinics: Clinic[];
    majors: any[];
    doctorServices: any;
    setDoctor: any;
}

import viVN from 'antd/lib/locale/vi_VN';
import 'dayjs/locale/vi';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import SummaryEditor from './SummaryEditor';
import { DescriptionEditor } from '../../../../components';

dayjs.locale('vi');
dayjs.extend(customParseFormat);
export const OverviewForm = ({
    doctor,
    clinics,
    majors,
    doctorServices,
    setDoctor,
}: OverviewFormProps) => {
    const [birthDayError, setBirthDayError] = useState<any>('');
    const handleChangeDoctorEditor = (data: any) => {
        setDoctor({ ...doctor, introduction: data });
    };
    const handleChangeSummaryEditor = (data: any) => {
        setDoctor({ ...doctor, summary: data });
    };
    const [provinces, setProvinces] = useState<ProvinceType[]>([]);
    const [districts, setDistricts] = useState<DistrictType[]>([]);
    const [wards, setWards] = useState<WardType[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [ward, setWard] = useState<WardType>({} as WardType);
    const [district, setDistrict] = useState<DistrictType>({} as DistrictType);
    const [province, setProvince] = useState<ProvinceType>({} as ProvinceType);
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
    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

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
            onSuccess?.({}, file);
        } catch (error) {
            onError?.(error);
        }
    };
    //find province when patient had a profile
    useEffect(() => {
        const getProvince = () => {
            const province: any = provinces.find(
                (item) => item?.province_name === doctor?.city
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
                (item) => item.district_name === doctor?.district
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
                (item) => item.ward_name === doctor?.commune
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
    //find province when patient had a profile
    useEffect(() => {
        const getProvince = () => {
            const province: any = provinces.find(
                (item) => item?.province_name === doctor?.province
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
    return (
        <Form
            form={form}
            layout="vertical"
            // onFinish={onFinish}
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
                        >
                            {clinics.map((clinic: Clinic) => (
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
                        >
                            {majors.map((major: Major) => (
                                <Select.Option key={major.id} value={major.id}>
                                    {major.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                {/*
                        Tên bệnh nhân không được để trống.
                        Tên chỉ chứa ký tự chữ cái (hỗ trợ Unicode, cho phép tiếng Việt).
                        Độ dài tối thiểu và tối đa (ví dụ: từ 3 đến 50 ký tự).
                        Không được chứa ký tự số hoặc ký tự đặc biệt.
                    */}
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
            </Row>
            <Row gutter={24}>
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
            </Row>
            <Row gutter={24}>
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
                            // onChange={(e) => {
                            //     const pro: any = provinces.find(
                            //         (province: any) => {
                            //             return province.province_name === e;
                            //         }
                            //     );
                            //     setProvince(pro);
                            //     form.setFieldValue('patientDistrict', null);
                            //     form.setFieldValue('patientCommune', null);
                            // }}
                        >
                            {provinces.map((province: ProvinceType) => {
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
                            onChange={(e) => {
                                const dis: any = districts.find((item: any) => {
                                    return item.district_name === e;
                                });

                                setDistrict(dis);
                                form.setFieldValue('commune', null);
                            }}
                        >
                            {districts.map((district: DistrictType) => {
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
                            onChange={(e) => {
                                console.log(e);
                            }}
                        >
                            {wards.map((ward: WardType) => {
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
                    <Form.Item label="Học vấn" name="title">
                        <Input placeholder="Nhập học vấn ..." />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        label="Dịch vụ"
                        name="service_id"
                        rules={[
                            {
                                required: true,
                                message:
                                    'Vui lòng nhập chọn dịch vụ mà bác sĩ cung cấp!',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn dịch vụ"
                            allowClear
                            showSearch
                        >
                            {doctorServices?.map((service: DoctorService) => {
                                return (
                                    <Select.Option
                                        key={service.id}
                                        value={service.id}
                                    >
                                        {service.name}
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
