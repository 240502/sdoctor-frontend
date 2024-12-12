import {
    Button,
    Select,
    Flex,
    Modal,
    Input,
    InputRef,
    Image,
    Upload,
    DatePicker,
    Form,
    Row,
    Col,
    ConfigProvider,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import DescriptionEditor from './DescriptionEditor';
import { useEffect, useRef, useState } from 'react';
import { Clinic } from '../../../../models/clinic';
import { Major } from '../../../../models/major';
import {
    handleFocusInput,
    isEmpty,
    validateEmail,
    validateName,
    validatePhone,
    validatePhoneLength,
} from '../../../../utils/global';
const { Option } = Select;
import { PlusOutlined } from '@ant-design/icons';
import type { DatePickerProps, GetProp, UploadFile, UploadProps } from 'antd';
import { doctorService } from '../../../../services/doctorService';
import { UploadService } from '../../../../services/upload';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import SummaryEditor from './SummaryEditor';
import { DoctorService } from '../../../../models/doctorService';
import viVN from 'antd/lib/locale/vi_VN';
import 'dayjs/locale/vi';

dayjs.locale('vi');
dayjs.extend(customParseFormat);

const dateFormat = 'YYYY-MM-DD';
export const DoctorModal = ({
    showDoctorModal,
    handleCloseDoctorModal,
    doctor,
    setDoctor,
    openNotificationWithIcon,
    getDoctor,
    isUpdate,
    clinics,
    majors,
    config,
    doctorServices,
}: any) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const inputNameRef = useRef<InputRef>(null);
    const inputPhoneRef = useRef<InputRef>(null);
    const inputEmailRef = useRef<InputRef>(null);
    const inputAddressRef = useRef<InputRef>(null);
    const inputTitleRef = useRef<InputRef>(null);
    const inputFeeRef = useRef<InputRef>(null);
    const inputExamninationObjectRef = useRef<InputRef>(null);
    const [form] = Form.useForm();
    const [birthDayError, setBirthDayError] = useState<any>('');
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        setDoctor({ ...doctor, birthday: dateString });
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
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const handleChangeDoctorEditor = (data: any) => {
        setDoctor({ ...doctor, introduction: data });
    };
    const handleChangeSummaryEditor = (data: any) => {
        setDoctor({ ...doctor, summary: data });
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
        console.log('values', values);
        const today = dayjs();
        const age = today.diff(values.birthday, 'year'); // Tính tuổi bằng year
        console.log(age);
        if (age < 22) {
            setBirthDayError('Bác sĩ phải đủ 24 tuổi trở lên!');
        }

        if (isUpdate) {
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
                birthday: dayjs(values.birthday)
                    .format()
                    .toString()
                    .slice(0, 10),
            };
            console.log('new Doctor', newDoctor);

            UpdateDoctor(newDoctor);
        } else {
            const newDoctor = {
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
                birthday: dayjs(values.birthday)
                    .format()
                    .toString()
                    .slice(0, 10),
            };
            CreateDoctor(newDoctor);
        }

        // handleData(values); // Gửi dữ liệu từ form
    };
    // const handleData = () => {
    //     let errorMsg: any = {};

    //     setError(errorMsg);
    //     if (
    //         !isEmptyName &&
    //         !isEmptyPhone &&
    //         !isEmptyEmail &&
    //         !isEmptyAddress &&
    //         !isEmptyFee &&
    //         !isEmptyClinic &&
    //         !isEmptyMajor &&
    //         !isEmptyGender
    //     ) {
    //         const isNameError = validateName(inputNameRef.current?.input);
    //         const isEmailError = validateEmail(inputEmailRef.current?.input);
    //         const isPhoneError = validatePhone(inputPhoneRef.current?.input);
    //         const isErrorPhoneLength = validatePhoneLength(
    //             inputPhoneRef.current?.input
    //         );
    //         if (
    //             !isNameError &&
    //             !isErrorPhoneLength &&
    //             !isPhoneError &&
    //             !isEmailError
    //         ) {
    //             if (!isUpdate) {
    //                 const newDoctor = {
    //                     full_name: inputNameRef.current?.input?.value,
    //                     clinic_id: doctor.clinic_id,
    //                     major_id: doctor.major_id,
    //                     summary: doctor.summary,
    //                     image: fileList[0].url ?? '',
    //                     email: inputEmailRef.current?.input?.value,
    //                     phone: inputPhoneRef.current?.input?.value,
    //                     address: inputAddressRef.current?.input?.value,
    //                     gender: doctor.gender,
    //                     title: inputTitleRef.current?.input?.value,
    //                     fee: inputFeeRef.current?.input?.value,
    //                     examination_object:
    //                         inputExamninationObjectRef.current?.input?.value,
    //                     introduction: doctor.introduction,
    //                     birthday: doctor.birthday.toString().slice(0, 10),
    //                 };
    //                 CreateDoctor(newDoctor);
    //                 console.log(newDoctor);
    //             } else {
    //                 const newDoctor = {
    //                     doctor_id: doctor.doctor_id,
    //                     user_id: doctor.user_id,
    //                     full_name: inputNameRef.current?.input?.value,
    //                     clinic_id: doctor.clinic_id,
    //                     major_id: doctor.major_id,
    //                     summary: doctor.summary,
    //                     image: fileList[0].url ?? '',
    //                     email: inputEmailRef.current?.input?.value,
    //                     phone: inputPhoneRef.current?.input?.value,
    //                     address: inputAddressRef.current?.input?.value,
    //                     gender: doctor.gender,
    //                     title: inputTitleRef.current?.input?.value,
    //                     fee: inputFeeRef.current?.input?.value,
    //                     examination_object:
    //                         inputExamninationObjectRef.current?.input?.value,
    //                     introduction: doctor.introduction,
    //                     birthday: doctor.birthday.toString().slice(0, 10),
    //                 };
    //                 UpdateDoctor(newDoctor);
    //                 console.log(newDoctor);
    //             }
    //         }
    //     }
    // };

    const CreateDoctor = async (newDoctor: any) => {
        try {
            const res = await doctorService.createDoctor(newDoctor, config);
            console.log(res);
            openNotificationWithIcon(
                'success',
                'Thông báo!',
                'Thêm bác sĩ thành công!'
            );
            getDoctor();
            handleCloseDoctorModal();
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'error',
                'Thông báo!',
                'Thêm bác sĩ không thành công!'
            );
        }
    };

    const UpdateDoctor = async (newDoctor: any) => {
        try {
            const res = await doctorService.updateDoctor(newDoctor, config);
            console.log(res);
            openNotificationWithIcon(
                'success',
                'Thông báo!',
                'Sửa thông tin bác sĩ thành công!'
            );
            getDoctor();
            handleCloseDoctorModal();
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'error',
                'Thông báo!',
                'Sửa thông tin không thành công!'
            );
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

    return (
        <Modal
            className="w-50 input-doctor-modal"
            title={'Thêm bác sĩ'}
            open={showDoctorModal}
            maskClosable={false}
            onCancel={handleCloseDoctorModal}
            footer={[
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => form.submit()}
                >
                    {isUpdate ? 'Lưu' : 'Thêm mới'}
                </Button>,
                <Button onClick={handleCloseDoctorModal}>Đóng</Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    ...doctor,
                    birthday: doctor?.birthday ? dayjs(doctor?.birthday) : null,
                }}
            >
                {/* <div>
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
                </div> */}
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
                {/* <Flex className="justify-content-between mb-3">
                    <div className="col-6  pe-2">
                        <label htmlFor="" className="d-flex mb-2">
                            Cơ sở y tế
                        </label>
                        <Select
                            value={doctor?.clinic_id}
                            className="d-block"
                            placeholder="Chọn cơ sở y tế"
                            optionFilterProp="children"
                            allowClear
                            onChange={(e) => {
                                setDoctor({ ...doctor, clinic_id: e });
                            }}
                            onFocus={() =>
                                setErrors({ ...errors, clinicMsg: null })
                            }
                        >
                            {clinics.map((clinic: Clinic) => (
                                <Option
                                    key={clinic.id}
                                    value={clinic.id}
                                    label={clinic.name}
                                >
                                    {clinic.name}
                                </Option>
                            ))}
                        </Select>
                        {errors?.clinicMsg && (
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            >
                                {errors.clinicMsg}
                            </div>
                        )}
                    </div>
                    <div className="col-6 ps-2">
                        <label htmlFor="" className="d-flex mb-2">
                            Chuyên ngành
                        </label>
                        <Select
                            value={doctor?.major_id}
                            className="d-block"
                            placeholder="Chọn chuyên ngành"
                            allowClear
                            optionFilterProp="children"
                            onChange={(e) => {
                                setDoctor({ ...doctor, major_id: e });
                            }}
                            onFocus={() =>
                                setErrors({ ...errors, majorMsg: null })
                            }
                        >
                            {majors.map((major: Major) => (
                                <Option
                                    key={major.id}
                                    value={major.id}
                                    label={major.name}
                                >
                                    {major.name}
                                </Option>
                            ))}
                        </Select>
                        {errors?.majorMsg && (
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            >
                                {errors.majorMsg}
                            </div>
                        )}
                    </div>
                </Flex>
                <Flex className="justify-content-between mb-3">
                    <div className="col-6  pe-2">
                        <label htmlFor="" className="mb-2">
                            Họ và tên
                        </label>
                        <Input
                            onFocus={(e: any) => {
                                handleFocusInput(e.target);
                            }}
                            value={doctor?.full_name}
                            ref={inputNameRef}
                            placeholder="Nhập họ và tên ..."
                            onChange={(e) => {
                                setDoctor({
                                    ...doctor,
                                    full_name: e.target.value,
                                });
                            }}
                        />
                        <div
                            className="error_message mt-3"
                            style={{ color: 'red' }}
                        ></div>
                    </div>
                    <div className="col-6 ps-2">
                        <label htmlFor="" className="mb-2">
                            Giới tính
                        </label>
                        <Select
                            value={doctor?.gender}
                            className="d-block mt-0 p-0"
                            placeholder="Chọn giới tính"
                            onChange={(value: number) => {
                                console.log(value);
                                setDoctor({ ...doctor, gender: value });
                            }}
                            onFocus={() =>
                                setErrors({ ...errors, genderMsg: null })
                            }
                        >
                            <Select.Option value={'1'}> Nam</Select.Option>
                            <Select.Option value={'2'}> Nữ</Select.Option>
                        </Select>
                        {errors?.genderMsg && (
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            >
                                {errors.genderMsg}
                            </div>
                        )}
                    </div>
                </Flex>
                <Flex className="justify-content-between mb-3">
                    <div className="col-6  pe-2">
                        <label htmlFor="" className="mb-2">
                            Số điện thoại
                        </label>
                        <Input
                            onFocus={(e: any) => {
                                handleFocusInput(e.target);
                            }}
                            value={doctor?.phone}
                            ref={inputPhoneRef}
                            placeholder="Nhập số điện thoại ..."
                            onChange={(e) => {
                                setDoctor({ ...doctor, phone: e.target.value });
                            }}
                        />
                        <div
                            className="error_message mt-3"
                            style={{ color: 'red' }}
                        ></div>
                    </div>
                    <div className="col-6 ps-2">
                        <label htmlFor="" className="mb-2">
                            Email
                        </label>
                        <Input
                            onFocus={(e: any) => {
                                handleFocusInput(e.target);
                            }}
                            value={doctor?.email}
                            ref={inputEmailRef}
                            placeholder="Nhập email ..."
                            onChange={(e) => {
                                setDoctor({ ...doctor, email: e.target.value });
                            }}
                        />
                        <div
                            className="error_message mt-3"
                            style={{ color: 'red' }}
                        ></div>
                    </div>
                </Flex>
                <Flex className="justify-content-between mb-3">
                    <div className="col-6  pe-2">
                        <label htmlFor="" className="mb-2">
                            Địa chỉ
                        </label>
                        <Input
                            onFocus={(e: any) => {
                                handleFocusInput(e.target);
                            }}
                            value={doctor?.address}
                            ref={inputAddressRef}
                            placeholder="Nhập địa chỉ ..."
                            onChange={(e) => {
                                setDoctor({
                                    ...doctor,
                                    address: e.target.value,
                                });
                            }}
                        />
                        <div
                            className="error_message mt-3"
                            style={{ color: 'red' }}
                        ></div>
                    </div>
                    <div className="col-6 ps-2">
                        <label htmlFor="" className="mb-2">
                            Học vấn
                        </label>
                        <Input
                            value={doctor?.title}
                            ref={inputTitleRef}
                            placeholder="Nhập học vấn ..."
                            onChange={(e) => {
                                setDoctor({ ...doctor, title: e.target.value });
                            }}
                        />
                    </div>
                </Flex>
                <Flex className="justify-content-between mb-3">
                    <div className="col-6  pe-2">
                        <label htmlFor="" className="mb-2">
                            Chi giá khám
                        </label>
                        <Input
                            onFocus={(e: any) => {
                                handleFocusInput(e.target);
                            }}
                            value={doctor?.fee}
                            ref={inputFeeRef}
                            placeholder="Nhập giá khám..."
                            onChange={(e) => {
                                setDoctor({ ...doctor, fee: e.target.value });
                            }}
                        />
                        <div
                            className="error_message mt-3"
                            style={{ color: 'red' }}
                        ></div>
                    </div>
                    <div className="col-6  pe-2">
                        <label htmlFor="" className="form-label">
                            Ngày/ Tháng/ Năm Sinh
                        </label>
                        <DatePicker
                            className="d-block"
                            format="YYYY-MM-DD"
                            defaultValue={
                                doctor?.birthday
                                    ? dayjs(doctor?.birthday, dateFormat)
                                    : null
                            }
                            onChange={onChange} // Hàm xử lý khi thay đổi ngày
                            placeholder="Chọn ngày sinh"
                        />

                        {errors?.birthdayMsg && (
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            >
                                {errors.birthdayMsg}
                            </div>
                        )}
                    </div>
                </Flex>
                <div className="mb-3">
                    <label htmlFor="" className="mb-2">
                        Mô tả nhanh
                    </label>
                    <TextArea
                        value={doctor?.summary}
                        onChange={(e) => {
                            setDoctor({ ...doctor, summary: e.target.value });
                        }}
                        placeholder="Nhập mô tả nhanh ..."
                    />
                    <div
                        className="error_message mt-3"
                        style={{ color: 'red' }}
                    ></div>
                </div>
                <div className="mb-3">
                    <label htmlFor="">Chi tiết</label>
                    <DoctorEditor
                        handleChangeDoctorEditor={handleChangeDoctorEditor}
                        doctor={doctor}
                    />
                </div> */}
            </Form>
        </Modal>
    );
};
