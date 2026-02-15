import {db} from "../storage/db";
import {User} from "../types";
import {UserDto} from "../schemas/user.schema";

export class UserService {

    findAll(): User[] {
        return db.users.getAll();
    }

    findById(id: string): User | undefined {
        return db.users.getById(id);
    }

    existsByEmail(email: string): boolean {
        return db.users.getAll().some(user => user.email === email);
    }

    existsById(id: string): boolean {
        return this.findById(id) !== undefined;
    }

    create(dto: UserDto): User {
        const id = crypto.randomUUID();
        const user: User = {
            id,
            name: dto.name,
            email: dto.email
        }

        db.users.saveToMap(user);
        db.users.saveToFile()

        return user;
    }
}