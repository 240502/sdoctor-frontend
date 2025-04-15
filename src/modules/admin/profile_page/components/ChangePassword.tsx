import { Modal, Input, Button, Form, Flex } from 'antd';
import { useRecoilValue } from 'recoil';
import { configValue, userValue } from '../../../../stores/userAtom';
import { userService } from '../../../../services';
import { openNotification } from '../../../../utils/notification';
export const ChangePasswordModal = ({
    apiNotification,
    openChangePasswordModal,
    cancelChangePasswordModal,
}: any) => {
    const [form] = Form.useForm();
    const config = useRecoilValue(configValue);
    const user = useRecoilValue(userValue);
    const onFinish = (values: any) => {
        console.log(values);
        const data = {
            currentPassword: values.old_password,
            newPassword: values.new_password,
            id: user.userId,
        };
        ChangePassword(data);
    };
    const ChangePassword = async (data: any) => {
        try {
            const res = await userService.changePassword(data, config);
            console.log(res);
            openNotification(
                apiNotification,
                'success',
                'Thông báo',
                'Đổi mật khẩu thành công!'
            );
            cancelChangePasswordModal();
        } catch (err: any) {
            console.log(err.message);
            openNotification(
                apiNotification,
                'success',
                'Thông báo',
                'Đổi mật khẩu không thành công!'
            );
        }
    };
    const validateConfirmPassword = (_: any, value: string) => {
        const newPassword = form.getFieldValue('new_password');
        if (value && value !== newPassword) {
            return Promise.reject(new Error('Mật khẩu không trùng khớp'));
        }
        return Promise.resolve();
    };
    return (
        <Modal
            open={openChangePasswordModal}
            onCancel={cancelChangePasswordModal}
            title="Đổi mật khẩu"
            footer={[]}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item
                    name={'old_password'}
                    label="Mật khẩu cũ"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu hiện tại',
                        },
                    ]}
                >
                    <Input.Password placeholder="Nhập mật khẩu hiện tại"></Input.Password>
                </Form.Item>
                <Form.Item
                    name={'new_password'}
                    label="Mật khẩu mới"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu mới',
                        },
                        {
                            pattern:
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\W]{8,}$/,
                            message:
                                'Mật khẩu phải ít nhất 8 ký tự có ít nhất 1 ký tự số, ký tự hoa, ký tự đặc biệt',
                        },
                    ]}
                >
                    <Input.Password placeholder="Nhập mật khẩu mới"></Input.Password>
                </Form.Item>
                <Form.Item
                    name={'confirm_password'}
                    label="Nhập lại mật khẩu mới"
                    rules={[{ validator: validateConfirmPassword }]}
                >
                    <Input.Password placeholder="Nhập lại mật khẩu mới"></Input.Password>
                </Form.Item>
                <Form.Item>
                    <Flex className="justify-content-end" gap={'middle'}>
                        <Button type="primary" htmlType="submit">
                            Lưu
                        </Button>
                        <Button onClick={cancelChangePasswordModal}>
                            Đóng
                        </Button>
                    </Flex>
                </Form.Item>
            </Form>
        </Modal>
    );
};
