export interface Invoices {
    id: number;
    appointment_id: number;
    doctor_id: number;
    service_id: number;
    amount: number;
    status: string;
    created_at: Date;
    updated_at: Date;
    patient_name: string;
    time_value: string;
    appointment_date: Date;
    doctor_name: string;
    payment_date: Date;
    payment_method: number;
    payment_name: string;
    service_name: string;
}
