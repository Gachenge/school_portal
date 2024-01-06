import { Request, Response } from "express";
import * as UserService from "../users/users.service";
import { getUser } from "../utils/helpers";
import { ForbiddenError, NotFoundError, UserNotSignedIn } from "../utils/errors";

export const getUsers = async (req: Request, resp: Response) => {
    const { role } = await getUser(req) ?? { role: null };

    if (role !== 'ADMIN') {
        return resp.status(403).json({ error: "You are not authorised to access" })
    }
    try {
        const users = await UserService.allusers();

        if (!users) {
            return resp.status(500).json({ error: "Error fetching users" });
        }

        return resp.status(200).json({ success: true, users });
    } catch (error: any) {
        if (error.status) {
            return resp.status(error.status).json({ error: error.message })
        }
        return resp.status(500).json({ error: "Internal server error" });
    }
};

export const getUserById = async (req: Request, resp: Response) => {
    const { role } = await getUser(req) ?? { role: null };
    if (role !== 'ADMIN') {
        return resp.status(403).json({ error: "You are not authorised to access" })
    }
    const id = req.params.id;
    try {
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

export const editUserById = async (req: Request, resp: Response) => {
    const id = req.params.id;

    try {
        const { userId } = await getUser(req) ?? { userId: null };
        if (id !== userId) {
            return resp.status(401).json({ error: "You are not allowed to edit"})
        }
    } catch(error: any) {
        if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "User profile not found" })
        } else if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "User not signed in" })
        }
        resp.status(500).json({ error: error.message })
    }

    const updatedUserDetails = req.body;

    try {
        const user = await UserService.userById(id);
        if (!user) {
            return resp.status(404).json({ error: "User not found" });
        }

        const updatedUser = await UserService.editUser(id, updatedUserDetails);

        // Destructure the user object and create a new object without the password field
        const { password, ...userWithoutPassword } = updatedUser;

        resp.status(200).json({ success: true, user: userWithoutPassword });
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "User not found" })
        } 
        resp.status(500).json({ error: error.message });
    }
};

export const delUser = async (req: Request, resp: Response) => {
    const { role } = await getUser(req) ?? { role: null };
    if (role !== 'ADMIN') {
        return resp.status(403).json({ error: "You are not authorised to delete" })
    }
    const id = req.params.id;

    try {
        const delUser = await UserService.deleteUser(id)
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

    try {
        const deletedUser = await UserService.deleteUser(id);

        return resp.status(204).json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "User not found" });
        }
        console.error("Error deleting user: ", error.message);
        return resp.status(500).json({ error: "Internal server error" });
    }
};
