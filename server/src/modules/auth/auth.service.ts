import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UserRepository } from "../user/user.repository";
import { IUser, User } from "../user/user.model";
import { IJwtPayload } from "src/shared";
import { JwtService } from "@nestjs/jwt";

export interface AuthOutputPort {
  token: string;
  user: Omit<IUser, "password">;
}

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  private async validateCredentials(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.passwordIsEqualTo(password)) {
      throw new ForbiddenException("Password is incorrect");
    }
    return user;
  }

  public async signin(
    username: string,
    password: string,
  ): Promise<AuthOutputPort> {
    const user = await this.validateCredentials(username, password);

    const payload: IJwtPayload = {
      sub: user.id,
      username: user.username,
    };

    return { token: this.jwtService.sign(payload), user: user.toJSON() };
  }

  public async signup(
    username: string,
    password: string,
  ): Promise<AuthOutputPort> {
    const userExists = await this.userRepository.findByUsername(username);

    if (userExists) {
      throw new ConflictException("User already exists");
    }

    const user = User.create(username, password);
    await this.userRepository.save(user);

    const payload: IJwtPayload = {
      sub: user.id,
      username: user.username,
    };

    return { token: this.jwtService.sign(payload), user: user.toJSON() };
  }
}
