import { useState, useEffect } from 'react';
import { HomeOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Breadcrumb, Image, notification } from 'antd';
import { Link } from 'react-router-dom';
import '@/assets/scss/doctor.scss';
import { doctorService } from '../../../services/doctorService';
import { Doctor } from '../../../models/doctor';
import { baseURL } from '../../../constants/api';
import parse from 'html-react-parser';
import { ModalOrderAppointment } from '../components/ModalOrderAppointment';
import { BlockSchedule } from '../components/BlockSchedule';
import { Time } from '../../../models/time';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { doctorListState, doctorListValue } from '../../../stores/doctorAtom';
type NotificationType = 'success' | 'error';
const ViewDoctor = () => {
    const [doctor, setDoctor] = useState<Doctor>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [time, setTime] = useState<Time>();
    const [appointmentDate, setAppointmentDate] = useState<string>();
    const [api, contextHolder] = notification.useNotification();
    const doctors = useRecoilValue(doctorListValue);
    const setDoctors = useSetRecoilState(doctorListState);
    const loadData = async () => {
        if (doctors?.length === 0) {
            try {
                console.log('call api');
                const data = await doctorService.getCommonDoctor();
                setDoctors(data);
            } catch (err: any) {
                console.log(err.message);
            }
        }
    };
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

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="container home__content mt-4 mb-4">
            {contextHolder}
            <Breadcrumb
                items={[
                    {
                        href: '',
                        title: <HomeOutlined />,
                    },

                    {
                        title: `Bác sĩ nổi bật`,
                    },
                ]}
            />
            <h3 className="block__heading fs-5 fw-bold mt-4 mb-4">
                Bác sĩ nổi bật
            </h3>
            <div className="block__list__doctor">
                <div className="list__doctor m-0 p-0 ">
                    {doctors
                        ? doctors?.map((doctor: Doctor) => {
                              return (
                                  <div
                                      className="list__item mb-3 p-3 border rounded"
                                      key={Number(doctor.id)}
                                  >
                                      <div className="item_container d-flex pt-1">
                                          <div className="item__left col-6 d-flex border border-start-0 border-bottom-0 border-top-0 pe-3">
                                              <div className="col-3 text-center">
                                                  <Link to="">
                                                      <Image
                                                          preview={false}
                                                          style={{
                                                              width: '50%',
                                                          }}
                                                          className="doctor__image rounded-circle"
                                                          src={
                                                              baseURL +
                                                              doctor.image
                                                          }
                                                      ></Image>
                                                  </Link>

                                                  <Link
                                                      to=""
                                                      className="btn__more text-decoration-none mt-3"
                                                  >
                                                      Xem thêm
                                                  </Link>
                                              </div>
                                              <div className="col-9 doctor_info">
                                                  <h3 className="doctor__name fs-5">
                                                      <Link
                                                          to=""
                                                          className="text-decoration-none"
                                                      >
                                                          {doctor.title}{' '}
                                                          {doctor.full_name}
                                                      </Link>
                                                  </h3>
                                                  <div className="doctor__des">
                                                      {parse(
                                                          String(
                                                              doctor.description
                                                          )
                                                      )}
                                                      <p>
                                                          <EnvironmentOutlined className="fs-6 " />
                                                          {doctor.address}
                                                      </p>
                                                  </div>
                                              </div>
                                          </div>
                                          <div className="item__right col-6 ps-3">
                                              <BlockSchedule
                                                  subscriberId={doctor.id}
                                                  setIsModalOpen={
                                                      setIsModalOpen
                                                  }
                                                  doctor={doctor}
                                                  setDoctor={setDoctor}
                                                  setTime={setTime}
                                                  setAppointmentDate={
                                                      setAppointmentDate
                                                  }
                                              />

                                              <div className="block__clinic__info mt-3 border border-end-0 border-start-0 border-top-0">
                                                  <h6 className="opacity-75">
                                                      Địa chỉ phòng khám
                                                  </h6>
                                                  <h6 className="clinic__name">
                                                      {doctor.clinic_name}
                                                  </h6>
                                                  <p className="clinic__location fs-6">
                                                      {doctor.location}
                                                  </p>
                                              </div>
                                              <div className="fee mt-3">
                                                  <span className="opacity-75 fs-6 fw-bold">
                                                      Giá khám:
                                                  </span>
                                                  <span className="price fs-6 ms-2">
                                                      {doctor.fee.toLocaleString(
                                                          undefined
                                                      )}
                                                      đ
                                                  </span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              );
                          })
                        : ''}
                </div>
            </div>
            {isModalOpen && (
                <ModalOrderAppointment
                    isModalOpen={isModalOpen}
                    doctor={doctor}
                    setIsModalOpen={setIsModalOpen}
                    time={time}
                    date={appointmentDate}
                    openNotificationWithIcon={openNotificationWithIcon}
                />
            )}
        </div>
    );
};
export default ViewDoctor;
