import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AppointmentNoteDocument = HydratedDocument<AppointmentNote>;

@Schema()
export class AppointmentNote {
  @Prop()
  a_id: string;

  @Prop()
  before: string;

  @Prop()
  during: string;

  @Prop()
  after: string;
}

export const AppointmentNoteSchema = SchemaFactory.createForClass(AppointmentNote);
