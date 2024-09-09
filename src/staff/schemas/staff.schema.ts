import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StaffDocument = HydratedDocument<Staff>;

@Schema()
export class Staff {
  @Prop()
  s_id: string;

  @Prop()
  certificates: string[];

  @Prop()
  training_materials: string[];

  @Prop()
  other_documents: string[];
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
