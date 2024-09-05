import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DoctorNoteDocument = HydratedDocument<DoctorNote>;

@Schema()
export class DoctorNote {
  @Prop()
  d_id: string;

  @Prop()
  note: string;
}

export const DoctorNoteSchema = SchemaFactory.createForClass(DoctorNote);
