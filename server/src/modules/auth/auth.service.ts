import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserRepository } from "../user/user.repository";
import { IUser, User } from "../user/user.model";
import { IJwtPayload } from "src/shared";
import { JwtService } from "@nestjs/jwt";

export interface AuthOutputPort {
  accessToken: string;
  refreshToken: string;
  user: Omit<IUser, "password">;
}

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  private generateToken(payload: IJwtPayload) {
    const accessToken = this.jwtService.sign(payload);

    // Um refresh token dura mais tempo e contêm uma assinatura diferente, ou seja, não poderemos utilizar ele no lugar do accessToken para acessar requisições privadas com o AuthGuard!
    // O refresh token só servirá para gerar outro token de acesso e outro refresh token caso o token de acesso atual tenha expirado!
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: "7d",
      secret: process.env.JWT_SECRET_KEY_REFRESH_TOKEN,
    });
    return { accessToken, refreshToken };
  }

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

    const { accessToken, refreshToken } = this.generateToken(payload);

    return { accessToken, refreshToken, user: user.toJSON() };
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

    const { accessToken, refreshToken } = this.generateToken(payload);

    return { accessToken, refreshToken, user: user.toJSON() };
  }

  public async reauthenticate(refreshToken: string): Promise<AuthOutputPort> {
    const user = await this.validateRefreshToken(refreshToken);
    const tokens = this.generateToken({
      sub: user.id,
      username: user.username,
    });

    return { ...tokens, user: user.toJSON() };
  }

  private async validateRefreshToken(refreshToken: string): Promise<User> {
    if (!refreshToken) {
      throw new NotFoundException("User not found");
    }

    const payload = this.jwtService.decode(refreshToken) as IJwtPayload;
    const user = this.userRepository.findById(payload.sub);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    try {
      this.jwtService.verify(refreshToken);
      return user;
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        throw new UnauthorizedException("Assinatura Inválida");
      }
      if (error.name === "TokenExpiredError") {
        throw new UnauthorizedException("Token Expirado");
      }
      throw new UnauthorizedException(error.message);
    }
  }
}
