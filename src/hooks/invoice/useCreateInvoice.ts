import { useMutation } from '@tanstack/react-query';

import { invoicesService } from '../../services';

export const useCreateInvoice = () => {
    return useMutation({
        mutationFn: async (invoiceData: any) => {
            return await invoicesService.createInvoice(invoiceData);
        },
        onSuccess(data, variables, context) {
            console.log('Create invoice success', data);
            console.log('Create invoice variables', variables);
            console.log('Create invoice context', context);
        },
    });
};
