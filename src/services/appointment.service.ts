import apiClient from '../constants/api';
import { Appointment } from '../models';
import { Dayjs } from 'dayjs';
const appointmentService = {
    async getAppointmentForDoctor(payload: {
        doctorId: number;
        status: number;
        appointmentDate: string;
        pageIndex: number;
        pageSize: number;
    }): Promise<any> {
        const res = await apiClient.get(
            `/appointment/get-appointments-for-doctor?doctorId=${payload.doctorId}&status=${payload.status}&appointmentDate=${payload.appointmentDate}&pageSize=${payload.pageSize}&pageIndex=${payload.pageIndex}`
        );
        return res?.data;
    },
    async getAppointmentsByYearAndMonth(
        fromDate: string,
        toDate: string,
        doctorId: number
    ): Promise<any> {
        const res = await apiClient.get(
            `/appointment/get-appointments-by-month-year?fromDate=${fromDate}&toDate=${toDate}&doctorId=${doctorId}`
        );
        return res?.data;
    },
    async getTotalAppointmentByStatus(
        doctorId: number,
        appointmentDate: string
    ): Promise<any> {
        const res = await apiClient.get(
            `/appointment/get-total-by-status?doctorId=${doctorId}&appointmentDate=${appointmentDate}`
        );
        return res?.data;
    },
    async getRecentAppointments(payload: {
        entityId: number;
        limit: number;
        withoutId: number;
    }) {
        const res = await apiClient.get(
            `/appointment/get-recent-appointments?entityId=${payload.entityId}&limit=${payload.limit}&withoutId=${payload.withoutId}`
        );
        return res?.data;
    },
    async useStatisticAppointmentByDay(payload: any) {
        const res = await apiClient.get(
            `/appointment/statistics-appointments-by-day?startWeek=${payload.startWeek}&endWeek=${payload.endWeek}&doctorId=${payload.doctorId}`
        );

        return res?.data;
    },
    async getWaitingPatientsCount(doctorId: number) {
        const res = await apiClient.get(
            '/appointment/get-waitting-patients-count/' + doctorId
        );
        return res?.data;
    },

    async getAppointmentsInDay(doctorId: number) {
        const res = await apiClient.get(
            '/appointment/get-appointments-in-day/' + doctorId
        );
        return res?.data;
    },
    async getAppointmentWithOptions(payload: {
        pageIndex: number;
        pageSize: number;
        status: number | null;
        userId: number;
        appointmentDate: Dayjs;
    }): Promise<any> {
        const res = await apiClient.get(
            `/appointment/get-appointment-with-options?appointmentDate=${payload.appointmentDate.format(
                'YYYY-MM-DD'
            )}&userId=${payload.userId}&pageIndex=${
                payload.pageIndex
            }&pageSize=${payload.pageSize}&status=${payload.status}`
        );
        return res?.data;
    },
    async getAppointmentByUuid(payload: any): Promise<Appointment[] | any> {
        const res = await apiClient.get(
            `/appointment/get-appointment-by-uuid?fromDate=${payload.fromDate.format(
                'YYYY-MM-DD'
            )}&toDate=${payload.toDate.format('YYYY-MM-DD')}&uuid=${
                payload.uuid
            }&pageIndex=${payload.pageIndex}&pageSize=${
                payload.pageSize
            }&statusId=${payload.statusId}`,
            payload
        );
        return res.data;
    },

    async getAppointmentById(id: number | null): Promise<any> {
        const res = await apiClient.get('/appointment/get-by-id/' + id);
        return res.data;
    },
    async getAppointmentByType(data: any): Promise<any> {
        const res = await apiClient.post(
            '/appointment/get-appointments-by-status',
            data
        );
        return res.data;
    },

    async getAppointmentInDay(doctorId: any): Promise<any> {
        const res = await apiClient.get(
            '/appointment/get-appointment-in-day/' + doctorId
        );
        return res.data;
    },
    async getTotalAppointmentsCompleted(doctorId: number): Promise<any> {
        const res = await apiClient.get(
            '/appointment/get-total-appointments-completed/' + doctorId
        );
        return res.data;
    },
    async getTotalPatientInDay(doctorId: number): Promise<any> {
        const res = await apiClient.get(
            '/appointment/get-total-patient-in-day/' + doctorId
        );
        console.log(res.data);

        return res.data;
    },

    async statisticsAppointmentsByDay(data: any, config: any): Promise<any> {
        const res = await apiClient.post(
            '/appointment/statistics-appointments-by-day',
            data,
            config
        );
        return res.data;
    },
    async getRecentPatientExamined(config: any): Promise<any> {
        const res = await apiClient.post(
            'api/appointment/get-recent-patient-examined',
            config
        );
        return res.data;
    },
    async getRecentPatientOrdered(config: any): Promise<any> {
        const res = await apiClient.post(
            'api/appointment/get-recent-patient-ordered',
            config
        );
        return res.data;
    },

    async createAppointment(data: any): Promise<any> {
        const res = await apiClient.post('/appointment/create', data);
        return res;
    },
    async viewAppointment(data: any): Promise<any> {
        const res = await apiClient.post('/appointment/view', data);
        return res.data;
    },
    async updateAppointmentStatus(data: any): Promise<any> {
        const res = await apiClient.put(
            '/appointment/update-appointment-status',
            data
        );
        return res;
    },
    async getAppointmentAtInvoice(data: any): Promise<any> {
        const res = await apiClient.post(
            '/appointment/get-appointment-at-invoice',
            data
        );
        return res?.data;
    },
    async updateIsValuation(appointmentId: number): Promise<any> {
        const res = await apiClient.put(
            '/appointment/update-valuation/' + appointmentId
        );
        return res;
    },
};
export default appointmentService;
