import type { JwtPayload } from "jsonwebtoken";
import {UserRole} from "../generated/prisma/enums";

interface JWT extends JwtPayload {
    id: string;
    email: string;
    role: UserRole;
}

export default JWT;