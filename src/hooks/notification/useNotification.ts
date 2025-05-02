import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    UseQueryResult,
} from '@tanstack/react-query';
import { NotificationCreate, Notifications } from '../../models';
import { notificationService } from '../../services';

interface NotificationResponse {
    notifications: Notifications[];
    totalItems: number;
}

export const useCreateNotification = () => {
    return useMutation({
        mutationKey: ['useCreateNotifcation'],
        mutationFn: async (newNotfication: NotificationCreate) =>
            notificationService.createNotification(newNotfication),
    });
};

export const useMarkAsRead = () => {
    return useMutation({
        mutationKey: ['useMarkAsRead'],
        mutationFn: async (id: number) => notificationService.markAsRead(id),
    });
};

export const useMarkAllRead = () => {
    return useMutation({
        mutationKey: ['useMarkAllRead'],
        mutationFn: async (doctorId: number) =>
            notificationService.markAllRead(doctorId),
    });
};

export const useFetchNotificationByUserId = (
    userId: number
): UseQueryResult<NotificationResponse, Error> => {
    return useQuery<NotificationResponse, Error>({
        queryKey: ['useFetchNotificationByUserId', userId],
        queryFn: async () =>
            notificationService.getNotificationByUserId(userId),
    });
};
