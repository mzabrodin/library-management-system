import {Request, Response} from 'express';
import {db} from "../storage/db";
import {UserDto} from "../schemas/userSchema";
import {User} from "../types";

type UserParams = {
    id: string;
}

export function getAllUsers(req: Request, res: Response) {
    const users = Array.from(db.users.values());
    res.status(200).json(users);
}

export function getUserById(req: Request<UserParams>, res: Response) {
    const id = req.params.id;
    const user = db.users.get(id);

    if (!user) {
        return res.status(404).json({error: "User not found"});
    }

    res.status(200).json(user);
}

export function createUser(req: Request<{}, {}, UserDto>, res: Response) {
    const {name, email} = req.body;

    const emailExists = Array.from(db.users.values()).some(user => user.email === email);
    if (emailExists) {
        return res.status(400).json({error: "User with this email already exists"});
    }

    const id = crypto.randomUUID();
    const user: User = {
        id,
        name,
        email
    }

    db.users.set(id, user);

    res.status(201).json(user);
}