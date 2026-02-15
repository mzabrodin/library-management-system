import {Request, Response} from 'express';
import {UserDto} from "../schemas/user.schema";
import {userService} from "../services/user.service";

type UserParams = {
    id: string;
}

export function getAllUsers(_: Request, res: Response) {
    res.status(200).json(userService.findAll());
}

export function getUserById(req: Request<UserParams>, res: Response) {
    const user = userService.findById(req.params.id);

    if (!user) {
        return res.status(404).json({error: "User not found"});
    }

    res.status(200).json(user);
}

export function createUser(req: Request<{}, {}, UserDto>, res: Response) {
    if (userService.existsByEmail(req.body.email)) {
        return res.status(400).json({error: "User with this email already exists"});
    }

    const user = userService.create(req.body)
    res.status(201).json(user);
}