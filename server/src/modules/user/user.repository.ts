import { Injectable } from "@nestjs/common";
import { User } from "./user.model";

export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByUsername(username: string): Promise<User | null>;
  abstract save(user: User): Promise<void>;
}

interface IUserData {
  username: string;
  password: string;
}

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private users: User[];

  constructor() {
    this.users = [];
    this.generateUsers([{ username: "johndoe", password: "123456" }]);
  }

  private generateUsers(usersDatas: IUserData[]) {
    for (const { username, password } of usersDatas) {
      const user = User.create(username, password);
      this.save(user);
    }
  }

  public async findById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) ?? null;
  }

  public async findByUsername(username: string): Promise<User | null> {
    return this.users.find(user => user.username === username) ?? null;
  }

  public async save(user: User): Promise<void> {
    this.users.push(user);
  }
}
