import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

interface AuthDTO {
  username: string;
  password: string;
}

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @Post("signin")
  signin(@Body() { username, password }: AuthDTO) {
    return this.authService.signin(username, password);
  }

  @Post("signup")
  signup(@Body() { username, password }: AuthDTO) {
    return this.authService.signup(username, password);
  }
}
