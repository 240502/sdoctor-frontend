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
import { uploadService } from '../../../../services';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
import { Clinic } from '../../../../models/clinic';
import { ServiceDetailEditor } from './ServiceDetailEditor';
import {
    MedicalPackage,
    MedicalPackageCreateDTO,
    MedicalPackageUpdateDTO,
} from '../../../../models/medical_package';
import { ServiceCategory } from '../../../../models';
import {
    useFetchMedicalPackageById,
    useCreateMedicalPackage,
    useUpdateMedicalPackage,
} from '../../../../hooks';
import { useSearchParams } from 'react-router-dom';
import { NoticeType } from 'antd/es/message/interface';
import { useQueryClient } from '@tanstack/react-query';

interface InputMedicalPackageModalProps {
    openInputModal: boolean;
    cancelModal: () => void;
    isUpdate: boolean;
    clinics: Clinic[];
    categories: ServiceCategory[];
    openMessage: (type: NoticeType, content: string) => void;
    refetch: () => void;
}
export const InputMedicalPackageModal = ({
    openInputModal,
    cancelModal,
    isUpdate,
    clinics,
    categories,
    openMessage,
    refetch,
}: InputMedicalPackageModalProps) => {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const { mutate: createMedicalPackage } = useCreateMedicalPackage();
    const { mutate: updateMedicalPackage } = useUpdateMedicalPackage();
    const { data, isError, isFetching } = useFetchMedicalPackageById(
        searchParams.get('package') ? Number(searchParams.get('package')) : null
    );

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm();
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        console.log(e);

        return e?.fileList;
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

    const handleChange: UploadProps['onChange'] = ({
        fileList: newFileList,
    }) => {
        setFileList(newFileList);
        form.setFieldsValue({ image: newFileList });
    };
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
        form.setFieldsValue({ summary: data });
    };
    const handleChangeProcessEditor = (data: any) => {
        form.setFieldsValue({ preparationProcess: data });
    };
    const handleChangeDetailEditor = (data: any) => {
        form.setFieldsValue({ packageDetail: data });
    };
    const onFinish = (values: {
        image: UploadFile[];
        name: string;
        price: number;
        clinicId: number;
        categoryId: number;
        summary: string;
        preparationProcess: string;
        packageDetail: string;
    }) => {
        if (isUpdate) {
            console.log('values');

            const newMedicalPackage: MedicalPackageUpdateDTO = {
                id: data?.id,
                name: values?.name,
                summary: values.summary,
                price: values?.price,
                clinicId: values?.clinicId,
                categoryId: values?.categoryId,
                image: values.image[0].url ?? '',
                preparationProcess: values?.preparationProcess,
                serviceDetail: values?.packageDetail,
            };
            updateMedicalPackage(newMedicalPackage, {
                onSuccess() {
                    openMessage('success', 'Cập nhật thành công!');
                    refetch();
                    cancelModal();
                },
                onError() {
                    openMessage('error', 'Cập nhật không thành công!');
                },
            });
        } else {
            const newMedicalPackage: MedicalPackageCreateDTO = {
                name: values?.name,
                summary: values.summary,
                price: values?.price,
                clinicId: values?.clinicId,
                categoryId: values?.categoryId,
                image: values.image[0].url ?? '',
                preparationProcess: values?.preparationProcess,
                serviceDetail: values?.packageDetail,
            };
            createMedicalPackage(newMedicalPackage, {
                onSuccess() {
                    openMessage('success', 'Thêm thành công!');
                    refetch();
                    cancelModal();
                },
                onError() {
                    openMessage('error', 'Thêm không thành công!');
                },
            });
        }
    };

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                clinicId: data.clinicId,
                categoryId: data.categoryId,
                name: data.name,
                price: data.price,
                summary: data.summary,
                preparationProcess: data.preparationProcess,
                packageDetail: data.serviceDetail,
                image: data.image
                    ? [
                          {
                              uid: '-1',
                              name: 'image',
                              status: 'done',
                              url: data.image,
                          },
                      ]
                    : [],
            });
            setFileList(
                data.image
                    ? [
                          {
                              uid: '-1',
                              name: 'image',
                              status: 'done',
                              url: data.image,
                          },
                      ]
                    : []
            );
        }
    }, [data]);
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
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Ảnh gói khám"
                    className="upload-service-image text-center"
                    valuePropName="fileList"
                    name={'image'}
                    getValueFromEvent={normFile}
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
                        <Form.Item label="Cơ sở y tế" name={'clinicId'}>
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
                        <Form.Item label="Loại gói khám" name={'categoryId'}>
                            <Select
                                showSearch
                                allowClear
                                optionFilterProp="children"
                            >
                                {categories.map((category: ServiceCategory) => {
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
                        <Form.Item label="Về gói khám" name={'summary'}>
                            <SummaryEditor
                                handleChangeSummaryEditor={
                                    handleChangeSummaryEditor
                                }
                                medicalPackage={data}
                            ></SummaryEditor>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Quá trình chuẩn bị"
                            name={'preparationProcess'}
                        >
                            <PreparationProcessEditor
                                handleChangeProcessEditor={
                                    handleChangeProcessEditor
                                }
                                medicalPackage={data}
                            ></PreparationProcessEditor>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Chi tiết gói khám"
                            name={'packageDetail'}
                        >
                            <ServiceDetailEditor
                                handleChangeDetailEditor={
                                    handleChangeDetailEditor
                                }
                                medicalPackage={data}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
