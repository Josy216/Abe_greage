export interface Invoice {
  invoice_id?: number;
  appointment_id: number;
  total_amount: number;
  amount_paid: number;
  payment_date?: string; // Or Date
  payment_status: 'unpaid' | 'paid' | 'partially_paid';
}
