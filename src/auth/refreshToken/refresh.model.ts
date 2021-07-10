import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class RefreshModel {
  @prop({ unique: true })
  userId: Types.ObjectId;

  @prop()
  refreshToken: string;
}
