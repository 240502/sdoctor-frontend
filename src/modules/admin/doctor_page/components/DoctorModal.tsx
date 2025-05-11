import {
    Button,
    Select,
    Flex,
    Modal,
    Input,
    InputRef,
    Image,
    Upload,
    DatePicker,
    Form,
    Row,
    Col,
    ConfigProvider,
    Tabs,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import DescriptionEditor from './DescriptionEditor';
import { useEffect, useRef, useState } from 'react';
import { Clinic } from '../../../../models/clinic';
import { Major } from '../../../../models/major';
const { Option } = Select;
import { PlusOutlined } from '@ant-design/icons';
import type { DatePickerProps, GetProp, UploadFile, UploadProps } from 'antd';
import { doctorService, uploadService } from '../../../../services';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import SummaryEditor from './SummaryEditor';
import { DoctorService } from '../../../../models/doctor_service';
import viVN from 'antd/lib/locale/vi_VN';
import 'dayjs/locale/vi';
import { ProvinceType, DistrictType, WardType } from '../../../../models/other';
import axios from 'axios';
import useCreateDoctor from '../../../../hooks/doctors/useCreateDoctor';
import { TabsProps } from 'antd/lib';
import { OverviewForm } from './OverviewForm';
import DoctorExperienceTimeline from './DoctorExperienceTimeLine';
import DoctorExpertiseForm from './DoctorExpertiseForm';
import DoctorEducationTimeLine from './DoctorEducationTimeline';
dayjs.locale('vi');
dayjs.extend(customParseFormat);

export const DoctorModal = ({
    showDoctorModal,
    handleCloseDoctorModal,
    doctor,
    setDoctor,
    openNotificationWithIcon,
    getDoctor,
    isUpdate,
    clinics,
    majors,
    config,
    doctorServices,
}: any) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm();
    const [birthDayError, setBirthDayError] = useState<any>('');

    const createDoctor = useCreateDoctor(config);
    // test
    const handleCreateNewDoctor = () => {
        const data = {
            password: 'abc',
            role_id: 1,
            email: 'sanghip200@gmail.com',
            gender: 1,
            phone: '0777435783',
            image: '',
            full_name: 'Nguyễn Văn Sang',
            birthday: '2002-05-24',
            city: 'Tỉnh Hưng Yên',
            district: 'Huyện Khoái Châu',
            commune: 'Xã An Vĩ',
        };
        createDoctor.mutate(data);
    };
    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: <h6>Tổng quan</h6>,
            children: (
                <OverviewForm
                    doctor={doctor}
                    clinics={clinics}
                    majors={majors}
                    doctorServices={doctorServices}
                    setDoctor={setDoctor}
                />
            ),
        },
        {
            key: '2',
            label: <h6>Kinh nghiệm</h6>,
            children: <DoctorExperienceTimeline />,
        },
        {
            key: '3',
            label: <h6>Thế mạnh</h6>,
            children: <DoctorExpertiseForm />,
        },
        {
            key: '4',
            label: <h6>Học vấn</h6>,
            children: <DoctorEducationTimeLine />,
        },
    ];

    const onFinish = (values: any) => {
        console.log('values', values);
        const today = dayjs();
        const age = today.diff(values.birthday, 'year'); // Tính tuổi bằng year
        console.log(age);
        if (age < 22) {
            setBirthDayError('Bác sĩ phải đủ 24 tuổi trở lên!');
        }

        if (isUpdate) {
            const newDoctor = {
                doctor_id: doctor.doctor_id,
                full_name: values.full_name,
                clinic_id: values.clinic_id,
                major_id: values.major_id,
                summary: doctor.summary,
                image: fileList[0].url ?? '',
                email: values.email,
                phone: values.phone,
                address: values.address,
                gender: values.gender,
                title: values.title,
                service_id: values.service_id,
                introduction: doctor.introduction,
                city: values.city,
                district: values.district,
                commune: values.commune,
                birthday: dayjs(values.birthday)
                    .format()
                    .toString()
                    .slice(0, 10),
            };
            UpdateDoctor(newDoctor);
        } else {
            const newDoctor = {
                full_name: values.full_name,
                clinic_id: values.clinic_id,
                major_id: values.major_id,
                summary: doctor.summary,
                image: fileList[0].url ?? '',
                email: values.email,
                phone: values.phone,
                address: values.address,
                gender: values.gender,
                title: values.title,
                service_id: values.service_id,
                introduction: doctor.introduction,
                city: values.city,
                district: values.district,
                commune: values.commune,
                birthday: dayjs(values.birthday)
                    .format()
                    .toString()
                    .slice(0, 10),
            };
            CreateDoctor(newDoctor);
        }
    };

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
                    onClick={() => form.submit()}
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
