import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Modal,
    Upload,
    Image,
    GetProp,
    UploadFile,
    UploadProps,
    Flex,
    Input,
    InputRef,
    Form,
    Row,
    Col,
} from 'antd';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
import { uploadService, clinicService } from '../../../../services';
import { useState, useEffect, useRef } from 'react';
import { isEmpty, showSuccess } from '../../../../utils/global';
import ClinicEditor from './ClinicEditor';
export const InputClinicModal = ({
    openModalInputClinic,
    handleCloseInputModal,
    isUpdate,
    clinic,
    setClinic,
    config,
    openNotification,
    getClinics,
}: any) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [AvtFiles, setAvtFiles] = useState<UploadFile[]>([]);
    const [CoverFiles, setCoverFiles] = useState<UploadFile[]>([]);
    const inputNameRef = useRef<InputRef>(null);
    const inputLocationRef = useRef<InputRef>(null);
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
    };
    const handleChangeCoverImage: UploadProps['onChange'] = ({
        fileList: newFileList,
    }) => setCoverFiles(newFileList);
    const handleChangeClinicEditor = (data: any) => {
        setClinic({ ...clinic, description: data });
    };
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    const UploadClinicImage = async ({ file, onSuccess, onError }: any) => {
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

    const handleData = () => {
        const isEmptyName = isEmpty(inputNameRef.current?.input);
        const isEmptyLocation = isEmpty(inputLocationRef.current?.input);
        if (!isEmptyName && !isEmptyLocation) {
            if (isUpdate) {
                const newClinic = {
                    id: clinic?.id,
                    name: inputNameRef.current?.input?.value,
                    location: inputLocationRef.current?.input?.value,
                    avatar: AvtFiles[0].url ?? '',
                    cover_image: CoverFiles[0].url ?? '',
                    description: clinic?.description,
                };
                UpdateClinic(newClinic);
            } else {
                const newClinic = {
                    name: inputNameRef.current?.input?.value,
                    location: inputLocationRef.current?.input?.value,
                    avatar: AvtFiles[0].url ?? '',
                    cover_image: CoverFiles[0].url ?? '',
                    description: clinic?.description,
                };
                CreateClinic(newClinic);
            }
        }
    };
    const CreateClinic = async (data: any) => {
        try {
            console.log('new clinic', data);
            const res = await clinicService.createClinic(data, config);
            console.log(res);
            handleCloseInputModal();
            openNotification('success', 'Thông báo', 'Thêm thành công!');
            getClinics();
        } catch (err: any) {
            console.log(err.message);
            openNotification('error', 'Thông báo', 'Thêm không thành công!');
        }
    };

    const UpdateClinic = async (data: any) => {
        try {
            console.log('new clinic', data);
            const res = await clinicService.updateClinic(data, config);
            handleCloseInputModal();
            openNotification('success', 'Thông báo', 'Sửa thành công!');
            getClinics();
        } catch (err: any) {
            console.log(err.message);
            openNotification('error', 'Thông báo', 'Sửa không thành công!');
        }
    };
    useEffect(() => {
        if (clinic?.avatar && clinic?.avatar?.includes('cloudinary')) {
            const file: UploadFile[] = [
                {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: clinic?.avatar,
                },
            ];
            setAvtFiles(file);
        }

        if (clinic?.coverImage && clinic?.coverImage?.includes('cloudinary')) {
            const file: UploadFile[] = [
                {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: clinic?.coverImage,
                },
            ];
            setCoverFiles(file);
        }
    }, []);
    return (
        <Modal
            title={'Thêm cơ sở y tế'}
            className="w-50"
            open={openModalInputClinic}
            onCancel={handleCloseInputModal}
            footer={[
                <Button type="primary" onClick={handleData}>
                    {isUpdate ? 'Lưu' : 'Thêm mới'}
                </Button>,
                <Button onClick={handleCloseInputModal}>Đóng</Button>,
            ]}
        >
            <Form layout="vertical">
                <Row gutter={[24, 24]}>
                    <Col span={24} className="d-flex">
                        <Form.Item
                            name={'avatar'}
                            label="Ảnh đại diện"
                            className="text-center"
                        >
                            <Upload
                                customRequest={UploadClinicImage}
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
                        <Form.Item
                            name={'coverImage'}
                            label="Ảnh bìa"
                            className="ms-3"
                        >
                            <Upload
                                customRequest={UploadClinicImage}
                                listType="picture-circle"
                                fileList={CoverFiles}
                                onPreview={handlePreview}
                                onChange={handleChangeCoverImage}
                                maxCount={1}
                            >
                                {CoverFiles.length === 0 && uploadButton}
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
                            name={'name'}
                            label="Tên cơ sở y tế"
                            required
                        >
                            <Input
                                value={clinic?.name}
                                onFocus={(e) => showSuccess(e.target)}
                                onChange={(e) => {
                                    setClinic({
                                        ...clinic,
                                        name: e.target.value,
                                    });
                                }}
                                id="clinic_name"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name={'location'} label="Địa chỉ" required>
                            <Input
                                value={clinic?.location}
                                onChange={(e: any) => {
                                    setClinic({
                                        ...clinic,
                                        location: e.target.value,
                                    });
                                }}
                                onFocus={(e: any) => showSuccess(e.target)}
                                id="location"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name={'description'} label="Giới thiệu">
                            <ClinicEditor
                                handleChangeClinicEditor={
                                    handleChangeClinicEditor
                                }
                                clinic={clinic}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
