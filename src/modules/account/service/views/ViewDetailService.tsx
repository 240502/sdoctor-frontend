import { EnvironmentOutlined, HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Image, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BlockSchedule } from '../components/BlockScheudle';
import { Time } from '../../../../models/time';
import { ModalOrderAppointment } from '../components/ModalOrderAppointment';
import { baseURL } from '../../../../constants/api';
import parse from 'html-react-parser';
import { BlockComment } from '../components/BlockComment';
import { ModalComment } from '../components/ModalComment';
import { useRecoilValue } from 'recoil';
import { serviceListValue } from '../../../../stores/servicesAtom';

type NotificationType = 'success' | 'error';

type DataParams = {
    id: string;
};
const ViewDetailService = () => {
    // const dateFormat = 'YYYY-MM-DD';
    // const today = new Date();
    // const stringDay = `${today.getFullYear()}-${today.getMonth() + 1}-${
    //     today.getDate().toString().length === 1
    //         ? '0' + today.getDate()
    //         : today.getDate()
    // }`;
    // const services = useRecoilValue(serviceListValue);
    // const [isModalAppointmentOpen, setIsModalAppointmentOpen] = useState(false);
    // const [isModalCommentOpen, setIsModalCommentOpen] = useState(false);
    // const [time, setTime] = useState<Time>();
    // const [appointmentDate, setAppointmentDate] = useState<string>();

    // const { id } = useParams<DataParams>();
    // const [api, contextHolder] = notification.useNotification();

    // const openNotificationWithIcon = (
    //     type: NotificationType,
    //     title: string,
    //     des: string
    // ) => {
    //     api[type]({
    //         message: title,
    //         description: des,
    //     });
    // };

    // const getServiceById = async (id: number) => {
    //     try {
    //         const service = services.find(
    //             (service: Services) => service.id === Number(id)
    //         );
    //         if (service) {
    //             setService(service);
    //         } else {
    //             const res = await ServicesService.getServiceById(id);
    //             setService(res);
    //         }
    //     } catch (err: any) {
    //         console.log(err.message);
    //     }
    // };

    // useEffect(() => {
    //     getServiceById(Number(id));
    //     window.scrollTo(0, 0);
    // }, [id]);
    // console.log(id);
    return <></>;
};
export default ViewDetailService;
