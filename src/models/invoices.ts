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
}
