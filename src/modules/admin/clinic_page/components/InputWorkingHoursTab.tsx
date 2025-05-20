import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    List,
    Modal,
    Form,
    TimePicker,
    message,
    Popconfirm,
    Select,
    Skeleton,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { NoticeType } from 'antd/es/message/interface';
import dayjs, { Dayjs } from 'dayjs';
import {
    useCreateWorkingHours,
    useGetWorkingHoursByClinicId,
} from '../../../../hooks';
import { WorkingHoursCreateDto } from '../../../../models';

// Định nghĩa kiểu dữ liệu cho lịch làm việc
interface Schedule {
    day: string;
    timeSlots: { start: Dayjs; end: Dayjs }[];
}

// Các ngày trong tuần
const daysOfWeek = [
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
    'Chủ Nhật',
];

interface InputWorkingHoursTabProps {
    clinicId: number | null;
    openMessage: (type: NoticeType, content: string) => void;
    isUpdateClinic: boolean;
}
const InputWorkingHoursTab = ({
    clinicId,
    openMessage,
    isUpdateClinic,
}: InputWorkingHoursTabProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(
        null
    );
    const {
        data: workingHours,
        isFetching,
        refetch,
        isRefetching,
    } = useGetWorkingHoursByClinicId(clinicId);
    const [form] = Form.useForm();

    // Mở modal để thêm hoặc chỉnh sửa lịch
    const showModal = (schedule?: Schedule) => {
        setEditingSchedule(schedule || null);
        setIsModalVisible(true);
        if (schedule) {
            form.setFieldsValue({
                day: schedule.day,
                timeSlots: schedule.timeSlots,
            });
        } else {
            form.setFieldsValue({
                day: undefined,
                timeSlots: [
                    {
                        start: dayjs('07:30', 'HH:mm'),
                        end: dayjs('11:30', 'HH:mm'),
                    },
                    {
                        start: dayjs('13:00', 'HH:mm'),
                        end: dayjs('16:30', 'HH:mm'),
                    },
                ],
            });
        }
    };

    // Đóng modal
    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingSchedule(null);
        form.resetFields();
    };
    const { mutate: createWorkingHours } = useCreateWorkingHours();
    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                if (editingSchedule) {
                } else {
                    const newSchedule: WorkingHoursCreateDto = {
                        clinicId: clinicId,
                        dayOfWeek: values.day,
                        startTime:
                            dayjs(values.timeSlots[0].start).format('HH:mm') +
                            '-' +
                            dayjs(values.timeSlots[0].end).format('HH:mm'),
                        endTime:
                            dayjs(values.timeSlots[1].start).format('HH:mm') +
                            '-' +
                            dayjs(values.timeSlots[1].end).format('HH:mm'),
                    };
                    createWorkingHours(newSchedule, {
                        onSuccess() {
                            openMessage('success', `Thêm thành công!`);
                            refetch();
                        },
                    });
                }
                handleCancel();
            })
            .catch((error) => {
                openMessage('error', 'Vui lòng kiểm tra lại thông tin!');
            });
    };

    const handleDelete = (day: string) => {
        message.success(`Xóa lịch làm việc cho ${day} thành công!`);
    };
    useEffect(() => {
        console.log('workingHours', workingHours);
    }, [workingHours]);
    return (
        <>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal()}
                style={{ marginBottom: '20px' }}
            >
                Thêm lịch làm việc
            </Button>
            <Skeleton active loading={isFetching || isRefetching}>
                <Card>
                    <List
                        dataSource={workingHours}
                        renderItem={(item: any) => (
                            <List.Item
                                actions={[
                                    <Button
                                        type="link"
                                        icon={<EditOutlined />}
                                        onClick={() => showModal(item)}
                                    >
                                        Chỉnh sửa
                                    </Button>,
                                    <Popconfirm
                                        title={`Bạn có chắc muốn xóa lịch cho ${item.day}?`}
                                        onConfirm={() => handleDelete(item.day)}
                                        okText="Xóa"
                                        cancelText="Hủy"
                                    >
                                        <Button
                                            type="link"
                                            icon={<DeleteOutlined />}
                                            danger
                                        >
                                            Xóa
                                        </Button>
                                    </Popconfirm>,
                                ]}
                            >
                                <List.Item.Meta
                                    title={item.dayOfWeek}
                                    description={
                                        item.startTime + ', ' + item.endTime
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            </Skeleton>

            <Modal
                title={
                    editingSchedule
                        ? `Chỉnh sửa lịch làm việc - ${editingSchedule.day}`
                        : 'Thêm lịch làm việc'
                }
                onOk={handleOk}
                open={isModalVisible}
                onCancel={handleCancel}
                okText={editingSchedule ? 'Lưu' : 'Thêm'}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="day"
                        label="Ngày"
                        rules={[
                            { required: true, message: 'Vui lòng chọn ngày!' },
                        ]}
                    >
                        <Select
                            placeholder="Chọn ngày"
                            disabled={!!editingSchedule} // Không cho thay đổi ngày khi chỉnh sửa
                        >
                            {daysOfWeek.map((day) => (
                                <Select.Option key={day} value={day}>
                                    {day}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.List name="timeSlots">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, index) => (
                                    <div
                                        key={field.key}
                                        style={{
                                            display: 'flex',
                                            gap: '10px',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        <Form.Item
                                            name={[field.name, 'start']}
                                            label={`Giờ bắt đầu ${index + 1}`}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        'Vui lòng chọn giờ bắt đầu',
                                                },
                                            ]}
                                        >
                                            <TimePicker
                                                format="HH:mm"
                                                minuteStep={30}
                                                style={{ width: '100%' }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name={[field.name, 'end']}
                                            label={`Giờ kết thúc ${index + 1}`}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        'Vui lòng chọn giờ kết thúc',
                                                },
                                            ]}
                                        >
                                            <TimePicker
                                                format="HH:mm"
                                                minuteStep={30}
                                                style={{ width: '100%' }}
                                            />
                                        </Form.Item>
                                        {fields.length > 1 && (
                                            <Button
                                                type="link"
                                                danger
                                                onClick={() =>
                                                    remove(field.name)
                                                }
                                                style={{ alignSelf: 'center' }}
                                            >
                                                Xóa
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    type="dashed"
                                    onClick={() =>
                                        add({
                                            start: dayjs('00:00', 'HH:mm'),
                                            end: dayjs('00:00', 'HH:mm'),
                                        })
                                    }
                                    icon={<PlusOutlined />}
                                    style={{ width: '100%' }}
                                >
                                    Thêm khung giờ
                                </Button>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </>
    );
};

export default InputWorkingHoursTab;
