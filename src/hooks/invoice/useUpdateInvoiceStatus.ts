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
    { id: number; status: string }
> => {
    return useMutation<
        UpdateInvoiceStatusResponse,
        Error,
        { id: number; status: string }
    >({
        mutationKey: ['useUpdateInvoiceStatus'],
        mutationFn: async (payload: { id: number; status: string }) => {
            return await invoicesService.updateInvoiceStatus(payload);
        },
    });
};
