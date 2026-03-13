import {UserDto} from "../schemas/user.schema";
import {prisma} from "../db/prisma";
import bcrypt from "bcrypt";
import {User, UserRole} from "../generated/prisma/client";

export class UserService {

    async findAll(): Promise<Omit<User, 'passwordHash'>[]> {
        return prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });
    }

    async findById(id: string): Promise<Omit<User, 'passwordHash'> | null> {
        return prisma.user.findUnique({
            where: {id},
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });
    }

    async existsByEmail(email: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: {email: email.toLowerCase()}
        });

        return user !== null;
    }

    async existsById(id: string): Promise<boolean> {
        const count = await prisma.user.count({
            where: {id}
        });

        return count > 0;
    }

    async create(dto: UserDto): Promise<Omit<User, 'passwordHash'>> {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const newUser = await prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                passwordHash: hashedPassword,
                role: dto.role || UserRole.USER
            }
        });

        const {passwordHash, ...userWithoutPassword} = newUser;
        return userWithoutPassword;
    }
}

export const userService = new UserService();