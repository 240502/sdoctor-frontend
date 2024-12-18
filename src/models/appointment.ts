export interface Appointment {
    id: number;
    doctor_id: number;
    appointment_date: Date;
    patient_name: string;
    patient_phone: string;
    patient_email: string;
    birthday: Date | string;
    province: string;
    district: string;
    commune: string;
    examination_reason: string;
    time_id: number;
    status_id: number;
    created_at: Date;
    updated_at: Date;
    doctor_name: string;
    time_value: string;
    price: number;
    location: string;
    type: string;
    gender: number;
    rejectionReason: string;
    service_id: number;
    service_name: string;
    invoice_status: string;
}
export interface AppointmentViewForPatient extends Appointment {
    status_name: string;
}
