import {Request, Response} from 'express';
import {UserDto} from "../schemas/user.schema";
import {userService} from "../services/user.service";

type UserParams = {
    id: string;
}

export async function getAllUsers(_: Request, res: Response) {
    const users = await userService.findAll();
    return res.status(200).json(users);
}

export async function getUserById(req: Request<UserParams>, res: Response) {
    const user = await userService.findById(req.params.id);

    if (user == null) {
        return res.status(404).json({error: "User not found"});
    }

    res.status(200).json(user);
}

export async function createUser(req: Request<{}, {}, UserDto>, res: Response) {
    const existsByEmail = await userService.existsByEmail(req.body.email);
    if (existsByEmail) {
        return res.status(400).json({error: "User with this email already exists"});
    }

    const user = await userService.create(req.body)
    res.status(201).json(user);
}