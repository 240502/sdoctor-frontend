import { Modal, Button, TimePicker, Col, Form, Select, Row } from 'antd';
import type { TimePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { scheduleDetailsState } from '../../../../stores/scheduleDetailAtom';
import { DoctorScheduleDetail } from '../../../../models/doctorScheduleDetails';
export const AddSlotModal = ({ openModal, cancelAddSlotsModal }: any) => {
    const appointmentDurationOptions = [
        { label: '15 phút', value: 15 },
        { label: '20 phút', value: 20 },
        { label: '25 phút', value: 25 },
        { label: '30 phút', value: 30 },
        { label: '60 phút', value: 60 },
    ];
    const setScheduleDetails = useSetRecoilState(scheduleDetailsState);

    const [duration, setDuration] = useState<number>(0);
    const [form] = Form.useForm();
    const handleDurationChange = (value: number) => {
        setDuration(value);
        const startTime = form.getFieldValue('start_time');
        if (startTime) {
            const newEndTime = startTime.add(value, 'minute');
            form.setFieldValue('end_time', newEndTime);
        }
    };

    const handleStartTimeChange: TimePickerProps['onChange'] = (time) => {
        form.setFieldsValue({ start_time: time }); // Cập nhật giá trị start_time trong form
        if (time && duration) {
            const newEndTime = time.add(duration, 'minute');

            form.setFieldValue('end_time', newEndTime);
        }
    };
    const onFinish = (values: any) => {
        const durationOption = appointmentDurationOptions.find(
            (item: any) => item.value === duration
        );
        const newDetail: DoctorScheduleDetail = {
            id: 0,
            schedule_id: null,
            available: 1,
            action: null,
            start_time: dayjs(values.start_time).format('HH:mm'),
            end_time: dayjs(values.end_time).format('HH:mm'),
            appointment_duration: String(durationOption?.label),
        };
        console.log('newDetail', newDetail);
        setScheduleDetails((prevDetail: DoctorScheduleDetail[]) => [
            ...prevDetail,
            newDetail,
        ]);
        cancelAddSlotsModal();
        setDuration(0);
    };
    return (
        <Modal
            title="Thêm thời gian"
            open={openModal}
            className="w-50"
            onCancel={() => {
                cancelAddSlotsModal();
                setDuration(0);
            }}
            footer={[
                <Button
                    type="primary"
                    onClick={() => {
                        form.submit();
                    }}
                >
                    Thêm
                </Button>,
                <Button
                    onClick={() => {
                        cancelAddSlotsModal();
                    }}
                >
                    Đóng
                </Button>,
            ]}
        >
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item
                            label="Thời lượng cuộc hẹn"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn thời lượng',
                                },
                            ]}
                            name={'appointment_duration'}
                        >
                            <Select
                                placeholder="Chọn thời lượng cuộc hẹn"
                                onChange={handleDurationChange}
                            >
                                {appointmentDurationOptions.map(
                                    (value: any, index: number) => {
                                        return (
                                            <Select.Option
                                                value={value.value}
                                                key={value.value}
                                            >
                                                {value.label}
                                            </Select.Option>
                                        );
                                    }
                                )}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Thời gian"
                            name={'start_time'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn thời gian bắt đầu',
                                },
                            ]}
                        >
                            <TimePicker
                                format={'HH:mm'}
                                className="w-100"
                                onChange={handleStartTimeChange}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Thời gian"
                            name={'end_time'}
                            className="pe-none"
                        >
                            <TimePicker format={'HH:mm'} className="w-100" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
