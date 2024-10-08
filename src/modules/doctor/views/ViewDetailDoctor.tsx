import {
    EnvironmentFilled,
    EnvironmentOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Image, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BlockSchedule } from '../components/BlockSchedule';
import { Doctor } from '../../../models/doctor';
import { Time } from '../../../models/time';
import { ModalOrderAppointment } from '../components/ModalOrderAppointment';
import { doctorService } from '../../../services/doctorService';
import { apiClient, baseURL } from '../../../constants/api';
import parse from 'html-react-parser';
import { BlockComment } from '../components/BlockComment';
import { ModalComment } from '../components/ModalComment';

type NotificationType = 'success' | 'error';

type DataParams = {
    id: string;
};
const ViewDetailDoctor = () => {
    const [isModalAppointmentOpen, setIsModalAppointmentOpen] = useState(false);
    const [isModalCommentOpen, setIsModalCommentOpen] = useState(false);

    const [time, setTime] = useState<Time>();
    const [appointmentDate, setAppointmentDate] = useState<string>();

    const { id } = useParams<DataParams>();
    const [doctor, setDoctor] = useState<Doctor>();
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (
        type: NotificationType,
        title: string,
        des: string
    ) => {
        api[type]({
            message: title,
            description: des,
        });
    };
    const getDoctorById = async (id: number) => {
        try {
            const res = await doctorService.getDoctorById(id);
            setDoctor(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        getDoctorById(Number(id));
    }, [id]);
    console.log(id);
    return (
        <div className="container mt-4 mb-4">
            {contextHolder}
            <Breadcrumb
                items={[
                    {
                        href: '/',
                        title: <HomeOutlined />,
                    },
                    {
                        title: 'Chi tiết bác sĩ',
                    },
                ]}
            ></Breadcrumb>
            <div className=" row mt-4 pb-4">
                <div className="doctor__info d-flex">
                    <div className="doctor__image col-1">
                        <Image
                            style={{ width: '100%' }}
                            preview={false}
                            className="rounded-circle"
                            src={baseURL + doctor?.image}
                        ></Image>
                    </div>
                    <div className="doctor__des col-11 ms-4">
                        <h3 className="doctor__name">
                            {doctor?.title} {doctor?.full_name}
                        </h3>
                        <p className="des opacity-75">
                            {parse(String(doctor?.description))}
                        </p>
                        <p className="location">
                            <EnvironmentOutlined /> Hà Nội
                        </p>
                    </div>
                </div>
                <div className="schedule left col-6  border border-start-0 border-bottom-0 border-top-0">
                    <BlockSchedule subscriberId={doctor?.id} />
                </div>
                <div className="right col-6">
                    <div className="block__clinic__info mt-3 border border-end-0 border-start-0 border-top-0">
                        <h6 className="opacity-75">Địa chỉ phòng khám</h6>
                        <h6 className="clinic__name">{doctor?.clinic_name}</h6>
                        <p className="clinic__location fs-6 opacity-75">
                            {doctor?.clinic_location}
                        </p>
                    </div>
                    <div className="fee mt-3">
                        <span className="opacity-75 fs-6 fw-bold">
                            Giá khám:
                        </span>
                        <span className="price fs-6 ms-2">
                            {doctor?.fee.toLocaleString(undefined)}đ
                        </span>
                    </div>
                </div>
            </div>
            <div className="doctor__introduction border border-start-0 border-bottom-0 border-end-0 pt-4 pb-4">
                <div>
                    <h3 className="fs-5 mb-2">
                        Phó Giáo sư, Tiến sĩ, Bác sĩ Nguyễn Thị Hoài An
                    </h3>
                    <ul>
                        <li className="mb-2 fs-6">
                            Phó Giáo sư, Tiến sĩ chuyên ngành Tai Mũi Họng
                        </li>
                        <li className="mb-2 fs-6">
                            Nguyên Trưởng khoa Tai Mũi Họng trẻ em, Bệnh viện
                            Tai Mũi Họng Trung ương
                        </li>
                        <li className="mb-2 fs-6">
                            Trên 25 năm công tác tại Bệnh viện Tai Mũi Họng
                            Trung ương
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="fs-5 mb-2">Khám và điều trị</h3>
                    <ul>
                        <li className="mb-2 fs-6">
                            Chuyên khám và điều trị các bệnh lý Tai Mũi Họng
                            người lớn
                        </li>
                        <li className="mb-2 fs-6">
                            Chuyên khám và điều trị các bệnh lý Tai Mũi Họng trẻ
                            em
                        </li>
                        <li className="mb-2 fs-6">Nội soi Tai Mũi Họng</li>
                        <li className="mb-2 fs-6">
                            Thực hiện các qui trình kỹ thuật Tai Mũi Họng
                        </li>
                    </ul>
                </div>
            </div>
            <div className="block__comment border border-start-0 border-bottom-0 border-end-0 pt-4 pb-4">
                <BlockComment setIsModalCommentOpen={setIsModalCommentOpen} />
            </div>

            {isModalAppointmentOpen && (
                <ModalOrderAppointment
                    isModalOpen={isModalAppointmentOpen}
                    doctor={doctor}
                    setIsModalOpen={setIsModalAppointmentOpen}
                    time={time}
                    date={appointmentDate}
                    openNotificationWithIcon={openNotificationWithIcon}
                />
            )}
            {isModalCommentOpen && (
                <ModalComment
                    isModalCommentOpen={isModalCommentOpen}
                    setIsModalCommentOpen={setIsModalCommentOpen}
                />
            )}
        </div>
    );
};
export default ViewDetailDoctor;
