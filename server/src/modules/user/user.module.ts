import { Module } from "@nestjs/common";
import { InMemoryUserRepository, UserRepository } from "./user.repository";

@Module({
  providers: [
    {
      provide: UserRepository, // Define o provedor para UserRepository.
      useClass: InMemoryUserRepository, // Especifica a classe a ser usada como implementação.
    },
  ],
  exports: [UserRepository], // Exporta UserRepository para que outros módulos possam usá-lo.
})
export class UserModule {}
