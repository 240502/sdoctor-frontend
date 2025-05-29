import apiClient from '../constants/api';
import {
    DoctorServiceCreateDTO,
    DoctorServiceUpdateDTO,
} from '../models/doctor_service';

const doctorServiceService = {
    async createDoctorService(
        doctorService: DoctorServiceCreateDTO
    ): Promise<any> {
        const res = await apiClient.post(
            '/doctor-service/create',
            doctorService
        );
        return res;
    },

    async updateDoctorService(
        doctorService: DoctorServiceUpdateDTO
    ): Promise<any> {
        const res = await apiClient.put(
            '/doctor-service/update',
            doctorService
        );
        return res;
    },

    async deleteDoctorService(id: number | null): Promise<any> {
        const res = await apiClient.delete(`/doctor-service/delete/${id}`);
        return res;
    },

    async getDoctorServiceByDoctorId(doctorId: number | null): Promise<any> {
        const res = await apiClient.get(
            `/doctor-service/get-doctor-services/${doctorId}`
        );
        return res?.data;
    },
};
export default doctorServiceService;
