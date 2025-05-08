import { Button, Form, Input, List, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { PatientProfile } from '../../../../models';
import { useFetchProfiles } from '../../../../hooks';

interface ProfileSelectionModalProps {
    visible: boolean;
    onClose: () => void;
}
const ProfileSelectionModal = ({
    visible,
    onClose,
}: ProfileSelectionModalProps) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [editingProfile, setEditingProfile] = useState<PatientProfile | null>(
        null
    );
    const {
        data: profiles,
        isError,
        error,
        isFetching,
    } = useFetchProfiles(JSON.parse(localStorage.getItem('uuids') || `[]`));
    console.log(JSON.parse(localStorage.getItem('uuids') || `[]`));

    useEffect(() => {
        console.log('profiles', profiles);
    }, [profiles]);
    // // Lấy danh sách hồ sơ
    // const { data: profiles, refetch } = useQuery({
    //     queryKey: ['profiles'],
    //     queryFn: profileService.getProfiles,
    // });

    // // Mutation để thêm hồ sơ mới
    // const createMutation = useMutation({
    //     mutationFn: profileService.createProfile,
    //     onSuccess: (newProfile) => {
    //         saveProfile(newProfile); // Lưu vào localStorage
    //         refetch(); // Làm mới danh sách
    //         form.resetFields();
    //         setIsEditing(false);
    //     },
    // });

    // // Mutation để chỉnh sửa hồ sơ
    // const updateMutation = useMutation({
    //     mutationFn: ({
    //         uuid,
    //         data,
    //     }: {
    //         uuid: string;
    //         data: Partial<Profile>;
    //     }) => profileService.updateProfile(uuid, data),
    //     onSuccess: (updatedProfile) => {
    //         saveProfile(updatedProfile); // Cập nhật localStorage
    //         refetch();
    //         form.resetFields();
    //         setIsEditing(false);
    //         setEditingProfile(null);
    //     },
    // });

    // Xử lý chọn hồ sơ
    // const handleSelectProfile = (profile: PatientProfile) => {
    //     onSelectProfile(profile.uuid);
    //     onClose();
    // };

    // Xử lý mở form chỉnh sửa
    const handleEditProfile = (profile: PatientProfile) => {
        setIsEditing(true);
        setEditingProfile(profile);
        form.setFieldsValue(profile);
    };

    // // Xử lý gửi form (thêm hoặc chỉnh sửa)
    // const handleSubmit = (values: Profile) => {
    //     if (editingProfile) {
    //         updateMutation.mutate({ uuid: editingProfile.uuid, data: values });
    //     } else {
    //         createMutation.mutate(values);
    //     }
    // };

    return (
        <Modal
            title="Chọn hoặc thêm hồ sơ bệnh nhân"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <List
                dataSource={profiles}
                renderItem={(profile: PatientProfile) => (
                    <List.Item
                        actions={[
                            <Button onClick={() => handleEditProfile(profile)}>
                                Chỉnh sửa
                            </Button>,
                            <Button
                            // onClick={() => handleSelectProfile(profile)}
                            >
                                Chọn
                            </Button>,
                        ]}
                    >
                        {profile.patientName} ({profile.patientEmail})
                    </List.Item>
                )}
            />
            <Form
                form={form}
                // onFinish={handleSubmit}
                layout="vertical"
                style={{ marginTop: 20 }}
            >
                <Form.Item
                    name="name"
                    label="Tên"
                    rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    // loading={
                    //     createMutation.isPending || updateMutation.isPending
                    // }
                >
                    {editingProfile ? 'Cập nhật hồ sơ' : 'Thêm hồ sơ mới'}
                </Button>
                {isEditing && (
                    <Button
                        onClick={() => {
                            setIsEditing(false);
                            setEditingProfile(null);
                            form.resetFields();
                        }}
                        style={{ marginLeft: 10 }}
                    >
                        Hủy
                    </Button>
                )}
            </Form>
        </Modal>
    );
};

export default ProfileSelectionModal;
