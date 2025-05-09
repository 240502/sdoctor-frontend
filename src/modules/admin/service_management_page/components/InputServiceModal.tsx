import {
    Modal,
    Form,
    Input,
    Row,
    Col,
    Select,
    Image,
    Upload,
    Button,
} from 'antd';
import { useEffect, useState } from 'react';
import { SummaryEditor } from './SummaryEditor';
import { PreparationProcessEditor } from './PreparationProcessEditor';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { medicalPackageService, uploadService } from '../../../../services';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
import { Clinic } from '../../../../models/clinic';
import { ServiceDetailEditor } from './ServiceDetailEditor';
import { MedicalPackage } from '../../../../models/medical_package';
import { openNotification } from '../../../../utils/notification';
export const InputServiceModal = ({
    openInputModal,
    cancelModal,
    service,
    setService,
    isUpdate,
    clinics,
    categories,
    config,
    notificationApi,
    setServices,
}: any) => {
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

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    const UploadImage = async ({ file, onSuccess, onError }: any) => {
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
    const handleChangeSummaryEditor = (data: any) => {
        console.log('set data');
        setService({ ...service, summary: data });
    };
    const handleChangeProcessEditor = (data: any) => {
        setService({ ...service, preparation_process: data });
    };
    const handleChangeDetailEditor = (data: any) => {
        setService({ ...service, service_detail: data });
    };
    const onFinish = (values: any) => {
        console.log('values', values);
        const newService = {
            id: service?.id,
            name: values?.name,
            summary: service?.summary,
            price: values?.price,
            clinic_id: values?.clinic_id,
            category_id: values?.category_id,
            image: fileList[0].url ?? '',
            preparation_process: service?.preparation_process,
            service_detail: service?.service_detail,
        };
        if (isUpdate) {
            console.log('newService', newService);
            UpdateService(newService);
        } else {
            CreateService(newService);
        }
    };
    const CreateService = async (data: any) => {
        try {
            const res = await medicalPackageService.createService(data, config);
            console.log(res.data.result[0]);
            setServices((prvServices: MedicalPackage[]) => [
                ...prvServices,
                res.data.result[0],
            ]);
            openNotification(
                notificationApi,
                'success',
                'Thông báo',
                'Thêm thành công!'
            );
            cancelModal();
        } catch (err: any) {
            console.log(err.message);
            openNotification(
                notificationApi,
                'error',
                'Thông báo',
                'Thêm không thành công!'
            );
        }
    };
    const UpdateService = async (data: any) => {
        try {
            const res = await medicalPackageService.updateService(data, config);
            setServices((prvServices: MedicalPackage[]) => {
                return prvServices.map((service: MedicalPackage) => {
                    return service.id === data?.id
                        ? {
                              ...data,
                              clinic_name: service.clinicName,
                              category_name: service.categoryName,
                              location: service.location,
                          }
                        : service;
                });
            });
            openNotification(
                notificationApi,
                'success',
                'Thông báo',
                'Sửa thành công!'
            );
            cancelModal();
        } catch (err: any) {
            openNotification(
                notificationApi,
                'success',
                'Thông báo',
                'Sửa không thành công!'
            );
            console.log(err.message);
        }
    };
    useEffect(() => {
        if (service?.id) {
            const file: UploadFile[] = [
                {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: service?.image,
                },
            ];
            setFileList(file);
        }
        console.log('service', service);
    }, []);
    useEffect(() => {
        console.log('service', service);
    }, [service]);
    return (
        <Modal
            open={openInputModal}
            maskClosable={false}
            title="Chi tiết gói khám"
            onCancel={cancelModal}
            footer={[
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => form.submit()}
                >
                    {isUpdate ? 'Lưu' : 'Thêm mới'}
                </Button>,
                <Button onClick={cancelModal}>Đóng</Button>,
            ]}
            className="w-50"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    ...service,
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    label="Ảnh gói khám"
                    valuePropName="fileList"
                    className="upload-service-image"
                >
                    <Upload
                        customRequest={UploadImage}
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
                        <Form.Item label="Cơ sở y tế" name={'clinic_id'}>
                            <Select
                                showSearch
                                allowClear
                                optionFilterProp="children"
                            >
                                {clinics.map((clinic: Clinic) => {
                                    return (
                                        <Select.Option
                                            key={clinic.id}
                                            value={clinic.id}
                                        >
                                            {' '}
                                            {clinic.name}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Loại gói khám" name={'category_id'}>
                            <Select
                                showSearch
                                allowClear
                                optionFilterProp="children"
                            >
                                {categories.map((category: Clinic) => {
                                    return (
                                        <Select.Option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {' '}
                                            {category.name}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="Tên gói" name={'name'}>
                            <Input></Input>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Giá" name={'price'}>
                            <Input></Input>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Về gói khám">
                            <SummaryEditor
                                handleChangeSummaryEditor={
                                    handleChangeSummaryEditor
                                }
                                service={service}
                            ></SummaryEditor>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Quá trình chuẩn bị">
                            <PreparationProcessEditor
                                handleChangeProcessEditor={
                                    handleChangeProcessEditor
                                }
                                service={service}
                            ></PreparationProcessEditor>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Chi tiết gói khám">
                            <ServiceDetailEditor
                                handleChangeDetailEditor={
                                    handleChangeDetailEditor
                                }
                                service={service}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
