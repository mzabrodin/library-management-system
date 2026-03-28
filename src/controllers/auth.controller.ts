import {Request, Response} from 'express';
import {LoginDto, RefreshDto, RegisterDto} from "../schemas/user.schema";
import {userService} from "../services/user.service";
import {authService} from "../services/auth.service";

export async function register(req: Request<{}, {}, RegisterDto>, res: Response) {
    const existsByEmail = await userService.existsByEmail(req.body.email);
    if (existsByEmail) {
        return res.status(400).json({error: "User with this email already exists"});
    }

    const user = await userService.create(req.body);
    res.status(201).json(user);
}

export async function login(req: Request<{}, {}, LoginDto>, res: Response) {
    const {email, password} = req.body;

    const user = await userService.findByEmail(email);
    if (user == null) {
        return res.status(404).json({error: "User with this email not found"});
    }

    const authData = await authService.login(user, password);

    if (authData == null) {
        return res.status(401).json({error: "Invalid email or password"});
    }

    res.status(200).json(authData);
}

export async function refresh(req: Request<{}, {}, RefreshDto>, res: Response) {
    const {refreshToken} = req.body;

    const tokens = await authService.refresh(refreshToken);

    if (tokens == null) {
        return res.status(401).json({error: "Invalid or expired refresh token. Please login again"});
    }

    res.status(200).json(tokens);
}