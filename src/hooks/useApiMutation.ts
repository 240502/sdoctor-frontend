import {
    useMutation,
    useQueryClient,
    MutationFunction,
} from '@tanstack/react-query';

type ApiMutationProps<TVariables, TResponse> = {
    mutationFn: MutationFunction<TResponse, TVariables>; // Hàm gọi API
    queryKeyToInvalidate?: string[]; // Cache nào cần invalidate sau khi mutate thành công
};

export const useApiMutation = <TVariables, TResponse>({
    mutationFn,
    queryKeyToInvalidate,
}: ApiMutationProps<TVariables, TResponse>) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onSuccess: () => {
            if (queryKeyToInvalidate) {
                queryClient.invalidateQueries({
                    queryKey: queryKeyToInvalidate,
                });
            }
        },
    });
};

/**
 * mutationFn: Hàm gọi API (POST, PUT, DELETE).
 * queryKeyToInvalidate: Nếu cần cập nhật dữ liệu sau khi mutation thành công (ví dụ, refetch danh sách bác sĩ).
 * useMutation: Khi mutation thành công, nó tự động invalidate cache
 */
