import { useEffect, useState } from 'react';
import { appointmentService } from '../services';
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
                const res = await appointmentService.getTotalPatientInDay(
                    doctor_id
                );
                console.log(res.totalPatient);
                setTotalPatientInDay(res.totalPatient);
            } catch (err) {
                console.error('Error fetching total patients:', err);
            }

            try {
                const res =
                    await appointmentService.getTotalPatientExaminedInDay(
                        doctor_id
                    );
                setTotalPatientExaminedInDay(res.totalPatient);
            } catch (err) {
                console.error('Error fetching examined patients:', err);
            }

            try {
                const appointmentData =
                    await appointmentService.getAppointmentInDay(doctor_id);
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
