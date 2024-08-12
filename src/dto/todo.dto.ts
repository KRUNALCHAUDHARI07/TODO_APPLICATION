import { IsOptional, IsString, ValidateNested } from "class-validator";

class CreateUserDto {
    @IsString()
    public name: string;

    @IsString()
    public description: string;

}

export default CreateUserDto;
