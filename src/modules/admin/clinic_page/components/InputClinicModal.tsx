import { Button, Modal, Tabs } from 'antd';

import InputOverviewTab from './InputOverviewTab';
import InputWorkingHoursTab from './InputWorkingHoursTab';
import InputMedicalEquipmentTab from './InputMedicalEquipmentTab';
import { NoticeType } from 'antd/es/message/interface';
import { TabsProps } from 'antd/lib';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import InputDepartmentTab from './InputDepartmentTab';

interface InputClinicModalProps {
    openModal: boolean;
    onCloseModal: () => void;
    isUpdateClinic: boolean;
    openMessage: (type: NoticeType, content: string) => void;
    refetch: () => void;
}
export const InputClinicModal = ({
    openModal,
    onCloseModal,
    isUpdateClinic,
    openMessage,
    refetch,
}: InputClinicModalProps) => {
    const [searchParams] = useSearchParams();

    const [clinicId, setClinicId] = useState<number | null>(
        Number(searchParams.get('clinicId')) ?? null
    );
    const [activeTab, setActiveTab] = useState<string>('1');
    const handleOverviewSaved = (newClinicId: number | null) => {
        setClinicId(newClinicId);
        setActiveTab('2');
    };
    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: <h6>Tổng quan</h6>,
            children: (
                <InputOverviewTab
                    clinicId={clinicId}
                    openMessage={openMessage}
                    isUpdateClinic={isUpdateClinic}
                    refetch={refetch}
                    handleOverviewSaved={handleOverviewSaved}
                />
            ),
        },
        {
            key: '2',
            label: <h6>Chuyên khoa</h6>,
            children: (
                <InputDepartmentTab
                    clinicId={clinicId}
                    openMessage={openMessage}
                />
            ),
        },
        {
            key: '3',
            label: <h6>Thời gian làm việc</h6>,
            children: (
                <InputWorkingHoursTab
                    clinicId={clinicId}
                    openMessage={openMessage}
                    isUpdateClinic={isUpdateClinic}
                />
            ),
        },
        {
            key: '4',
            label: <h6>Trang thiết bị</h6>,
            children: <InputMedicalEquipmentTab />,
        },
    ];

    return (
        <Modal
            title={'Thêm cơ sở y tế'}
            className="w-75"
            open={openModal}
            onCancel={onCloseModal}
            footer={[<Button onClick={onCloseModal}>Đóng</Button>]}
        >
            <Tabs
                type="card"
                onChange={(key: string) => setActiveTab(key)}
                activeKey={activeTab}
                tabPosition="left"
                items={tabs.map((tab, i) => {
                    return {
                        label: tab.label,
                        key: tab.key,
                        children: tab.children,
                    };
                })}
            />
        </Modal>
    );
};
