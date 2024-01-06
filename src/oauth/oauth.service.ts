import { db } from "../utils/db.server";
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { redis } from "../utils/redis";
import { v4 as uuidv4 } from 'uuid';
import { InvalidToken, RedisClosed, UnexpectedError,
    AlreadyRegistered, NotFoundError, WrongPassword } from "../utils/errors";
import { generateToken, sendPasswordResetEmail, sendVerificationEmail, verifyToken } from "../utils/helpers";


type User = {
    id: string;
    username: string;
    email: string;
    password: string;
}

type UserResponse = {
    user: Omit<User, "password">;
    accessToken: string;
    refreshToken: string;
}

const secret: string = process.env.SECRET || '';

if (!secret) {
    throw new Error('Secret not provided. Set the SECRET environment variable.');
}

export const createUser = async (user: User): Promise<UserResponse> => {
    try {
        // Check if the user is registered
        const userExist = await db.user.findUnique({ where: { email: user.email } });
        if (userExist) {
            throw new AlreadyRegistered("Email is already registered");
        }

        const usernameExist = await db.user.findUnique({ where: { username: user.username } });
        if (usernameExist) {
            throw new AlreadyRegistered("Username is already registered");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Generate a new access token
        const accessToken = generateToken({ userId: user.id }, '15m');

        // Generate refresh token
        const refreshToken = generateToken({ userId: user.id }, '2d');

        // Save the user data in the database
        const createdUser = await db.user.create({
            data: {
                email: user.email,
                username: user.username,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                username: true,
            },
        });

        // Save the refresh token in Redis with 2-day expiration
        if (redis.status === 'end') {
            throw new RedisClosed();
        } else {
            await redis.set(refreshToken, createdUser.id.toString(), 'EX', 60 * 60 * 24 * 2);
            console.log('Refresh token stored in Redis.');
        }

        // Send email verification token
        await sendVerificationEmail(createdUser.email, createdUser.id);

        return {
            user: createdUser,
            accessToken,
            refreshToken,
        };
    } catch (error) {
        throw error;
    }
};


export const loginuser = async (user: User): Promise<UserResponse> => {
    let { username, password } = user;

    const savedUser = await db.user.findUnique({ where: { username } });
      
    if (!savedUser) {
        throw new NotFoundError("User not found")
    }
    const isPasswordValid = await bcrypt.compare(password, savedUser.password);
    if (!isPasswordValid) {
        throw new WrongPassword()
    }

    // Generate a new access token
    const accessToken = jwt.sign({ userId: savedUser.id }, secret, {
    expiresIn: '15m',
    });

    // Generate refresh token
    const refreshToken = jwt.sign({ userId: savedUser.id }, secret, {
        expiresIn: '2d',
    });

    // Save the refresh token in Redis with 2-day expiration
    try {
        if (redis.status === 'end') {
            throw new RedisClosed()
        } else {
            await redis.set(refreshToken, savedUser.id.toString(), 'EX', 60 * 60 * 24 * 2 );
            console.log('Refresh token stored in Redis.');
        }
    } catch (error: any) {
        throw error
    }

    return {
        user: savedUser,
        accessToken,
        refreshToken,
    };
}

export const logout = async (refreshToken: string): Promise<void> => {
    const userId = await redis.get(refreshToken);

    if (!userId) {
        throw new InvalidToken();
    }

    // Parse the userId as a UUID
    const parsedUserId = uuidv4(userId);

    const user = await db.user.findUnique({ where: { id: parsedUserId } });

    if (!user) {
        throw new NotFoundError("User not found")
    }

    redis.del(refreshToken);
};

export const refresh = async (token: string): Promise<Omit<UserResponse, "refreshToken">> => {
    try {
        let userId;

        try {
            userId = await redis.get(token);
        } catch (error: any) {
            throw new Error(error.message)
        }

        // Parse the userId as a UUID
        const parsedUserId = uuidv4(userId);

        const user = await db.user.findUnique({ where: { id: parsedUserId } });

        if (!user) {
            throw new InvalidToken()
        }

        // Generate a new access token
        const newAccessToken = jwt.sign({ userId: user.id }, secret, {
            expiresIn: '15m',
        });

        return {
            accessToken: newAccessToken,
            user: user,
        };
    } catch (error: any) {
        throw error;
    }
};

export const verifyEmail = async (token: string) => {
    try {
      const user = await verifyToken(token);
  
      if (!user) {
        throw new NotFoundError("No user associated with the provided token")
      }

      return user
    } catch (error: any) {
        throw error;
    }
  };

export const resetPassword = async (user: string) => {
    try {
        const userRecord = await db.user.findFirst({
            where: {
                OR: [
                    { username: user },
                    { email: user },
                ],
            },
        });

        if (!userRecord) {
            throw new NotFoundError("Username or email does not match");
        }

        const { email, id } = userRecord;

        if (!email || !id) {
            throw new UnexpectedError("Invalid user record");
        }

        const reset = await sendPasswordResetEmail(email, id);
    } catch (error: any) {
        throw error;
    }
};
