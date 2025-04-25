import {
    CreateSchedulesResponse,
    DeleteSchedulesResponse,
    SchedulesCreate,
} from '../../models';
import { useQueryClient } from '@tanstack/react-query';
import { useDeleteSchedules } from './useDeleteSchedules';
import { useCreateSchedules } from './useCreateSchedules';
import { AxiosRequestConfig } from 'axios';
export const useUpdateSchedules = (config?: AxiosRequestConfig) => {
    const deleteSchedules = useDeleteSchedules(config);
    const createSchedules = useCreateSchedules(config);
    const queryClient = useQueryClient();
    const updateSchedules = async (
        deletedIds: number[],
        newSchedules: SchedulesCreate[]
    ): Promise<void> => {
        const promises: Promise<
            DeleteSchedulesResponse | CreateSchedulesResponse
        >[] = [];

        if (deletedIds.length > 0) {
            promises.push(deleteSchedules.mutateAsync(deletedIds));
        }

        if (newSchedules.length > 0) {
            promises.push(createSchedules.mutateAsync(newSchedules));
        }

        const [res1, res2] = await Promise.all(promises);
        console.log(res1, res2);
        queryClient.invalidateQueries({
            queryKey: ['useFetchSchedulesByEntityIdForDoctor'],
        });
    };

    return {
        updateSchedules,
        isPending: deleteSchedules.isPending || createSchedules.isPending,
        isError: deleteSchedules.isError || createSchedules.isError,
        error: deleteSchedules.error || createSchedules.error,
    } as const;
};

// Định nghĩa kiểu trả về của hook
export type UseUpdateSchedulesReturn = {
    updateSchedules: (
        deletedIds: number[], // Đổi tên để đồng bộ với hàm
        newSchedules: SchedulesCreate[] // Sử dụng tên newSchedules để đồng bộ
    ) => Promise<void>;
    isPending: boolean;
    isError: boolean;
    error: Error | null;
};
