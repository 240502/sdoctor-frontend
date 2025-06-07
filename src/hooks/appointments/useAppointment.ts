import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '../../services';

const useFetchTotalAppointmentByStatus = (payload: {
    doctorId: number;
    appointmentDate: string;
}) => {
    return useQuery({
        queryKey: ['useFetchTotalAppointmentByStatus', payload],
        queryFn: () =>
            appointmentService.getTotalAppointmentByStatus(
                payload.doctorId,
                payload.appointmentDate
            ),
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

const useFetchAppointmentsForDoctor = (payload: {
    doctorId: number;
    status: number;
    appointmentDate: string;
    pageIndex: number;
    pageSize: number;
}) => {
    return useQuery({
        queryKey: ['useFetchAppointmentsForDoctor', payload],
        queryFn: () => appointmentService.getAppointmentForDoctor(payload),
        select: (data) => ({
            appointments: data?.data,
            pageCount: data?.pageCount,
            pageSize: data?.pageSize,
            pageIndex: data?.pageIndex,
        }),
    });
};
export {
    useFetchTotalAppointmentByStatus,
    useFetchAppointmentsByMonthAndYear,
    useFetchAppointmentsForDoctor,
};
