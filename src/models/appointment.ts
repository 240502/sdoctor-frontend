export interface Appointment {
    id: Number;
    doctor_id: Number;
    appointment_date: Date;
    patient_name: String;
    patient_phone: String;
    patient_email: String;
    year_of_birth: String;
    province: String;
    district: String;
    commune: String;
    examination_reason: String;
    time_id: Number;
    status_id: Number;
    created_at: Date;
    updated_at: Date;
}
