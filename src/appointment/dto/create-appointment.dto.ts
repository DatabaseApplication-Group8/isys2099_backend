export class CreateAppointmentDto {
  meeting_date: Date | string;
  purpose: string;
  start_time: Date | string;
  end_time: Date | string;
  location?: string | null;
  meeting_status?: boolean | null;
  p_id: number;
  s_id: number;
}
