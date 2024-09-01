export class CreateTreatmentDto {
  p_id: number;
  doctor_id: number;
  description: string;
  treatment_date: Date | string | null;
}
