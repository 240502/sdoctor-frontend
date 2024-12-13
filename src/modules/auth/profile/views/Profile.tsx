import {
    Divider,
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
} from 'antd';
import dayjs from 'dayjs';
import type { GetProp, UploadProps, UploadFile } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Doctor } from '../../../../models/doctor';
import { useRecoilValue } from 'recoil';
import { configValue, userValue } from '../../../../stores/userAtom';
import { doctorService } from '../../../../services/doctorService';
import { Clinic } from '../../../../models/clinic';
import { Major } from '../../../../models/major';
import { DoctorService } from '../../../../models/doctorService';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
import viVN from 'antd/lib/locale/vi_VN';
import 'dayjs/locale/vi';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DescriptionEditor, SummaryEditor } from '../../../../components';
import { UploadService } from '../../../../services/upload';
import { ClinicService } from '../../../../services/clinicService';
import { DoctorServiceService } from '../../../../services/doctorServiceService';
import { MajorService } from '../../../../services/majorService';
import { openNotification } from '../../../../utils/notification';
import { UserService } from '../../../../services/userService';
dayjs.locale('vi');
dayjs.extend(customParseFormat);
const Profile = () => {
    const [form] = Form.useForm();
    const config = useRecoilValue(configValue);
    const [api, contextHolder] = notification.useNotification();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [birthDayError, setBirthDayError] = useState<any>('');
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [majors, setMajors] = useState<Major[]>([]);
    const [doctorServices, setDoctorServices] = useState<DoctorService[]>([]);
    const [doctor, setDoctor] = useState<Doctor>({} as Doctor);
    const user = useRecoilValue(userValue);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

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
    const handleChangeDescriptionEditor = (data: any) => {
        setDoctor({ ...doctor, introduction: data });
    };
    const handleChangeSummaryEditor = (data: any) => {
        setDoctor({ ...doctor, summary: data });
    };
    const getAllClinic = async () => {
        try {
            const res = await ClinicService.viewClinic({});
            setClinics(res.data);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const getAllService = async () => {
        try {
            const res = await DoctorServiceService.getAll();
            setDoctorServices(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const getAllMajor = async () => {
        try {
            const res = await MajorService.getAllMajor();
            setMajors(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const getDoctorById = async (id: number) => {
        try {
            const res = await doctorService.getDoctorById(id);
            const file: UploadFile[] = [
                {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: res?.image,
                },
            ];
            form.setFieldsValue({
                ...res,
                service_id: res?.service_id,
                birthday: res?.birthday ? dayjs(res.birthday) : null,
            });
            setFileList(file);
            setDoctor(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const UploadDoctorImage = async ({ file, onSuccess, onError }: any) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await UploadService.uploadImage(formData);
            const { url } = response.data;
            file.url = url;
            onSuccess?.({}, file);
        } catch (error) {
            onError?.(error);
        }
    };
    const onFinish = (values: any) => {
        const today = dayjs();
        const age = today.diff(values.birthday, 'year'); // Tính tuổi bằng year
        console.log(age);
        if (age < 22) {
            setBirthDayError('Bác sĩ phải đủ 24 tuổi trở lên!');
        }
        const newDoctor = {
            doctor_id: doctor.doctor_id,
            full_name: values.full_name,
            clinic_id: values.clinic_id,
            major_id: values.major_id,
            summary: doctor.summary,
            image: fileList[0].url ?? '',
            email: values.email,
            phone: values.phone,
            address: values.address,
            gender: values.gender,
            title: values.title,
            service_id: values.service_id,
            introduction: doctor.introduction,
            birthday: dayjs(values.birthday).format().toString().slice(0, 10),
        };
        UpdateDoctor(newDoctor);
    };
    const UpdateDoctor = async (newDoctor: any) => {
        try {
            const res = await doctorService.updateDoctor(newDoctor, config);
            console.log(res);
            openNotification(
                api,
                'success',
                'Thông báo!',
                'Sửa thông tin bác sĩ thành công!'
            );
        } catch (err: any) {
            console.log(err.message);
            openNotification(
                api,
                'error',
                'Thông báo!',
                'Sửa thông tin không thành công!'
            );
        }
    };

    useEffect(() => {
        if (user?.role_id === 2) {
            getDoctorById(user.doctor_id);
            getAllClinic();
            getAllMajor();
            getAllService();
        } else {
            form.setFieldsValue({
                ...user,
                birthday: user?.birthday ? dayjs(user.birthday) : null,
            });
        }
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            {contextHolder}
            <h3>Hồ sơ cá nhân</h3>
            <Divider />
            <Row gutter={24}>
                <Col span={4}>
                    <Upload></Upload>
                </Col>
            </Row>
            <Row className="border p-3">
                <Image src={user.image}></Image>
            </Row>
            {/* <Row gutter={24}>
                <Col span={24}>
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item
                            valuePropName="fileList"
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
                        {user?.role_id === 2 && (
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Cơ sở y tế"
                                        name="clinic_id"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng chọn cơ sở y tế!',
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
                                                message:
                                                    'Vui lòng chọn chuyên ngành!',
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
                                                <Select.Option
                                                    key={major.id}
                                                    value={major.id}
                                                >
                                                    {major.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}
                        <Row gutter={24}>
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
                                            message: 'Vui lòng chọn giới tính!',
                                        },
                                    ]}
                                >
                                    <Select placeholder="Chọn giới tính">
                                        <Select.Option value="1">
                                            Nam
                                        </Select.Option>
                                        <Select.Option value="2">
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
                                    label="Địa chỉ"
                                    name="address"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập địa chỉ',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Nhập địa chỉ ..." />
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
                        {user?.role_id === 2 && (
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item label="Học vấn" name="title">
                                        <Input placeholder="Nhập học vấn ..." />
                                    </Form.Item>
                                </Col>
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
                                            {doctorServices?.map(
                                                (service: DoctorService) => {
                                                    return (
                                                        <Select.Option
                                                            key={service.id}
                                                            value={service.id}
                                                        >
                                                            {service.name}
                                                        </Select.Option>
                                                    );
                                                }
                                            )}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}
                        {doctor?.doctor_id !== undefined && (
                            <Form.Item label="Mô tả nhanh" name="summary">
                                <SummaryEditor
                                    doctor={doctor}
                                    handleChangeSummaryEditor={
                                        handleChangeSummaryEditor
                                    }
                                />
                            </Form.Item>
                        )}

                        {doctor?.doctor_id && (
                            <Form.Item label="Giới thiệu" name="details">
                                <DescriptionEditor
                                    handleChangeDoctorEditor={
                                        handleChangeDescriptionEditor
                                    }
                                    doctor={doctor}
                                />
                            </Form.Item>
                        )}
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
            </Row> */}
        </>
    );
};

export default Profile;
