import { Request, Response } from "express";
import * as UserService from "../users/users.service";
import { getUser } from "../utils/helpers";
import { ForbiddenError, NotFoundError, UserNotSignedIn, WrongPassword } from "../utils/errors";
import { validateEditUser, validateId, validatePasswordReset } from "./users.validator";

export const getUsers = async (req: Request, resp: Response) => {
    try {
        const { role } = await getUser(req) ?? { role: null };

        if (role !== 'ADMIN') {
            return resp.status(403).json({ error: "You are not authorised to access" })
        }
        const users = await UserService.allusers();

        if (!users) {
            return resp.status(500).json({ error: "Error fetching users" });
        }

        return resp.status(200).json({ success: true, users });
    } catch (error: any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in"})
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "User not found"})
        } else if (error.status) {
            return resp.status(error.status).json({ error: error.message })
        }
        return resp.status(500).json({ error: "Internal server error" });
    }
};

export const getUserById = async (req: Request, resp: Response) => {
    try {
        const { role } = await getUser(req) ?? { role: null };
        if (role !== 'ADMIN') {
            return resp.status(403).json({ error: "You are not authorised to access" })
        }
        const result = validateId({ id: req.params.id })
        if (result.error) {
            return resp.status(400).json({ error: result.error.details })
        }
        const { id } = result.value
        
        const user = await UserService.userById(id);

        if (!user) {
            return resp.status(404).json({ error: "User not found" });
        } else {
            return resp.status(200).json({ success: true, user });
        }
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "User not found" });
        } else {
            return resp.status(500).json({ error: error.message });
        }
    }
};

export const editUserById = async (req:Request, resp:Response) => {
    try {
        const { userId } = await getUser(req)
        const results = validateEditUser(req.body)
        if (results.error) {
            return resp.status(400).json({ error: results.error.details })
        }
        const { username, email, phone, avatar } = results.value
        const edited = await UserService.editUser(userId, username, email, phone, avatar)
        return resp.status(200).json({ success:true, edited})
    } catch (error:any) {
        if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "User not found"})
        } else if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in"})
        }
        return resp.status(500).json({ error: "Internal server error"})
    }
}

export const editUserPassword =async (req:Request, resp:Response) => {
    try {
        const { userId } = await getUser(req)
        const result = validatePasswordReset(req.body)
        if (result.error) {
            return resp.status(400).json({ error: result.error.details })
        }
        const { old_password, password, confirm_password } = result.value
        const updated = await UserService.edit_user_password(userId, old_password, password, confirm_password)
        return resp.status(200).json({ success:true, updated })
    } catch (error:any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in"})
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "User not found"})
        } else if (error.status) {
            return resp.status(error.status).json({ error: error.message })
        } else if (error instanceof WrongPassword) {
            return resp.status(403).json({ error: "You entered the wrong password"})
        }
        return resp.status(500).json({ error: "Internal server error" });
    }
}

export const delUser = async (req: Request, resp: Response) => {
    try {
        const { role } = await getUser(req) ?? { role: null };
        if (role !== 'ADMIN') {
            return resp.status(403).json({ error: "You are not authorised to delete" })
        }
        const result = validateId({ id: req.params.id })
        if (result.error) {
            return resp.status(400).json({ error: result.error.details })
        }
        const { id } = result.value

        await UserService.deleteUser(id)
        return resp.status(204).json()
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "User profile not found" })
        } else if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "User not signed in" })
        } else if (error instanceof ForbiddenError) {
            return resp.status(403).json()
        }
        return resp.status(500).json({ error: error.message });
    }
};
