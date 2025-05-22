import { useState, useEffect } from 'react';
import {
    Form,
    Row,
    Col,
    Upload,
    Image,
    UploadFile,
    UploadProps,
    GetProp,
    Input,
    Button,
    Skeleton,
} from 'antd';
import ClinicEditor from './ClinicEditor';
import { PlusOutlined } from '@ant-design/icons';
import {
    useCreateClinic,
    useFetchClinicById,
    useUpdateClinic,
} from '../../../../hooks';
import { Clinic, ClinicCreate, ClinicUpdateDto } from '../../../../models';
import { clinicService, uploadService } from '../../../../services';
import { NoticeType } from 'antd/es/message/interface';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
interface InputOverviewTabProps {
    clinicId: number | null;

    openMessage: (type: NoticeType, content: string) => void;
    isUpdateClinic: boolean;
    refetch: () => void;
    handleOverviewSaved: (clinicId: number) => void;
}
const InputOverviewTab = ({
    clinicId,
    openMessage,
    isUpdateClinic,
    refetch,
    handleOverviewSaved,
}: InputOverviewTabProps) => {
    const [form] = Form.useForm();
    const [clinic, setClinic] = useState<Clinic>({} as Clinic);
    const { mutate: createClinic } = useCreateClinic();
    const { mutate: updateClinic } = useUpdateClinic();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [AvtFiles, setAvtFiles] = useState<UploadFile[]>([]);
    const [CoverFiles, setCoverFiles] = useState<UploadFile[]>([]);
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
    const { data, isFetching } = useFetchClinicById(clinicId);

    const handleChangeAvt: UploadProps['onChange'] = ({
        fileList: newFileList,
    }) => {
        setAvtFiles(newFileList);
        form.setFieldsValue({ avatar: newFileList });
    };
    const handleChangeCoverImage: UploadProps['onChange'] = ({
        fileList: newFileList,
    }) => {
        setCoverFiles(newFileList);
        form.setFieldsValue({ coverImage: newFileList });
    };
    const handleChangeClinicEditor = (data: any) => {
        form.setFieldsValue({ description: data });
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
    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                name: data.name,
                location: data.location,
                description: data.description,
                avatar: data.avatar
                    ? [
                          {
                              uid: '-1',
                              name: 'avatar',
                              status: 'done',
                              url: data.avatar,
                          },
                      ]
                    : [],
                coverImage: data.coverImage
                    ? [
                          {
                              uid: '-2',
                              name: 'cover',
                              status: 'done',
                              url: data.coverImage,
                          },
                      ]
                    : [],
            });
            setAvtFiles(
                data.avatar
                    ? [
                          {
                              uid: '-1',
                              name: 'avatar',
                              status: 'done',
                              url: data.avatar,
                          },
                      ]
                    : []
            );
            setCoverFiles(
                data.coverImage
                    ? [
                          {
                              uid: '-2',
                              name: 'cover',
                              status: 'done',
                              url: data.coverImage,
                          },
                      ]
                    : []
            );
        }
    }, [data]);
    const onFinish = (values: {
        name: string;
        location: string;
        description: string;
        coverImage: UploadFile[];
        avatar: UploadFile[];
    }) => {
        if (isUpdateClinic) {
            const newClinic: ClinicUpdateDto = {
                id: data?.id,
                name: values.name,
                location: values.location,
                avatar: AvtFiles[0].url ?? '',
                coverImage: CoverFiles[0].url ?? '',
                description: values?.description,
            };
            updateClinic(newClinic, {
                onSuccess() {
                    handleOverviewSaved(data?.id);
                    openMessage('success', 'Cập nhật thành công!');
                    refetch();
                },
            });
        } else {
            const newClinic = {
                name: values.name,
                location: values.location,
                avatar: values.avatar[0]?.url ?? '',
                coverImage: values.coverImage[0]?.url ?? '',
                description: values?.description,
            };
            createClinic(newClinic, {
                onSuccess(data) {
                    handleOverviewSaved(data?.result[0].lastId);
                },
            });
        }
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <Skeleton active loading={isFetching}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[24, 24]}>
                    <Col span={24} className="d-flex">
                        <Form.Item
                            name={'avatar'}
                            label="Ảnh đại diện"
                            className="text-center"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
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
                            valuePropName="fileList"
                            getValueFromEvent={(e) =>
                                Array.isArray(e) ? e : e && e.fileList
                            }
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
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên cơ sở y tế',
                                },
                            ]}
                        >
                            <Input value={clinic?.name} id="clinicName" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name={'location'} label="Địa chỉ" required>
                            <Input id="location" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name={'description'} label="Giới thiệu">
                            <ClinicEditor
                                handleChangeClinicEditor={
                                    handleChangeClinicEditor
                                }
                                clinic={data}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Button
                            className="bg-primary text-white"
                            onClick={() => form.submit()}
                        >
                            Lưu
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Skeleton>
    );
};

export default InputOverviewTab;
