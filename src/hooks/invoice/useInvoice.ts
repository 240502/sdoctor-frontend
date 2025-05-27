import { useMutation, useQuery } from '@tanstack/react-query';
import { invoicesService } from '../../services';
import { Dayjs } from 'dayjs';

const useCreateInvoiceDetail = () => {
    return useMutation({
        mutationKey: ['useCreateInvoiceDetail'],
        mutationFn: async (invoiceDetailData: any) => {
            return await invoicesService.createInvoiceDetail(invoiceDetailData);
        },
    });
};

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
    createdAt: Dayjs;
}) => {
    return useQuery({
        queryKey: ['useFetchInvoices', pageload],
        queryFn: async () => {
            return await invoicesService.viewInvoice({
                ...pageload,
                createdAt: pageload.createdAt.format('YYYY-MM-DD'),
            });
        },
        retry: false,
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
            if (id === null) {
                throw new Error('Invoice ID cannot be null');
            }
            return await invoicesService.getInvoiceById(id);
        },
        retry: false,
    });
};

const useUpdateInvoiceStatus = () => {
    return useMutation({
        mutationKey: ['useUpdateInvoiceStatus'],
        mutationFn: async (invoiceId: number) => {
            return await invoicesService.updateInvoiceStatus(invoiceId);
        },
    });
};

const useDeleteInvoiceDetail = () => {
    return useMutation({
        mutationKey: ['useDeleteInvoiceDetail'],
        mutationFn: async (id: number) => {
            return await invoicesService.deleteInvoiceDetail(id);
        },
    });
};

const useUpdateInvoice = () => {
    return useMutation({
        mutationFn: (payload: { invoiceId: number; paymentMethod: number }) =>
            invoicesService.updateInvoice(payload),
    });
};

const useDeleteInvoice = () => {
    return useMutation({
        mutationFn: (deleteId: number | null) =>
            invoicesService.deleteInvoice(deleteId),
    });
};
export {
    useDeleteInvoice,
    useCreateInvoice,
    useFetchInvoices,
    useFetchInvoiceById,
    useUpdateInvoiceStatus,
    useDeleteInvoiceDetail,
    useCreateInvoiceDetail,
    useUpdateInvoice,
};
