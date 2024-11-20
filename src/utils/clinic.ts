import { Clinic } from '../models/clinic';

export const addWatchedClinic = (clinic: Clinic) => {
    let clinics = JSON.parse(localStorage.getItem('watchedClinics') || '[]');
    if (clinics.length > 0) {
        const existDoctor = clinics.find((item: any) => item.id === clinic.id);
        if (!existDoctor) {
            clinics.push(clinic);
        }
    } else {
        clinics = [clinic];
    }
    localStorage.setItem('watchedClinics', JSON.stringify(clinics));
};
