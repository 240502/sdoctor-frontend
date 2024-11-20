import axios from 'axios';
import { baseURL } from '../constants/api';
import { data } from '@remix-run/router';

export const AppointmentService = {
    async createAppointment(data: any): Promise<any> {
        const res = await axios.post(baseURL + 'api/appointment/create', data);
        return res;
    },
    async viewAppointmentForPatient(data: any): Promise<any> {
        const res = await axios.post(
            baseURL + 'api/appointment/viewForPatient',
            data
        );
        return res.data;
    },
    async cancelAppointment(id: number): Promise<any> {
        const res = await axios.put(baseURL + 'api/appointment/cancel/' + id);
        return res;
    },
};
