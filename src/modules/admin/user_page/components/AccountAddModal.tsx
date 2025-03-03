import { Form, Modal, Input, Button } from 'antd';
import { UserService } from '../../../../services/userService';

export const UserAddModal = ({
    openAccountModal,
    handleCloseModal,
    user,
    openNotification,
    header,
    getUsers,
}: any) => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Form values:', values);
        const data = {
            userId: user?.user_id,
            password: values?.password,
        };
        CreateAccount(data);
    };
    const CreateAccount = async (data: any) => {
        try {
            const res = await UserService.createAccount(data, header);
            console.log(res);
            openNotification(
                'success',
                'Thông báo',
                'Tạo tài khoản thành công!'
            );
            handleCloseModal();
            getUsers();
        } catch (err: any) {
            openNotification(
                'error',
                'Thông báo',
                'Tạo tài khoản không thành công!'
            );
            console.log(err.message);
        }
    };
    return (
        <Modal
            open={openAccountModal}
            onCancel={handleCloseModal}
            title="Tạo tài khoản"
            className="account-modal"
            footer={[]}
            maskClosable={false}
        >
            <Form
                form={form}
                onFinish={onFinish}
                className="mt-3"
                initialValues={{ email: user?.email }}
            >
                <Form.Item
                    className="mb-4"
                    label={<span className="w-25 d-inline-block">Email</span>}
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Email không được bỏ trống!',
                        },
                        {
                            type: 'email',
                            message: 'Please enter a valid email!',
                        },
                    ]}
                >
                    <Input
                        placeholder="Enter your email"
                        name="email"
                        className="ms-2"
                    />
                </Form.Item>
                <Form.Item
                    className="mb-4"
                    label={
                        <span className="w-25 d-inline-block">Password</span>
                    }
                    name="password"
                    rules={[
                        { required: true, message: 'Password is required!' },
                        {
                            pattern:
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message:
                                'Mật khẩu phải có ít nhất 8 ký tự bao gồm chữ cái thường, hoa, ký tự đặc biệt và số!',
                        },
                    ]}
                >
                    <Input.Password
                        placeholder="Enter your password"
                        className="ms-2"
                    />
                </Form.Item>
                <Form.Item className="d-flex justify-content-end">
                    <Button type="primary" htmlType="submit">
                        Lưu
                    </Button>
                    <Button
                        type="default"
                        className="ms-3"
                        onClick={handleCloseModal}
                    >
                        Đóng
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};
