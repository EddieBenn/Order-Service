import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, enum: GenderEnum, type: String })
  gender: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  password: string;

  createdAt: Date;

  updatedAt: Date;
}
export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
