import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { Request } from "express";

interface AuthDTO {
  username: string;
  password: string;
}

interface ReauthDTO {
  refreshToken: string;
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

  @Post("refresh")
  reauthenticate(@Body() { refreshToken }: ReauthDTO) {
    return this.authService.reauthenticate(refreshToken);
  }

  // Rota de teste de autenticação protegida pelo guardião (AuthGuard).
  @UseGuards(AuthGuard) // Define que o AuthGuard deve ser usado para proteger esta rota.
  @Get("test-auth")
  test(@Req() req: Request) {
    return req.user; // Retorna o conteúdo do payload JWT após a autenticação bem-sucedida.
  }
}
