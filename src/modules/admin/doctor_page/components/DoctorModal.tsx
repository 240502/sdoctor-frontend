import { Button, Modal, Form, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { doctorService } from '../../../../services';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/vi';
import useCreateDoctor from '../../../../hooks/doctors/useCreateDoctor';
import { TabsProps } from 'antd/lib';
import { OverviewForm } from './OverviewForm';
import DoctorExperienceTimeline from './DoctorExperienceTimeLine';
import DoctorExpertiseForm from './DoctorExpertiseForm';
import DoctorEducationTimeLine from './DoctorEducationTimeline';
import { EducationCreateDto } from '../../../../models';
import {
    useCreateDoctorExperience,
    useCreateDoctorExpertise,
    useCreateEducation,
} from '../../../../hooks';
dayjs.locale('vi');
dayjs.extend(customParseFormat);

export const DoctorModal = ({
    showDoctorModal,
    handleCloseDoctorModal,
    doctor,
    setDoctor,

    openMessage,
    getDoctor,
    isUpdate,
    config,
    doctorServices,
}: any) => {
    const createDoctor = useCreateDoctor(config);
    const [educations, setEducations] = useState<EducationCreateDto[]>([]);
    const [expertises, setExpertises] = useState<string[]>([]);
    const [experiences, setExperiences] = useState<any>([]);
    const { mutate: createEducation } = useCreateEducation();
    const { mutate: createDoctorExperience } = useCreateDoctorExperience();
    const { mutate: createDoctorExpertise } = useCreateDoctorExpertise();
    useEffect(() => {
        console.log(doctor);
    }, [doctor]);
    const handleChangeDoctor = (newDoctor: any) => {
        setDoctor({ ...newDoctor });
    };
    const handleChangeExperiences = (experience: any) => {
        setExperiences([...experiences, experience]);
    };
    const handleChangeExpertise = (expertise: string) => {
        setExpertises([...expertises, expertise]);
    };
    const handleChangeEducationForm = (education: EducationCreateDto) => {
        const newEducations = [...educations, education];
        setEducations(newEducations);
    };

    const handleCreateNewDoctor = () => {
        const today = dayjs();
        // const age = today.diff(values.birthday, 'year'); // Tính tuổi bằng year
        // console.log(age);
        // if (age < 22) {
        // }

        if (isUpdate) {
            const newDoctor = {
                doctorId: doctor.doctorId,
                fullName: doctor.fullName,
                clinicId: doctor.clinic_id,
                majorId: doctor.major_id,
                summary: doctor.summary,
                image: doctor.image,
                email: doctor.email,
                phone: doctor.phone,
                address: doctor.address,
                gender: doctor.gender,
                title: doctor.title,
                serviceId: doctor.serviceId,
                introduction: doctor.introduction,
                city: doctor.city,
                district: doctor.district,
                commune: doctor.commune,
                birthday: dayjs(doctor.birthday).format('YYYY-MM-DD'),
            };
            UpdateDoctor(newDoctor);
        } else {
            const newDoctor = {
                fullName: doctor.fullName,
                clinicId: doctor.clinicId,
                summary: doctor.summary,
                image: doctor.image,
                email: doctor.email,
                phone: doctor.phone,
                // address: doctor.address,
                gender: doctor.gender,
                title: doctor.title,
                serviceId: doctor.serviceId,
                introduction: doctor.introduction,
                city: doctor.city,
                district: doctor.district,
                commune: doctor.commune,
                birthday: dayjs(doctor.birthday).format('YYYY-MM-DD'),
                department: doctor.department,
            };
            console.log('education', educations);
            console.log('expertise', expertises);
            console.log('experience', experiences);
            console.log('new doctor', newDoctor);

            createDoctor.mutate(newDoctor, {
                onSuccess(data) {
                    openMessage('success', 'Thêm bác sĩ thành công!');
                    const doctorExpertises = {
                        doctorId: data?.result,
                        expertises,
                    };
                    createDoctorExpertise(doctorExpertises);
                },
                onError(error) {
                    openMessage('error', 'Thêm bác sĩ không thành công!');
                },
            });
            // CreateDoctor(newDoctor);
        }
    };
    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: <h6>Tổng quan</h6>,
            children: (
                <OverviewForm
                    doctor={doctor}
                    doctorServices={doctorServices}
                    setDoctor={setDoctor}
                    handleChangeDoctor={handleChangeDoctor}
                />
            ),
        },
        {
            key: '2',
            label: <h6>Kinh nghiệm</h6>,
            children: (
                <DoctorExperienceTimeline
                    experiences={experiences}
                    handleChangeExperience={handleChangeExperiences}
                />
            ),
        },
        {
            key: '3',
            label: <h6>Thế mạnh</h6>,
            children: (
                <DoctorExpertiseForm
                    expertises={expertises}
                    handleChangeExpertise={handleChangeExpertise}
                />
            ),
        },
        {
            key: '4',
            label: <h6>Học vấn</h6>,
            children: (
                <DoctorEducationTimeLine
                    educations={educations}
                    handleChangeEducations={handleChangeEducationForm}
                />
            ),
        },
    ];

    const CreateDoctor = async (newDoctor: any) => {
        try {
            const res = await doctorService.createDoctor(newDoctor, config);
            console.log(res);
            openNotificationWithIcon(
                'success',
                'Thông báo!',
                'Thêm bác sĩ thành công!'
            );
            getDoctor();
            handleCloseDoctorModal();
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'error',
                'Thông báo!',
                'Thêm bác sĩ không thành công!'
            );
        }
    };

    const UpdateDoctor = async (newDoctor: any) => {
        try {
            const res = await doctorService.updateDoctor(newDoctor, config);
            console.log(res);
            openNotificationWithIcon(
                'success',
                'Thông báo!',
                'Sửa thông tin bác sĩ thành công!'
            );
            getDoctor();
            handleCloseDoctorModal();
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'error',
                'Thông báo!',
                'Sửa thông tin không thành công!'
            );
        }
    };

    return (
        <Modal
            className="w-75 input-doctor-modal"
            title={'Thêm bác sĩ'}
            open={showDoctorModal}
            maskClosable={false}
            onCancel={handleCloseDoctorModal}
            footer={[
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => handleCreateNewDoctor()}
                >
                    {isUpdate ? 'Lưu' : 'Thêm mới'}
                </Button>,
                <Button onClick={handleCloseDoctorModal}>Đóng</Button>,
            ]}
        >
            <Tabs
                // onChange={onChange}
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
        </Modal>
    );
};
