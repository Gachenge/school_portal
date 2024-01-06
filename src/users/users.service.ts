import { Role } from "@prisma/client";
import { db } from "../utils/db.server";
import { UnexpectedError, NotFoundError } from "../utils/errors";

type User = {
    id: string,
    username: string,
    email: string,
    isActive: boolean
    role: string
}

type EditUser = {
    id?: string,
    username?: string,
    email?: string,
    isActive?: boolean,
    profile?: {
        role?: Role
        emailToken?: string
    }
}

export const allusers = async (): Promise<User[]> => {
    try {
        const users = await db.user.findMany();

        const userDetails = users.map((user) => {
            const { id, username, email, isActive, role } = user;

            return {
                id,
                username,
                email,
                isActive,
                role,
            };
        });

        return userDetails;
    } catch (error: any) {
        throw error
    }
};

export const userById = async (id: string): Promise<User> => {
    try {
        const user = await db.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        const { id: userId, username, email, isActive, role } = user;

        return {
            id: userId,
            username,
            email,
            isActive,
            role,
        };
    } catch (error: any) {
        throw error
    }
};

export const editUser = async (id: string, updatedDetails: EditUser) => {
    try {
        const existingUser = await db.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            throw new NotFoundError("User not found");
        }

        // Filter out immutable fields from the updated details
        const { id: userId, isActive, ...filteredUpdatedDetails } = updatedDetails;

        // Perform the update with the filtered updated details
        const updatedUser = await db.user.update({
            where: { id },
            data: {
                ...existingUser,
                ...filteredUpdatedDetails,
            },
        });

        return updatedUser
    } catch (error: any) {
        throw error
    }
};

export const deleteUser = async (id: string) => {
    try {
        const user = await db.user.findUnique({ where: { id } });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        await db.user.delete({ where: { id } });
    } catch (error: any) {
        throw error
    }
};
