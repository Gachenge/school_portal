import { db } from "../utils/db.server";
import { NotFoundError, WrongPassword } from "../utils/errors";
import { sendVerificationEmail } from "../utils/helpers";
import * as bcrypt from 'bcrypt';

type User = {
    id: string,
    username: string,
    email: string,
    isActive: boolean
    role: string
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
            select: {
                id:true,
                isActive:true,
                username:true,
                email:true,
                phone:true,
                avatar:true,
                role:true
            }
        });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return user;

    } catch (error: any) {
        throw error
    }
};

export const editUser = async (id: string, username: string, email: string, phone: string, avatar: string) => {
    try {
        const user = await userById(id);
        
        const updateUser = await db.user.update({
            where: { id },
            data: {
                username,
                email,
                phone,
                avatar,
            }
        });

        if (email !== user.email) {
            const activate = await sendVerificationEmail(email, id);
            await db.user.update({
                where: { id },
                data: {
                    isActive: false
                }
            })
        }
    } catch (error: any) {
        throw error;
    }
};

export const edit_user_password =async (id:string, old_password:string, passwords:string, confirm_password:string) => {
    try {
        const user = await db.user.findUnique({ where: { id }})
        if (!user) {
            throw new NotFoundError("User not found")
        }
        
        const isPasswordValid = await bcrypt.compare(old_password, user.password);
        if (!isPasswordValid) {
            throw new WrongPassword()
        }

        const updateUser = await db.user.update({
            where: { id },
            data: {
                password: await bcrypt.hash(passwords, 10)
            }
        })

    } catch (error:any) {
        
    }
}


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
