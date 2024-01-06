import jwt from 'jsonwebtoken';
import { Response, Request } from 'express';
import { db } from '../utils/db.server';
import { UserNotSignedIn, NotFoundError, TokenVerificationError } from './errors';
import { sendEmail } from './mailer';

const secret: string = process.env.SECRET || '';

if (!secret) {
    throw new Error('Secret not provided. Set the SECRET environment variable.');
}

export const getUser = async (req: Request) => {
    const token = req.cookies['access_token'];

    if (!token) {
        throw new UserNotSignedIn()
    }

    try {
        const decodedToken: any = jwt.verify(token, secret);
        const userId = decodedToken.userId;
        if (!userId) {
            throw new UserNotSignedIn()
        }

        // Use the user ID from the token in the findUnique call
        const user = await db.user.findUnique({
            where: { id: userId },
        });

        // Check if user exist before accessing properties
        if (!user) {
            throw new NotFoundError("User profile not found");
        }

        const role = user.role;

        return { userId, role };
    } catch (error: any) {
        throw error
    }
};

export async function sendVerificationEmail(email: string, userId: string): Promise<void> {
    const verificationToken = generateToken({ userId: userId }, '2d');
    const verificationText = `http://localhost:8000/api/oauth/verify_email/${verificationToken}`
    await sendEmail(email, "Verify your email address", verificationText);
}

export const generateToken = (payload: object, expiresIn?: string | number | undefined): string => {
    const options: jwt.SignOptions = expiresIn !== undefined ? { expiresIn } : {};
    return jwt.sign(payload, secret, options);
};

export const verifyToken = async (token: any): Promise<any> => {
    try {
        // Verify the token
        const decodedToken: any = jwt.verify(token, secret);

        const userId = decodedToken.userId;


        // Activate the user's account
        const user = await db.user.update({
            where: { id: userId },
            data: {
                isActive: true,
            },
        });

        return user;
    } catch (error: any) {
        console.error(error.message)
        throw new TokenVerificationError('Invalid or expired token');
    }
};

export async function sendPasswordResetEmail(email: string, userId: string): Promise<void> {
    const verificationToken = generateToken({ userId: userId }, '2d');
    const verificationText = `http://localhost:8000/api/oauth/verify_email/${verificationToken}`
    await sendEmail(email, "Reset your password", verificationText);
}
