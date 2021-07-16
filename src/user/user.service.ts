import { UserRole } from './user.roles';
import { AuthService } from './../auth/auth.service';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { LoginDto } from './dto/loginDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    private readonly authService: AuthService) {}

  async findUsers(condition: any): Promise<User[]> {
    return this.userRepo.find(condition);
  }

  async findUser( condition: any): Promise<User> {
    const found = await this.userRepo.findOne(condition);
    if (!found) {
       throw new NotFoundException()
    }
    return found;
  }

  async exist( condition: any): Promise<boolean> {
    const found = await this.userRepo.findOne(condition);
    return found ? true : false;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const oldUser = await this.exist({ email: dto.email })
    if (oldUser) {
      throw new BadRequestException()
    }
    dto.password = await this.authService.hashPassword(dto.password);
    const user =  this.userRepo.create(dto);
    await this.userRepo.save(user);
    return user;
  }

  async update(id: number, dto: CreateUserDto): Promise<any> {
    const user = await this.findUser(id)
    return this.userRepo.save({
      ...user,
      ...dto
    });
  }

  async updateRole(id: number, role: UserRole): Promise<User> {
    const user = await this.findUser(id)
    user.role = role;
    await this.userRepo.save(user)
    return user;
  }

  async delete(id: number): Promise<void> {
    const result = await this.userRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async validateUser(dto: LoginDto): Promise<User> {
    const user = await this.userRepo.findOne({email: dto.email});
    if (!user) {
      throw new UnauthorizedException('auth error');
    }
    const isCorrectPass = await this.authService.comparePasswords(dto.password, user.password)
    if (!isCorrectPass) {
      throw new UnauthorizedException('wrong pass');
    }
    return user;
  }

  async getToken(user: User) {
    const tokens = await this.authService.generateJWT(user)
    return tokens
  }

  async refresh(token: string)
  {
    const data = await this.authService.verifyToken(token)
    return this.getToken(data)
  }

}
