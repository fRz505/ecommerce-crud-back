import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Length,
  Matches,
  IsNumberString,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 80)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/, {
    message:
      'Password must have at least one uppercase letter, one lowercase letter, one number, and be 8-15 characters long',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 80)
  address: string;

  @IsDateString()
  @IsOptional()
  fecha?: string;

  @IsNumberString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  country: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  city: string;

  confirmPassword?: string;
}
