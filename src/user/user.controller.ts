import { ErrorWithMessage } from './../pdo/ErrorWithMessage';
import { BadRequestException, Body, Query, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, Logger } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDto';
import { UserDto } from './dto/userDto';
import { UserModel } from './user.model';
import { IdValidationPipe } from '../pipes/idValidation.pipe';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './user.roles';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { LoginDto } from './dto/loginDto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';

@ApiBearerAuth()
@Controller()
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly logger: Logger) {}

  @hasRoles(UserRole.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('api/users')
  @HttpCode(200)
  async getUsersList(): Promise<UserModel[]> {
    return this.userService.find();
  }

  @Post('api/login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto): Promise<any> {
    this.logger.log('http','WINSTON')
    const user = await this.userService.validateUser(dto)
    return this.userService.getToken(user);
  }

  @Post('api/refresh')
  @HttpCode(200)
  async refresh(@Query('token') token: string) {
    return this.userService.refresh(token);
  }

  @Get('api/users/:id')
  @HttpCode(200)
  async getUser(@Param('id', IdValidationPipe) id: string): Promise<UserModel> {
    return this.userService.findById(id);
  }

  @hasRoles(UserRole.Admin, UserRole.MasterAccount)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('api/user')
  @HttpCode(201)
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Succesfully created', type: CreateUserDto })
  async createUser(@Body() dto: CreateUserDto): Promise<UserModel> {
    const oldUser = await this.userService.findByEmail(dto.email)
    if (oldUser) {
      throw new BadRequestException()
    }
    return this.userService.create(dto);
  }

  @Put('api/user/:id')
  @HttpCode(200)
  @ApiResponse({status: 200, description: 'Successfully updated'})
  @ApiBody({ type: UserDto })
  async updateUser(@Param('id', IdValidationPipe) id: string, @Body() dto: UserDto): Promise<UserModel> {
    dto._id = id;
    return this.userService.update(id, dto);
  }

  @Put('api/editRole/:id')
  @HttpCode(200)
  @ApiResponse({status: 200, description: 'Successfully updated'})
  @ApiQuery({type: String, name: 'role'})
  async editUserRole(@Param('id', IdValidationPipe) id: string, @Query('role') role: UserRole): Promise<UserModel> {
    return this.userService.updateRole(id, role);
  }

  @Delete('api/delete/:id')
  @HttpCode(204)
  @ApiResponse({status: 204, description: 'Successfully deleted'})
  @ApiResponse({status: 404, description: 'Not Found.', type: ErrorWithMessage})
  async deleteUser(@Param('id', IdValidationPipe) id: string): Promise<UserModel> {
    return this.userService.delete(id);
  }
}
