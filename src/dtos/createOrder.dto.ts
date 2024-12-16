import { IsString, IsArray, ArrayMinSize, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsString()
  userId: string;

  @IsArray()
  @ArrayMinSize(1)
  products: { id: string }[];
}
