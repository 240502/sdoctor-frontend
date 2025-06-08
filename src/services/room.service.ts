import apiClient from '../constants/api';

const roomService = {
    async getRoomsByClinicAndDepartment(
        clinicId: number,
        departmentId: number
    ): Promise<any> {
        const res = await apiClient.get(
            `/room/get-room-by-clinicId-and-departmentId?clinicId=${clinicId}&departmentId=${departmentId}`
        );
        return res?.data;
    },
};

export default roomService;
