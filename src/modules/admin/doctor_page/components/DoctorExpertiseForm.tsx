import { Button, Input, Form, Typography, Col, Tag, Flex } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

interface DoctorExpertiseFormProps {
    expertises: any[];
    handleChangeExpertise: (experinece: any) => void;
}

const DoctorExpertiseForm = ({
    expertises,
    handleChangeExpertise,
}: DoctorExpertiseFormProps) => {
    const [form] = Form.useForm();

    const onFinish = (values: { description: string }) => {
        handleChangeExpertise(values.description);
        form.resetFields();
    };
    useEffect(() => {
        console.log('expertises', expertises);
    }, [expertises]);

    return (
        <>
            <Form
                form={form}
                onFinish={onFinish}
                layout="inline"
                style={{ marginBottom: 20 }}
            >
                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mô tả!' },
                    ]}
                >
                    <Input placeholder="Ví dụ: Theo dõi thai sản" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Thêm <PlusOutlined />
                    </Button>
                </Form.Item>
            </Form>

            {expertises?.length > 0 ? (
                <Flex wrap gap="middle" align="stretch">
                    {expertises?.map((expertise) => {
                        return (
                            <Col span={6} className="gutter-row">
                                <Tag
                                    color="rgb(248, 249, 252)"
                                    className="text-dark p-2 fw-medium rounded-5 shadow w-100 text-center text-wrap"
                                >
                                    <Typography.Text>
                                        {expertise}
                                    </Typography.Text>
                                </Tag>
                            </Col>
                        );
                    })}
                </Flex>
            ) : (
                <Typography.Text>
                    Chưa có thế mạnh chuyên môn nào. Vui lòng thêm mới.
                </Typography.Text>
            )}
        </>
    );
};

export default DoctorExpertiseForm;
