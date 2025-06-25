import { IsNotEmpty, IsEmail } from 'class-validator';

export class RequestResetDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
} 