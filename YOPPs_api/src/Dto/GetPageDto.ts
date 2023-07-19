import {GetUserDto} from "./GetUserDto";
import {Links} from "../entities/Links";

export class GetPageDto {
    userData: GetUserDto;
    description?: string;
    contactEmail?: string;
    socialLinks?: Links;
}


