import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export enum UserRolesEnum {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  @ApiProperty()
  name: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  @ApiProperty()
  email: string;

  @Prop({ select: false })
  @ApiProperty()
  password: string;

  @Prop({
    enum: UserRolesEnum,
    default: UserRolesEnum.USER,
  })
  @ApiProperty()
  role: UserRolesEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
