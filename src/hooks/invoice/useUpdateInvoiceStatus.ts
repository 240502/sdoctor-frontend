import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { invoicesService } from '../../services';

type UpdateInvoiceStatusResponse = {
    success: boolean;
    message: string;
    updatedInvoiceStatus: any;
};

export const useUpdateInvoiceStatus = (): UseMutationResult<
    UpdateInvoiceStatusResponse,
    Error,
    { invoiceId: number; status: string }
> => {
    return useMutation<
        UpdateInvoiceStatusResponse,
        Error,
        { invoiceId: number; status: string }
    >({
        mutationKey: ['useUpdateInvoiceStatus'],
        mutationFn: async (payload: { invoiceId: number; status: string }) => {
            return await invoicesService.updateInvoiceStatus(payload);
        },
    });
};
