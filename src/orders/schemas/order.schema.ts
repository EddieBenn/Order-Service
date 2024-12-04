import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  itemId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  customerId: string;

  createdAt: Date;

  updatedAt: Date;
}
export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
