import { useState, useEffect } from 'react';
import { Time } from '../../../models/time';
import { DatePicker } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { DatePickerProps } from 'antd';
import { scheduleService } from '../../../services/scheduleService';
import { doctorListState } from '../../../stores/doctorAtom';
import { useRecoilState } from 'recoil';
import socket from '../../../socket';
import { Appointment } from '../../../models/appointment';
import { ScheduleDetails } from '../../../models/schedule_details';
import { ListTime } from './ListTime';
import { schedule_detailsService } from '../../../services/schedule_detailsService';
import { Doctor } from '../../../models/doctor';
import { Schedule } from '../../../models/schdule';

export const BlockSchedule = ({
    subscriberId,
    setIsModalOpen,
    doctor,
    setDoctor,
    setTime,
    setAppointmentDate,
}: any): JSX.Element => {
    const dateFormat = 'YYYY-MM-DD';
    const today = new Date();
    const stringDay = `${today.getFullYear()}-${today.getMonth() + 1}-${
        today.getDate().toString().length === 1
            ? '0' + today.getDate()
            : today.getDate()
    }`;
    const [date, setDate] = useState<string>();
    const [schedule, setSchedule] = useState<Schedule>();

    const [doctors, setDoctors] = useRecoilState(doctorListState);
    const [newAppointment, setNewAppointment] = useState<Appointment>();

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        setDate(String(dateString));
    };

    const handleOnClickBtnTime = (time: Time) => {
        setIsModalOpen(true);
        setDoctor(doctor);
        setTime(time);
        setAppointmentDate(date ?? stringDay);
    };
    const getScheduleBySubscriberIdAndDate = async (
        date: string,
        subscriberId: number
    ) => {
        try {
            const data = {
                date: date ?? stringDay,
                subscriberId: subscriberId,
            };
            const result = await scheduleService.getBySubscriberIdAndDate(data);
            setSchedule(result.data);
            const newDoctors = doctors.map((doctor: Doctor) => {
                if (doctor.id === subscriberId) {
                    return { ...doctor, schedule: result.data };
                } else return doctor;
            });
            setDoctors(newDoctors);
        } catch (err: any) {
            console.log(err.message);
            setSchedule(undefined);
        }
    };
    // // const handleSetAvailableTime = (scheduleDetailId: number) => {
    // //     const newDoctors = doctors.map((doctor: Doctor) => {
    // //         if (doctor?.schedule) {
    // //             const newScheduleDetails =
    // //                 doctor.schedule.listScheduleDetails.map(
    // //                     (scheduleDetails: ScheduleDetails) => {
    // //                         if (scheduleDetails.id === scheduleDetailId) {
    // //                             return { ...scheduleDetails, available: 0 };
    // //                         } else return scheduleDetails;
    // //                     }
    // //                 );
    // //             const newSchedule = {
    // //                 ...doctor.schedule,
    // //                 listScheduleDetails: newScheduleDetails,
    // //             };
    // //             const newDoctor = {
    // //                 ...doctor,
    // //                 schedule: { ...newSchedule },
    // //             };
    // //             return newDoctor;
    // //         } else return doctor;
    // //     });
    //     const doctor: Doctor | undefined = doctors.find(
    //         (doctor: Doctor): Doctor | any => {
    //             if (doctor?.schedule) {
    //                 doctor.schedule.listScheduleDetails.find(
    //                     (scheduleDetails: ScheduleDetails) => {
    //                         return scheduleDetails.id === scheduleDetailId;
    //                     }
    //                 );
    //             }
    //         }
    //     );
    //     console.log(doctor);
    //     setDoctors(newDoctors);
    // };
    const getDoctorById = (doctorId: number) => {
        const doctor = doctors.find((doctor: Doctor) => {
            return doctor.id === doctorId;
        });

        return doctor;
    };
    const updateAvailableScheduleDetail = async (scheduleDetailId: number) => {
        try {
            const res =
                await schedule_detailsService.updateAvailableScheduleDetail(
                    scheduleDetailId
                );

            getScheduleBySubscriberIdAndDate(
                String(date ?? stringDay),
                subscriberId
            );
        } catch (err: any) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        getScheduleBySubscriberIdAndDate(
            String(date ?? stringDay),
            subscriberId
        );
    }, [date]);

    useEffect(() => {
        socket.on('newAppointment', (newAppointment) => {
            setNewAppointment(newAppointment);
            const doctor: Doctor | undefined = getDoctorById(
                Number(newAppointment.doctor_id)
            );
            console.log(doctor);
            const scheduleDetail = doctor?.schedule?.listScheduleDetails.find(
                (scheduleDetail: ScheduleDetails) => {
                    return scheduleDetail.time_id === newAppointment.time_id;
                }
            );

            updateAvailableScheduleDetail(Number(scheduleDetail?.id));
        });

        return () => {
            socket.off('newAppointment');
        };
    }, [doctors]);
    return (
        <div className="block__schedule border border-end-0 border-start-0 border-top-0">
            <DatePicker
                className="mb-3"
                defaultValue={dayjs(stringDay, dateFormat)}
                defaultChecked={true}
                onChange={onChange}
            ></DatePicker>
            <p className="fs-6 fw-bold ms-1">
                <CalendarOutlined /> Lịch khám
            </p>
            <span className="list__time">
                {schedule ? (
                    schedule.listScheduleDetails?.map(
                        (scheduleDetail: ScheduleDetails) => {
                            return Number(scheduleDetail.time_id) !==
                                newAppointment?.time_id ? (
                                <ListTime
                                    handleOnClickBtnTime={handleOnClickBtnTime}
                                    timeId={scheduleDetail.time_id}
                                    updateAvailableScheduleDetail={
                                        updateAvailableScheduleDetail
                                    }
                                    scheduleDetailId={scheduleDetail.id}
                                />
                            ) : (
                                <></>
                            );
                        }
                    )
                ) : (
                    <p className="fs-6 ms-1 fw-bold">Không có lịch làm việc</p>
                )}
            </span>

            <p className="ms-1">Chọn và đặt (Phí đặt lịch 0đ)</p>
        </div>
    );
};
