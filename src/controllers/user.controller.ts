import {Request, Response} from 'express';
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

export async function getCurrentUser(req: Request, res: Response) {
    const user = await userService.findById(req.user!.id);

    if (user == null) {
        return res.status(404).json({error: "User not found"});
    }

    res.status(200).json(user);
}