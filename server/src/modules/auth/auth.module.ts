import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategyService } from "./jwt-strategy/jwt-strategy.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    // Configuração do módulo de autenticação.
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: "60s", // O token gerado será expirado após 30 minutos
      },
    }),
    UserModule, // Importação do módulo de usuário para acesso a funcionalidades relacionadas a usuários.
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategyService],
})
export class AuthModule {}
