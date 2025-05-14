import { TabsProps } from 'antd/lib';
import { OverviewForm } from './OverviewForm';
import { Tabs } from 'antd';
import DoctorEducationTimeLine from './DoctorEducationTimeline';
import DoctorExperienceTimeline from './DoctorExperienceTimeLine';
import DoctorExpertiseForm from './DoctorExpertiseForm';
import { useEffect, useState } from 'react';
import { EducationCreateDto } from '../../../../models';
import { useSearchParams } from 'react-router-dom';

const FormTabs = ({ openMessage, isUpdateDoctor }: any) => {
    const [searchParams] = useSearchParams();

    const [educations, setEducations] = useState<EducationCreateDto[]>([]);
    const [expertises, setExpertises] = useState<string[]>([]);
    const handleChangeExpertise = (expertise: string) => {
        setExpertises([...expertises, expertise]);
    };
    const [activeTab, setActiveTab] = useState<string>('1');
    const handleChangeEducationForm = (education: EducationCreateDto) => {
        const newEducations = [...educations, education];
        setEducations(newEducations);
    };

    const handleOverviewSaved = (newDoctorId: number | null) => {
        setDoctorId(newDoctorId);
        setActiveTab('2');
    };
    const [doctorId, setDoctorId] = useState<number | null>(
        searchParams.get('doctorId')
            ? Number(searchParams.get('doctorId'))
            : null
    );
    useEffect(() => {
        console.log(activeTab);
    }, [activeTab]);
    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: <h6>Tổng quan</h6>,
            children: (
                <OverviewForm
                    openMessage={openMessage}
                    handleOverviewSaved={handleOverviewSaved}
                />
            ),
        },
        {
            key: '2',
            label: <h6>Kinh nghiệm</h6>,
            children: (
                <DoctorExperienceTimeline
                    doctorId={doctorId}
                    openMessage={openMessage}
                />
            ),
        },
        {
            key: '3',
            label: <h6>Thế mạnh</h6>,
            children: (
                <DoctorExpertiseForm
                    doctorId={doctorId}
                    openMessage={openMessage}
                />
            ),
        },
        {
            key: '4',
            label: <h6>Học vấn</h6>,
            children: (
                <DoctorEducationTimeLine
                    doctorId={doctorId}
                    openMessage={openMessage}
                />
            ),
        },
    ];
    return (
        <Tabs
            activeKey={activeTab}
            onChange={(key) => {
                setActiveTab(key);
            }}
            type="card"
            tabPosition="left"
            items={tabs.map((tab, i) => {
                return {
                    label: tab.label,
                    key: tab.key,
                    children: tab.children,
                };
            })}
        />
    );
};

export default FormTabs;
