import {User} from "../generated/prisma/client";
import {userService} from "./user.service";
import bcrypt from "bcrypt";
import JWT from "../types/jwt";
import CONFIG from "../config";
import jwt from "jsonwebtoken";

export class AuthService {
    async login(user: User, passwordPlain: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: Omit<User, 'passwordHash'>;
    } | null> {

        const isPasswordValid = await bcrypt.compare(passwordPlain, user.passwordHash);
        if (!isPasswordValid) {
            return null;
        }

        const payload: JWT = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        const accessToken = jwt.sign(payload, CONFIG.jwtSecret, {
            expiresIn: CONFIG.jwtExpiresIn as jwt.SignOptions["expiresIn"]
        });

        const refreshToken = jwt.sign(payload, CONFIG.jwtRefreshSecret, {
            expiresIn: CONFIG.jwtRefreshExpiresIn as jwt.SignOptions["expiresIn"]
        });

        const {passwordHash, ...safeUser} = user;

        return {
            accessToken,
            refreshToken,
            user: safeUser
        };
    }

    async refresh(oldRefreshToken: string): Promise<{ accessToken: string; refreshToken: string; } | null> {
        try {
            const decoded = jwt.verify(oldRefreshToken, CONFIG.jwtRefreshSecret) as JWT;

            const user = await userService.findById(decoded.id);
            if (user == null) {
                return null;
            }

            const payload: JWT = {
                id: user.id,
                email: user.email,
                role: user.role
            };

            const accessToken = jwt.sign(payload, CONFIG.jwtSecret, {
                expiresIn: CONFIG.jwtExpiresIn as jwt.SignOptions["expiresIn"]
            });

            const refreshToken = jwt.sign(payload, CONFIG.jwtRefreshSecret, {
                expiresIn: CONFIG.jwtRefreshExpiresIn as jwt.SignOptions["expiresIn"]
            });

            return {
                accessToken,
                refreshToken
            };

        } catch (error) {
            return null;
        }
    }
}

export const authService: AuthService = new AuthService();