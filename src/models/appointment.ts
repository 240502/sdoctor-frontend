export interface Appointment {
    id: Number;
    doctor_id: Number;
    appointment_date: Date;
    patient_name: string;
    patient_phone: string;
    patient_email: string;
    birthday: Date | string;
    province: string;
    district: string;
    commune: string;
    examination_reason: string;
    time_id: Number;
    status_id: Number;
    created_at: Date;
    updated_at: Date;
    doctor_name: string;
    time_value: string;
    price: number;
    location: string;
    type: string;
    gender: number;
}
export interface AppointmentViewForPatient extends Appointment {
    status_name: string;
}
