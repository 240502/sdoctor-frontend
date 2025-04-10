import { Doctor } from '../models/doctor';

export const addWatchedDoctor = (doctor: Doctor) => {
    let doctors = JSON.parse(localStorage.getItem('watchedDoctors') || '[]');
    if (doctors.length > 0) {
        const existDoctor = doctors.find(
            (item: any) => item.doctorId === doctor.doctorId
        );
        if (!existDoctor) {
            doctors.push(doctor);
        }
    } else {
        doctors = [doctor];
    }
    localStorage.setItem('watchedDoctors', JSON.stringify(doctors));
};
