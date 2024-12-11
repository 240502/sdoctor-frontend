import { useEffect, useState } from 'react';
import { AppointmentService } from '../services/appointmentService';
import { useSetRecoilState } from 'recoil';
import { appointmentListInDayState } from '../stores/appointmentAtom';

export const useAppointments = (
    config: any,
    pageIndex: number,
    pageSize: number,
    doctor_id: number
) => {
    const setAppointmentListInDay = useSetRecoilState(
        appointmentListInDayState
    );
    const [totalPatientInDay, setTotalPatientInDay] = useState<number>(0);
    const [totalPatientExaminedInDay, setTotalPatientExaminedInDay] =
        useState<number>(0);
    const fetchData = async () => {
        try {
            try {
                const total = await AppointmentService.getTotalPatientInDay(
                    doctor_id,
                    config
                );
                setTotalPatientInDay(total[0].totalPatient);
            } catch (err) {
                console.error('Error fetching total patients:', err);
            }

            try {
                const examined =
                    await AppointmentService.getTotalPatientExaminedInDay(
                        doctor_id,
                        config
                    );
                setTotalPatientExaminedInDay(examined[0].totalPatient);
            } catch (err) {
                console.error('Error fetching examined patients:', err);
            }

            try {
                const appointmentData =
                    await AppointmentService.getAppointmentInDay(doctor_id);
                setAppointmentListInDay(appointmentData);
            } catch (err) {
                setAppointmentListInDay([]);
                console.error('Error fetching appointment data:', err);
            }
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchData();
    }, [config, pageIndex, pageSize]);

    return {
        totalPatientInDay,
        totalPatientExaminedInDay,
        fetchData,
    };
};
