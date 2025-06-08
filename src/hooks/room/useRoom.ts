import { useQuery } from '@tanstack/react-query';
import roomService from '../../services/room.service';

export const useFetchRoomsByClinicIdAndDepartmentId = (payload: {
    clinicId: number | null;
    departmentId: number | null;
}) => {
    return useQuery({
        queryKey: ['useFetchRoomsByClinicIdAndDepartmentId', payload],
        queryFn: () => {
            if (!payload.clinicId || !payload.departmentId) {
                return;
            }
            return roomService.getRoomsByClinicAndDepartment(
                payload.clinicId,
                payload.departmentId
            );
        },
    });
};
