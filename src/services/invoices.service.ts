import { apiClient } from '../constants/api';

export const invoicesService = {
    async createInvoice(data: any): Promise<any> {
        console.log('call create invoice');
        const res = await apiClient.post('/invoice/create', data);
        return res;
    },
    async updateInvoice(data: any): Promise<any> {
        const res = await apiClient.put('/api/invoice/update', data);
        return res;
    },
    async deleteInvoice(id: number): Promise<any> {
        const res = await apiClient.delete('/api/invoice/delete/' + id);
        return res;
    },
    async getRecentInvoice(doctorId: number): Promise<any> {
        const res = await apiClient.get('/invoice/get-recent/' + doctorId);
        return res?.data;
    },
    async getTotalRevenueByDateInNowWeek(data: any, config: any): Promise<any> {
        const res = await apiClient.post(
            '/invoice/get-total-revenue-by-date-in-now-week',
            data,
            config
        );
        return res.data;
    },
    async viewInvoice(data: any): Promise<any> {
        const res = await apiClient.post('/invoice/view', data);
        return res.data;
    },
    async updateInvoiceStatus(data: any, config: any): Promise<any> {
        const res = await apiClient.put('/invoice/update-status', data, config);
        return res;
    },
    async getInvoiceByAppointmentId(appointmentId: number): Promise<any> {
        const res = await apiClient.get(
            '/invoice/get-by-appointment-id/' + appointmentId
        );
        return res?.data;
    },
};
