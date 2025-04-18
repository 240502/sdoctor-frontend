import { AxiosResponse } from 'axios';
import { apiClient } from '../constants/api';
import { Appointment } from '../models';

const appointmentService = {
    async getAppointmentByUuid(payload: any): Promise<Appointment[] | any> {
        const res = await apiClient.get(
            `/appointment/get-appointment-by-uuid?uuid=${payload.uuid}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}&statusId=${payload.statusId}`,
            payload
        );
        return res.data;
    },

    async getAppointmentById(id: number): Promise<any> {
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
    async getTotalPatientExaminedInDay(doctorId: number): Promise<any> {
        const res = await apiClient.get(
            '/appointment/get-total-examined-patient-in-day/' + doctorId
        );
        return res.data;
    },
    async getTotalPatientInDay(doctorId: number): Promise<any> {
        const res = await apiClient.get(
            '/appointment/get-total-patient-in-day/' + doctorId
        );
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
