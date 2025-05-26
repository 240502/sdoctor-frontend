import { useMutation, useQuery } from '@tanstack/react-query';
import { invoicesService } from '../../services';
import { Dayjs } from 'dayjs';
const useCreateInvoice = () => {
    return useMutation({
        mutationKey: ['useCreateInvoice'],
        mutationFn: async (invoiceData: any) => {
            return await invoicesService.createInvoice(invoiceData);
        },
    });
};

const useFetchInvoices = (pageload: {
    pageIndex: number;
    pageSize: number;
    status: string;
    doctorId: number;
    fromDate: Dayjs;
    toDate: Dayjs;
}) => {
    return useQuery({
        queryKey: ['useFetchInvoices', pageload],
        queryFn: async () => {
            return await invoicesService.viewInvoice({
                ...pageload,
                fromDate: pageload.fromDate.format('YYYY-MM-DD'),
                toDate: pageload.toDate.format('YYYY-MM-DD'),
            });
        },
        select: (data) => ({
            invoices: data.data,
            pageCount: data.pageCount,
        }),
    });
};

const useFetchInvoiceById = (id: number | null) => {
    return useQuery({
        queryKey: ['useFetchInvoiceById', id],
        queryFn: async () => {
            return await invoicesService.getInvoiceById(id);
        },
    });
};
export { useCreateInvoice, useFetchInvoices, useFetchInvoiceById };
