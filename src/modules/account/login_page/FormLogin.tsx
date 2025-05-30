import { Button, Input, notification, Form } from 'antd';
import { useLogin } from '../../../hooks';
import { useSetRecoilState } from 'recoil';
import { isAuthenticatedState } from '../../../stores/userAtom';
import { useNavigate } from 'react-router-dom';
import { joinRoom } from '../../../socket';

type NotificationType = 'success' | 'error';

export const FormLogin = () => {
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const { mutate: login, isPending, error } = useLogin();
    const setIsAuthenticated = useSetRecoilState(isAuthenticatedState);
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

    const handleLogin = async (values: any) => {
        const { email, password } = values;
        login(
            { email, password },
            {
                onSuccess: (data) => {
                    setIsAuthenticated(true);
                    const user = {
                        userId: data?.user.userId,
                        roleId: data?.user.roleId,
                    };

                    joinRoom(data?.user.userId, `doctor_${data?.user.userId}`);

                    if (user.roleId === 2) {
                        navigate('/admin/dashboard');
                    } else {
                        navigate(`/admin/profile?user=${user.userId}}`);
                    }
                    openNotification(
                        'success',
                        'Thông báo',
                        'Đăng nhập thành công!'
                    );
                },
                onError: (err: any) => {
                    openNotification(
                        'error',
                        'Thông báo',
                        err.message || 'Đăng nhập thất bại!'
                    );
                },
            }
        );
    };

    return (
        <div className="container">
            {contextHolder}
            <Form
                form={form}
                className="form-group mt-3"
                layout="vertical"
                onFinish={handleLogin}
            >
                <Form.Item
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' },
                    ]}
                    name={'email'}
                >
                    <Input id="user-email" />
                </Form.Item>
                <Form.Item
                    label="Password"
                    rules={[
                        { required: true, message: 'Vui lòng nhập password!' },
                        { min: 8, message: 'Mật khẩu có ít nhất 8 ký tự!' },
                    ]}
                    name={'password'}
                >
                    <Input.Password id="user-password" />
                </Form.Item>
                <Form.Item className="text-center">
                    <Button
                        className="w-25 bg-success text-white fs-6 p-3"
                        onClick={() => form.submit()}
                        disabled={isPending}
                    >
                        {isPending ? 'Đang đăng nhập...' : 'Login'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
