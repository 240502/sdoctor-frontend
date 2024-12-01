import {
    Button,
    Select,
    Flex,
    Modal,
    Input,
    InputRef,
    Image,
    Upload,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import DoctorEditor from './DoctorEditor';
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
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { doctorService } from '../../../../services/doctorService';
import { useRecoilValue } from 'recoil';
import { configValue, userValue } from '../../../../stores/userAtom';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

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

    const [errors, setErrors] = useState<any>({
        clinicMsg: null,
        genderMsg: null,
        majorsMsg: null,
    });
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

    const UploadDoctorImage = async ({ file, onSuccess, onError }: any) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await doctorService.uploadImage(formData);
            const { url } = response.data;
            file.url = url;
            onSuccess?.({}, file);
        } catch (error) {
            onError?.(error);
        }
    };

    const handleData = () => {
        let errorMsg: any = {};
        let isEmptyClinic: boolean = false;
        let isEmptyMajor: boolean = false;
        let isEmptyGender: boolean = false;
        const isEmptyName = isEmpty(inputNameRef.current?.input);
        const isEmptyPhone = isEmpty(inputPhoneRef.current?.input);
        const isEmptyEmail = isEmpty(inputEmailRef.current?.input);
        const isEmptyAddress = isEmpty(inputAddressRef.current?.input);
        const isEmptyFee = isEmpty(inputFeeRef.current?.input);
        if (!doctor?.clinic_id) {
            isEmptyClinic = true;
            errorMsg = { ...errorMsg, clinicMsg: 'Vui lòng chọn cơ sở y tế' };
        }
        if (!doctor?.major_id) {
            isEmptyMajor = true;
            errorMsg = { ...errorMsg, majorMsg: 'Vui lòng chọn chuyên ngành' };
        }
        if (!doctor?.gender) {
            isEmptyGender = true;
            errorMsg = { ...errorMsg, genderMsg: 'Vui lòng chọn giới tính' };
        }
        setErrors(errorMsg);
        if (
            !isEmptyName &&
            !isEmptyPhone &&
            !isEmptyEmail &&
            !isEmptyAddress &&
            !isEmptyFee &&
            !isEmptyClinic &&
            !isEmptyMajor &&
            !isEmptyGender
        ) {
            const isNameError = validateName(inputNameRef.current?.input);
            const isEmailError = validateEmail(inputEmailRef.current?.input);
            const isPhoneError = validatePhone(inputPhoneRef.current?.input);
            const isErrorPhoneLength = validatePhoneLength(
                inputPhoneRef.current?.input
            );
            if (
                !isNameError &&
                !isErrorPhoneLength &&
                !isPhoneError &&
                !isEmailError
            ) {
                if (!isUpdate) {
                    const newDoctor = {
                        full_name: inputNameRef.current?.input?.value,
                        clinic_id: doctor.clinic_id,
                        major_id: doctor.major_id,
                        description: doctor.description,
                        image: fileList[0].url ?? '',
                        email: inputEmailRef.current?.input?.value,
                        phone: inputPhoneRef.current?.input?.value,
                        address: inputAddressRef.current?.input?.value,
                        gender: doctor.gender,
                        title: inputTitleRef.current?.input?.value,
                        fee: inputFeeRef.current?.input?.value,
                        examination_object:
                            inputExamninationObjectRef.current?.input?.value,
                        introduction: doctor.introduction,
                    };
                    CreateDoctor(newDoctor);
                    console.log(newDoctor);
                } else {
                    UpdateDoctor(doctor);
                    console.log(doctor);
                }
            }
        }
    };

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
                'success',
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
            className="w-50"
            title={'Thêm bác sĩ'}
            open={showDoctorModal}
            onOk={() => {
                console.log('Oke');
            }}
            onCancel={handleCloseDoctorModal}
            footer={[
                <Button type="primary" onClick={handleData}>
                    {isUpdate ? 'Lưu' : 'Thêm mới'}
                </Button>,
                <Button onClick={handleCloseDoctorModal}>Đóng</Button>,
            ]}
        >
            <div>
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
            </div>
            <Flex className="justify-content-between mb-3">
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
                        onFocus={() => setErrors({ ...errors, majorMsg: null })}
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
                            setDoctor({ ...doctor, full_name: e.target.value });
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
                        value={Number(doctor?.gender)}
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
                        <Select.Option value={1}> Nam</Select.Option>
                        <Select.Option value={2}> Nữ</Select.Option>
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
                            setDoctor({ ...doctor, address: e.target.value });
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
                <div className="col-6 ps-2">
                    <label htmlFor="" className="mb-2">
                        Đối tượng khám
                    </label>
                    <Input
                        value={doctor?.examination_object}
                        ref={inputExamninationObjectRef}
                        placeholder="Nhập đối tượng ..."
                        onChange={(e) => {
                            setDoctor({
                                ...doctor,
                                examination_object: e.target.value,
                            });
                        }}
                    />
                </div>
            </Flex>
            <div className="mb-3">
                <label htmlFor="" className="mb-2">
                    Mô tả nhanh
                </label>
                <TextArea
                    value={doctor?.description}
                    onChange={(e) => {
                        setDoctor({ ...doctor, description: e.target.value });
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
            </div>
        </Modal>
    );
};
