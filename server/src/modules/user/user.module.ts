import { Module } from "@nestjs/common";
import { InMemoryUserRepository, UserRepository } from "./user.repository";

@Module({
  providers: [
    {
      provide: UserRepository,
      useClass: InMemoryUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class UserModule {}
