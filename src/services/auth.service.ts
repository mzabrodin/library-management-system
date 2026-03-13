import {User} from "../generated/prisma/client";
import bcrypt from "bcrypt";
import JWT from "../types/jwt";
import CONFIG from "../config";
import jwt from "jsonwebtoken";
import {prisma} from "../db/prisma";

export class AuthService {
    private async saveRefreshToken(userId: string, refreshToken: string) {
        const hash = await bcrypt.hash(refreshToken, 10);
        await prisma.user.update({
            where: {id: userId},
            data: {refreshToken: hash}
        });
    }

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

        await this.saveRefreshToken(user.id, refreshToken);

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

            const user = await prisma.user.findUnique({where: {id: decoded.id}});
            if (user == null || user.refreshToken == null) {
                return null;
            }

            const isTokenMatch = await bcrypt.compare(oldRefreshToken, user.refreshToken);
            if (!isTokenMatch) {
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

            const newRefreshToken = jwt.sign(payload, CONFIG.jwtRefreshSecret, {
                expiresIn: CONFIG.jwtRefreshExpiresIn as jwt.SignOptions["expiresIn"]
            });

            await this.saveRefreshToken(user.id, newRefreshToken);

            return {
                accessToken,
                refreshToken: newRefreshToken
            };

        } catch (error) {
            return null;
        }
    }
}

export const authService: AuthService = new AuthService();