export class CreateTreatmentDto {
  p_id: number;
  doctor_id: number;
  description: string;
  treatment_date: Date | string | null;
  start_time: Date | string;
  end_time: Date | string;
  billing: number;
}
