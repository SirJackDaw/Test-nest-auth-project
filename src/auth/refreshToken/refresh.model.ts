import { prop } from '@typegoose/typegoose';

export class RefreshModel {
  @prop({ unique: true })
  userId: string;

  @prop()
  refreshToken: string;

}
