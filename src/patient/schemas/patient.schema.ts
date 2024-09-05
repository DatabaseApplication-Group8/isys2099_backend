import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PatientDocument = HydratedDocument<Patient>;

@Schema()
export class Patient {
  @Prop()
  p_id: string;

  @Prop()
  d_id: string;

  @Prop()
  d_notes: string;

  @Prop()
  diag_img: string;

  @Prop()
  lab_result: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
