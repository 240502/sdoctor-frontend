import React, { useEffect } from 'react';
import {
    Form,
    Input,
    Select,
    DatePicker,
    Button,
    Space,
    Typography,
    Card,
    Modal,
    Row,
    Col,
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useFetchInvoiceDetailByAppointment } from '../../../../hooks/invoice/useInvoice';
import {
    useCreateExaminationResult,
    useFetchAppointmentById,
} from '../../../../hooks';
import { useSearchParams } from 'react-router-dom';
import { NoticeType } from 'antd/es/message/interface';
import { ExaminationResulsCreateDTO } from '../../../../models/examination_results';
import { useUpdateIsConclusion } from '../../../../hooks/appointments/useAppointment';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ExaminationResultFormValues {
    results: {
        invoice_detail_id: number;
        service_id: number;
        result_text: string;
        result_value: number | null;
        result_unit: string | null;
        conclusion: string;
        examination_date: dayjs.Dayjs;
        status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    }[];
    general_conclusion: {
        conclusion: string;
        examination_date: dayjs.Dayjs;
    };
}

interface InputResultModalProps {
    openModal: boolean;
    openMessage: (type: NoticeType, content: string) => void;
    cancelResultModal: () => void;
}
const ExaminationResultForm = ({
    openModal,
    openMessage,
    cancelResultModal,
}: InputResultModalProps) => {
    const [searchParams] = useSearchParams();
    const [form] = Form.useForm();
    const { data: invoiceDetails, isLoading: loadingInvoiceDetails } =
        useFetchInvoiceDetailByAppointment(
            Number(searchParams.get('appointment'))
        );
    const { data: appointmentData, isLoading: loadingAppointment } =
        useFetchAppointmentById(Number(searchParams.get('appointment')));
    const { mutate: updateIsConclusion } = useUpdateIsConclusion();
    useEffect(() => {
        if (invoiceDetails && invoiceDetails.length > 0) {
            form.setFieldsValue({
                results: invoiceDetails?.map((service: any) => ({
                    invoice_detail_id: service?.id,
                    service_id: service?.service_id,
                    result_text: '',
                    result_value: null,
                    result_unit: '',
                })),
                general_conclusion: {
                    conclusion: '',
                },
            });
        }
    }, [invoiceDetails, form]);
    const { mutate: createResult } = useCreateExaminationResult();
    const onFinish = async (values: ExaminationResultFormValues) => {
        try {
            console.log(values);

            const payload: ExaminationResulsCreateDTO[] = [
                ...values.results?.map((result) => ({
                    invoiceDetailId: result.invoice_detail_id,
                    appointmentId: Number(searchParams.get('appointment')),
                    patientId: appointmentData?.uuid,
                    doctorId: appointmentData?.doctorId,
                    serviceId: result.service_id,
                    resultText: result.result_text,
                    resultValue: result.result_value,
                    resultUnit: result.result_unit,
                    conclusion: result.conclusion,
                    isGeneralConclusion: 0,
                })),
                {
                    invoiceDetailId: null,
                    appointmentId: Number(searchParams.get('appointment')),
                    patientId: appointmentData?.uuid,
                    doctorId: appointmentData?.doctorId,
                    serviceId: null,
                    resultText: null,
                    resultValue: null,
                    resultUnit: null,
                    conclusion: values.general_conclusion.conclusion,
                    isGeneralConclusion: 1,
                },
            ];

            createResult(payload, {
                onSuccess() {
                    openMessage('success', 'Thêm thành công!');
                    cancelResultModal();
                    form.resetFields();
                    updateIsConclusion(Number(searchParams.get('appointment')));
                },
                onError() {
                    openMessage('success', 'Thêm không thành công!');
                },
            });
        } catch (error) {
            console.error('Lỗi khi lưu kết quả:', error);
        }
    };

    return (
        <Modal
            open={openModal}
            onCancel={cancelResultModal}
            className="w-75"
            footer={[
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => form.submit()}
                    icon={<SaveOutlined />}
                >
                    Lưu kết quả
                </Button>,
                <Button onClick={cancelResultModal}>Đóng</Button>,
            ]}
        >
            <Title level={2}>Nhập kết quả khám và xét nghiệm</Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[24, 6]} className="mb-3">
                    <Col span={8} className="d-flex">
                        <div className="col-4">
                            <Text strong>Cơ sở y tế: </Text>
                        </div>
                        <div className="col-6 fw-medium">Bệnh viện ABC</div>
                    </Col>
                    <Col span={8} className="d-flex">
                        <div className="col-4">
                            <Text strong>Phòng khám số: </Text>
                        </div>
                        <div className="col-6 fw-medium">B20</div>
                    </Col>
                    <Col span={8} className="d-flex">
                        <div className="col-4">
                            <Text strong>Chuyên khoa: </Text>
                        </div>
                        <div className="col-6 fw-medium">Tiêu hóa</div>
                    </Col>

                    <Col span={8} className="d-flex">
                        <div className="col-4">
                            <Text strong>Họ và tên: </Text>
                        </div>
                        <div className="col-6 fw-medium">Nguyễn Văn Sang</div>
                    </Col>
                    <Col span={8} className="d-flex">
                        <div className="col-4">
                            <Text strong>Tuổi: </Text>
                        </div>
                        <div className="col-6 fw-medium">B20</div>
                    </Col>
                    <Col span={8} className="d-flex">
                        <div className="col-4 ">
                            <Text strong>Giới tính: </Text>
                        </div>
                        <div className="col-6 fw-medium">B20</div>
                    </Col>
                    <Col span={8} className="d-flex">
                        <div className="col-4 ">
                            <Text strong>Quê quán: </Text>
                        </div>
                        <div className="col-6 fw-medium">B20</div>
                    </Col>

                    <Col span={8} className="d-flex">
                        <div className="col-4">
                            <Text strong>Giờ khám: </Text>
                        </div>
                        <div className="col-6 fw-medium">B20</div>
                    </Col>
                </Row>

                <Form.List name="results">
                    {(fields) => {
                        return (
                            <Row gutter={[24, 24]}>
                                {fields.map((field, index) => {
                                    console.log('field.name', field.name);

                                    return (
                                        <Col span={12}>
                                            <Card
                                                className="shadow"
                                                key={field.key}
                                                title={`Dịch vụ: ${invoiceDetails[index]?.service_name}`}
                                            >
                                                <Form.Item
                                                    name={[
                                                        field.name,
                                                        'invoice_detail_id',
                                                    ]}
                                                    hidden
                                                >
                                                    <Input type="hidden" />
                                                </Form.Item>
                                                <Form.Item
                                                    name={[
                                                        field.name,
                                                        'service_id',
                                                    ]}
                                                    hidden
                                                >
                                                    <Input type="hidden" />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Giá trị kết quả"
                                                    name={[
                                                        field.name,
                                                        'result_value',
                                                    ]}
                                                >
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Đơn vị"
                                                    name={[
                                                        field.name,
                                                        'result_unit',
                                                    ]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Kết quả chi tiết"
                                                    name={[
                                                        field.name,
                                                        'result_text',
                                                    ]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                'Vui lòng nhập kết quả chi tiết',
                                                        },
                                                    ]}
                                                >
                                                    <TextArea rows={4} />
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>
                        );
                    }}
                </Form.List>
                <Card title="Kết luận tổng quát" className="mt-3 shadow">
                    <Form.Item
                        label="Kết luận tổng quát"
                        name={['general_conclusion', 'conclusion']}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập kết luận tổng quát',
                            },
                        ]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                </Card>
            </Form>
        </Modal>
    );
};

export default ExaminationResultForm;
