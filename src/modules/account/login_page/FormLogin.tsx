import { Button, Input, notification, Form } from 'antd';
import { UserService } from '../../../services/user.service';
import { useSetRecoilState } from 'recoil';
import { userState } from '../../../stores/userAtom';
import { useNavigate } from 'react-router-dom';
import socket from '../../../socket';
type NotificationType = 'success' | 'error';
export const FormLogin = () => {
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const setUser = useSetRecoilState(userState);
    const navigate = useNavigate();
    const openNotification = (
        type: NotificationType,
        title: string,
        message: string
    ) => {
        api[type]({
            message: title,
            description: message,
        });
    };
    const Login = async (values: any) => {
        const { email, password } = values;
        try {
            const res = await UserService.login({ email, password });
            sessionStorage.setItem('user', JSON.stringify(res));
            setUser(res);
            socket?.emit('joinRoom', { userId: res.userId });
            if (res.roleId === 2) {
                navigate('/admin/dashboard');
            } else {
                navigate('/admin/profile');
            }
        } catch (err: any) {
            openNotification('error', 'Thông báo', err.response.data.message);
            console.log(err.response.data.message);
        }
    };

    return (
        <div className="container">
            {contextHolder}
            <Form
                form={form}
                className="form-group mt-3"
                layout="vertical"
                onFinish={Login}
            >
                <Form.Item
                    label="Email"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập email!',
                        },
                        {
                            type: 'email',
                            message: 'Email không hợp lệ!',
                        },
                    ]}
                    name={'email'}
                >
                    <Input id="user-email" />
                </Form.Item>
                <Form.Item
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập password',
                        },
                        {
                            min: 8,
                            message: 'Mật khẩu có ít nhất 8 ký tự ',
                        },
                    ]}
                    name={'password'}
                >
                    <Input.Password id="user-password" />
                </Form.Item>
            </Form>
            <Form.Item className="text-center">
                <Button
                    className="w-25 bg-success text-white fs-6 p-3"
                    onClick={() => form.submit()}
                >
                    Login
                </Button>
            </Form.Item>
        </div>
    );
};
