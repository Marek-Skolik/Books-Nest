import { IsNotEmpty, IsString, Length, IsInt, IsUUID, Min, Max } from "class-validator"

export class UpdateBookDTO {
  @Length(3, 100)
  @IsNotEmpty()
  @IsString()
  title: string
  
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  @IsInt()
  rating: number

  @Min(0)
  @Max(1000)
  @IsNotEmpty()
  @IsInt()
  price: number

  @IsUUID()
  @IsString()
  authorId: string
}