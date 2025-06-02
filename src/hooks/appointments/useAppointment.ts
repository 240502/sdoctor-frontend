import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '../../services';

const useFetchTotalAppointmentByStatus = (doctorId: number) => {
    return useQuery({
        queryKey: ['useFetchTotalAppointmentByStatus', doctorId],
        queryFn: () => appointmentService.getTotalAppointmentByStatus(doctorId),
        retry: false,
    });
};

const useFetchAppointmentsByMonthAndYear = (payload: {
    fromDate: string;
    toDate: string;
    doctorId: number;
}) => {
    return useQuery({
        queryKey: ['useFetchAppointmentsByMonthAndYear', payload],
        queryFn: () =>
            appointmentService.getAppointmentsByYearAndMonth(
                payload.fromDate,
                payload.toDate,
                payload.doctorId
            ),
        retry: false,
    });
};
export { useFetchTotalAppointmentByStatus, useFetchAppointmentsByMonthAndYear };
