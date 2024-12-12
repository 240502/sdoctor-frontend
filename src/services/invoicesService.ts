import { apiClient } from '../constants/api';

export const invoicesService = {
    async createInvoice(data: any): Promise<any> {
        const res = await apiClient.post('/api/invoice/create', data);
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
    async getRecentInvoice(): Promise<any> {
        const res = await apiClient.get('/api/invoice/get-recent');
        return res?.data;
    },
    async getTotalRevenueByDateInNowWeek(data: any, config: any): Promise<any> {
        const res = await apiClient.post(
            'api/invoice/get-total-revenue-by-date-in-now-week',
            data,
            config
        );
        return res.data;
    },
    async viewInvoice(data: any): Promise<any> {
        const res = await apiClient.post('/api/invoice/view', data);
        return res.data;
    },
    async updateInvoiceStatus(data: any, config: any): Promise<any> {
        const res = await apiClient.put(
            '/api/invoice/update-status',
            data,
            config
        );
        return res;
    },
};
