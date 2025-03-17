import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Flex, InputRef, Form } from 'antd';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const BlockSearchDoctor = () => {
    const inputSearchRef = useRef<InputRef>(null);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const onFinish = (values: any) => {
        const queryParams = new URLSearchParams();
        queryParams.append('name', values.search_content);
        navigate('/list/doctor?' + queryParams.toString());
    };
    return (
        <div className="search-group">
            <h6 className="text-center fs-5">Tìm kiếm bác sĩ</h6>
            <p className="text-center opacity-50">
                Tìm kiếm bác sĩ của bạn và đặt lịch khám trong 1 lần bấm
            </p>
            <Flex className="group-button w-50 m-auto">
                <Form form={form} onFinish={onFinish} className="w-100 d-flex">
                    <Form.Item
                        className="w-100"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập thông tin tìm kiếm',
                            },
                        ]}
                        name={'search_content'}
                    >
                        <Input
                            ref={inputSearchRef}
                            placeholder="Tìm kiếm ..."
                        ></Input>
                    </Form.Item>

                    <Button className="ms-2" type="primary" htmlType="submit">
                        <SearchOutlined /> Tìm kiếm
                    </Button>
                </Form>
            </Flex>
        </div>
    );
};
export default BlockSearchDoctor;
