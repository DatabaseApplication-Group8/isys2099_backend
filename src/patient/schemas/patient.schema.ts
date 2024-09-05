import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DoctorNote } from './doctorNote.schema';

export type PatientDocument = HydratedDocument<Patient>;

@Schema()
export class Patient {
  @Prop()
  p_id: string;

  @Prop({type: DoctorNote})
  d_note: DoctorNote

  @Prop()
  diag_img: string;

  @Prop()
  lab_result: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
