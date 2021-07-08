import { UserRole } from './user.roles';
import { AuthService } from './../auth/auth.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { Types } from 'mongoose';
import { UserModel } from './user.model';
import { CreateUserDto } from './dto/createUserDto';
import { LoginDto } from './dto/loginDto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    private readonly authService: AuthService) {}

  async find(): Promise<DocumentType<UserModel>[]> {
    return this.userModel.find().exec();
  }

  async findById( id: string | Types.ObjectId): Promise<DocumentType<UserModel>> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<DocumentType<UserModel>>{
    return this.userModel.findOne({ email }).exec();
  }

  async create(dto: CreateUserDto): Promise<DocumentType<UserModel>> {
    dto.password = await this.authService.hashPassword(dto.password)
    return this.userModel.create(dto)
  }

  async update(id: string | Types.ObjectId, dto: CreateUserDto): Promise<DocumentType<UserModel>> {
    const user = await this.findById(id)
    if(!user) {
      throw new NotFoundException();
    }
    return this.userModel.findByIdAndUpdate(id, dto, { new: true, useFindAndModify: false });
  }

  async updateRole(id: string | Types.ObjectId, role: UserRole): Promise<DocumentType<UserModel>> {
    const user = await this.findById(id)
    if(!user) {
      throw new NotFoundException();
    }
    user.role = role;
    return this.userModel.findByIdAndUpdate(id, user, { new: true, useFindAndModify: false });
  }

  async delete(id: string | Types.ObjectId): Promise<DocumentType<UserModel>> {
    const user = await this.findById(id)
    if(!user) {
      throw new NotFoundException();
    }
    return this.userModel.findByIdAndRemove(id);
  }

  async validateUser(dto: LoginDto): Promise<DocumentType<UserModel>> {
    const user = await this.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('auth error');
    }
    const isCorrectPass = await this.authService.comparePasswords(dto.password, user.password)
    if (!isCorrectPass) {
      throw new UnauthorizedException('wrong pass');
    }
    return user;
  }

  async getToken(user: UserModel) {
    return {
      access_token: await this.authService.generateJWT(user)
    }
  }
}
