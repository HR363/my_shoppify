import { Controller, Get, Patch, Param, Body, UseGuards, Request, SetMetadata } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
// import { RolesGuard } from '../auth/guards/roles.guard'; // To be implemented

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Request() req: any) {
    return this.usersService.findMe(req.user.id);
  }

  @Patch('me')
  async updateMe(@Request() req: any, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.id, dto);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['ADMIN'])
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['ADMIN'])
  @Get()
  async getAll() {
    return this.usersService.findAll();
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['ADMIN'])
  @Patch(':id/role')
  async updateRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.updateRole(id, role);
  }
}
