import {
    Button,
    Col,
    Divider,
    Form,
    GetProp,
    message,
    Row,
    TabsProps,
    UploadProps,
} from 'antd';
import { NoticeType } from 'antd/es/message/interface';
import React, { useState } from 'react';

import { useParams } from 'react-router-dom';
import OverViewTab from '../components/OverViewTab';
import ExperiencesTab from '../components/ExperiencesTab';
import EducationTab from '../components/EducationTab';
import InputServiceTab from '../components/InputServiceTab';
import DoctorExpertiseForm from '../components/DoctorExpertiseForm';

const tabs: TabsProps['items'] = [
    {
        key: '1',
        label: <h6 className="m-0">Tổng quan</h6>,
    },
    {
        key: '2',
        label: <h6 className="m-0">Kinh nghiệm</h6>,
    },
    {
        key: '3',
        label: <h6 className="m-0">Học vấn</h6>,
    },
    {
        key: '4',
        label: <h6 className="m-0">Dịch vụ</h6>,
    },
    {
        key: '5',
        label: <h6 className="m-0">Thế mạnh</h6>,
    },
];
const ProfileDoctorPage = () => {
    const { id } = useParams<string>();
    const [activeKey, setActiveKey] = useState<string>('1');
    const [messageApi, contextHolder] = message.useMessage();
    const openMessage = (type: NoticeType, des: string) => {
        messageApi.open({
            type: type,
            content: des,
        });
    };

    return (
        <div>
            {contextHolder}
            <Row gutter={24}>
                {tabs.map((tab) => {
                    return (
                        <Button
                            type={
                                Number(activeKey) === Number(tab.key)
                                    ? 'primary'
                                    : 'default'
                            }
                            className="me-3"
                            style={{
                                width: '100px',
                            }}
                            onClick={() => {
                                if (Number(activeKey) !== Number(tab.key)) {
                                    setActiveKey(tab.key);
                                }
                            }}
                            key={tab.key}
                        >
                            {tab.label}
                        </Button>
                    );
                })}
            </Row>
            <Divider className="mb-2 mt-2" />
            {Number(activeKey) === 1 && (
                <OverViewTab doctorId={Number(id)} openMessage={openMessage} />
            )}

            {Number(activeKey) === 2 && (
                <ExperiencesTab
                    doctorId={Number(id)}
                    openMessage={openMessage}
                />
            )}

            {Number(activeKey) === 3 && (
                <EducationTab doctorId={Number(id)} openMessage={openMessage} />
            )}
            {Number(activeKey) === 4 && (
                <InputServiceTab
                    doctorId={Number(id)}
                    openMessage={openMessage}
                />
            )}
            {Number(activeKey) === 5 && (
                <DoctorExpertiseForm
                    doctorId={Number(id)}
                    openMessage={openMessage}
                />
            )}
        </div>
    );
};

export default ProfileDoctorPage;
