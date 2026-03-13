import {RegisterDto} from "../schemas/user.schema";
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

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({where: {email}})
    }

    async existsByEmail(email: string): Promise<boolean> {
        const count = await prisma.user.count({where: {email}});
        return count > 0;
    }

    async create(dto: RegisterDto): Promise<Omit<User, 'passwordHash'>> {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        return prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                passwordHash: hashedPassword,
                role: dto.role || UserRole.USER
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });
    }
}

export const userService = new UserService();