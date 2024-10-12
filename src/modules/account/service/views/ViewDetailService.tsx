import {
    EnvironmentFilled,
    EnvironmentOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Image, notification } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BlockSchedule } from '../components/BlockScheudle';
import { Doctor } from '../../../../models/doctor';
import { Time } from '../../../../models/time';
import { ModalOrderAppointment } from '../components/ModalOrderAppointment';
import { baseURL } from '../../../../constants/api';
import parse from 'html-react-parser';
import { BlockComment } from '../components/BlockComment';
import { ModalComment } from '../components/ModalComment';
import { useRecoilValue } from 'recoil';
import { serviceListValue } from '../../../../stores/servicesAtom';
import { Services } from '../../../../models/services';

type NotificationType = 'success' | 'error';

type DataParams = {
    id: string;
};
const ViewDetailService = () => {
    const dateFormat = 'YYYY-MM-DD';
    const today = new Date();
    const stringDay = `${today.getFullYear()}-${today.getMonth() + 1}-${
        today.getDate().toString().length === 1
            ? '0' + today.getDate()
            : today.getDate()
    }`;
    const services = useRecoilValue(serviceListValue);
    const [isModalAppointmentOpen, setIsModalAppointmentOpen] = useState(false);
    const [isModalCommentOpen, setIsModalCommentOpen] = useState(false);
    const sectionTopRef = useRef<HTMLDivElement>(null);
    const [time, setTime] = useState<Time>();
    const [appointmentDate, setAppointmentDate] = useState<string>();

    const { id } = useParams<DataParams>();
    const [service, setService] = useState<Services>();
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
    const scrollToSection = (sectionRef: any) => {
        sectionRef?.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const getServiceById = async (id: number) => {
        try {
            const res = services.find(
                (service: Services) => service.id === Number(id)
            );
            console.log(res);
            setService(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        getServiceById(Number(id));
        scrollToSection(sectionTopRef);
    }, [id]);
    console.log(id);
    return (
        <div className="container mt-4 mb-4" ref={sectionTopRef}>
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
                            className="rounded"
                            src={baseURL + service?.image}
                        ></Image>
                    </div>
                    <div className="doctor__des col-11 ms-4">
                        <h3 className="doctor__name">{service?.name}</h3>
                        <p className="des opacity-75">
                            {parse(String(service?.description))}
                        </p>
                        <p className="location">
                            <EnvironmentOutlined /> Hà Nội
                        </p>
                    </div>
                </div>
                <div className="schedule left col-6  border border-start-0 border-bottom-0 border-top-0">
                    <BlockSchedule
                        subscriberId={service?.id}
                        setIsModalOpen={setIsModalAppointmentOpen}
                        service={service}
                        setService={setService}
                        setTime={setTime}
                        setAppointmentDate={setAppointmentDate}
                    />
                </div>
                <div className="right col-6">
                    <div className="block__clinic__info mt-3 border border-end-0 border-start-0 border-top-0">
                        <h6 className="opacity-75">Địa chỉ phòng khám</h6>
                        <h6 className="clinic__name">{service?.clinic_name}</h6>
                        <p className="clinic__location fs-6 opacity-75">
                            {service?.location}
                        </p>
                    </div>
                    <div className="fee mt-3">
                        <span className="opacity-75 fs-6 fw-bold">
                            Giá khám:
                        </span>
                        <span className="price fs-6 ms-2">
                            {service?.price.toLocaleString(undefined)}đ
                        </span>
                    </div>
                </div>
            </div>
            {/* {doctor?.introduction && (
                <div className="doctor__introduction border border-start-0 border-bottom-0 border-end-0 pt-4 pb-4">
                    {parse(String(doctor?.introduction))}
                </div>
            )} */}
            <div className="block__comment border border-start-0 border-bottom-0 border-end-0 pt-4 pb-4">
                <BlockComment
                    userId={id}
                    setIsModalCommentOpen={setIsModalCommentOpen}
                />
            </div>

            {isModalAppointmentOpen && (
                <ModalOrderAppointment
                    isModalOpen={isModalAppointmentOpen}
                    service={service}
                    setIsModalOpen={setIsModalAppointmentOpen}
                    time={time}
                    date={appointmentDate}
                    openNotificationWithIcon={openNotificationWithIcon}
                />
            )}
            {isModalCommentOpen && (
                <ModalComment
                    openNotificationWithIcon={openNotificationWithIcon}
                    serviceId={id}
                    isModalCommentOpen={isModalCommentOpen}
                    setIsModalCommentOpen={setIsModalCommentOpen}
                />
            )}
        </div>
    );
};
export default ViewDetailService;
