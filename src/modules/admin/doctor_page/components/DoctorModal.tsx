import { Button, Modal, Tabs } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/vi';
import useCreateDoctor from '../../../../hooks/doctors/useCreateDoctor';
import { TabsProps } from 'antd/lib';
import { OverviewForm } from './OverviewForm';
import DoctorExperienceTimeline from './DoctorExperienceTimeLine';
import DoctorExpertiseForm from './DoctorExpertiseForm';
import DoctorEducationTimeLine from './DoctorEducationTimeline';
import { DoctorCreateDto, EducationCreateDto } from '../../../../models';
import {
    useCreateDoctorExperience,
    useCreateDoctorExpertise,
    useCreateEducation,
} from '../../../../hooks';
import FormTabs from './FormTabs';
dayjs.locale('vi');
dayjs.extend(customParseFormat);

export const DoctorModal = ({
    showDoctorModal,
    handleCloseDoctorModal,
    openMessage,
    isUpdate,
}: any) => {
    return (
        <Modal
            className="w-75 input-doctor-modal"
            title={'Thêm bác sĩ'}
            open={showDoctorModal}
            maskClosable={false}
            onCancel={handleCloseDoctorModal}
            footer={[<Button onClick={handleCloseDoctorModal}>Đóng</Button>]}
        >
            <FormTabs openMessage={openMessage} isUpdateDoctor={isUpdate} />
        </Modal>
    );
};
