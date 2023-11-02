import { ForbiddenException } from "@nestjs/common";
import { randomUUID } from "crypto";

export interface IUser {
  readonly id: string;
  username: string;
  password: string;
}

export class User implements IUser {
  private props: IUser;

  get id(): string {
    return this.props.id;
  }

  get username(): string {
    return this.props.username;
  }

  set username(newUsername: string) {
    this.props.username = newUsername;
  }

  get password(): string {
    return this.props.password;
  }

  public updatePassword(currentPassword: string, newPassword: string): void {
    if (this.passwordIsEqualTo(currentPassword)) {
      this.props.password = newPassword;
    } else {
      throw new ForbiddenException("Current password is incorrect");
    }
  }

  public passwordIsEqualTo(otherPassword: string): boolean {
    return this.props.password === otherPassword;
  }

  private constructor(id: string, username: string, password: string) {
    this.props = { id, username, password };
  }

  public static create(username: string, password: string, id?: string): User {
    const user = new User(id ?? randomUUID().toString(), username, password);
    return user;
  }

  public toJSON(): Omit<IUser, "password"> {
    return {
      id: this.props.id,
      username: this.props.username,
    };
  }
}
