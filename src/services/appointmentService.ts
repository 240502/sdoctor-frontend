import axios from 'axios';
import { apiClient, baseURL } from '../constants/api';

export const AppointmentService = {
    async getAppointmentByType(data: any): Promise<any> {
        const res = await apiClient.post('api/appointment/get-by-type', data);
        return res.data;
    },

    async getAppointmentInDay(data: any, config: any): Promise<any> {
        const res = await apiClient.post(
            'api/appointment/get-appointment-in-day',
            data,
            config
        );
        return res.data;
    },
    async getTotalPatientExaminedInDay(
        doctorId: number,
        config: any
    ): Promise<any> {
        const res = await apiClient.get(
            'api/appointment/get-total-patient-examined-in-day/' + doctorId,
            config
        );
        return res.data;
    },
    async getTotalPatientInDay(doctorId: number, config: any): Promise<any> {
        const res = await apiClient.get(
            'api/appointment/get-total-patient-in-day/' + doctorId,
            config
        );
        return res.data;
    },
    async getTotalPriceAppointmentByWeek(data: any, config: any): Promise<any> {
        const res = await apiClient.post(
            'api/appointment/get-total-price-by-week',
            data,
            config
        );
        return res.data;
    },

    async getTotalAppointmentByWeek(data: any, config: any): Promise<any> {
        const res = await apiClient.post(
            'api/appointment/get-total-appointment-by-week',
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
        const res = await apiClient.post('api/appointment/create', data);
        return res;
    },
    async viewAppointmentForPatient(data: any): Promise<any> {
        const res = await apiClient.post(
            'api/appointment/viewForPatient',
            data
        );
        return res.data;
    },
    async updateAppointmentStatus(data: any): Promise<any> {
        const res = await apiClient.put(
            'api/appointment/update-appointment-status',
            data
        );
        return res;
    },
};
