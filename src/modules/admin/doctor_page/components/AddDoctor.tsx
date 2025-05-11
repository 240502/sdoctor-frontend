import { Button, Col, Form, Row, Upload, Image, Select } from 'antd';
import { useState, useEffect } from 'react';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uploadService } from '../../../../services';
import { Clinic, Major } from '../../../../models';
import {
    useFetchAllClinics,
    useFetchSpecializationsWithPagination,
} from '../../../../hooks';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const AddDoctor = () => {
    const [form] = Form.useForm();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const { data: clinics } = useFetchAllClinics();
    const { data: majors } = useFetchSpecializationsWithPagination({});
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
    useEffect(() => {
        // if (doctor?.image && doctor?.image?.includes('cloudinary')) {
        //     const file: UploadFile[] = [
        //         {
        //             uid: '-1',
        //             name: 'image.png',
        //             status: 'done',
        //             url: doctor?.image,
        //         },
        //     ];
        //     setFileList(file);
        // }
        // const getProvinces = async () => {
        //     try {
        //         const res = await axios.get(
        //             'https://vapi.vnappmob.com/api/province'
        //         );
        //         setProvinces(res.data.results);
        //     } catch (err) {
        //         console.log(err);
        //     }
        // };
        // getProvinces();
    }, []);
    return (
        <Row gutter={24}>
            <Col span={24}>
                <Button>
                    <i className="fa-solid fa-arrow-left"></i> Quay lại
                </Button>
            </Col>
            <Col span={24} className="mt-3">
                <Form form={form} layout="vertical">
                    <Row gutter={24}>
                        <Col span={6}>
                            <Form.Item
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
                        </Col>
                        <Col span={6}>
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
                        <Col span={6}>
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
                                    {majors?.majors?.map((major: Major) => (
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
                </Form>
            </Col>
        </Row>
    );
};

export default AddDoctor;
