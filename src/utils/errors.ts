import { logger } from "./logger";
import moment from 'moment';

const logTimestamp = () => moment().format('YYYY-MM-DD HH:mm:ss');

export const warningLog = (warns: any) => {
    logger.warn(`${logTimestamp()} Warning: ${warns.message}`);
};

export const errorLog = (errors: any) => {
    logger.error(`${logTimestamp()} Error: ${errors.message}`);
};

export class AlreadyRegistered extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AlreadyRegistered";
        warningLog(this);
    }
}

export class RedisClosed extends Error {
    constructor() {
        super("Redis client is closed");
        this.name = "RedisClosed";
        warningLog(this);
    }
}

export class UnexpectedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnexpectedError';
        errorLog(this);
    }
}

export class InvalidToken extends Error {
    constructor() {
        super("Invalid token");
        this.name = "InvalidToken";
        errorLog(this);
    }
}

export class WrongPassword extends Error {
    constructor() {
        super("Wrong password");
        this.name = "WrongPassword";
        errorLog(this);
    }
}

export class UserNotSignedIn extends Error {
    constructor() {
        super("You are not logged in");
        this.name = "UserNotSignedIn";
        warningLog(this);
    }
}

export class ForbiddenError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ForbiddenError";
        errorLog(this);
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
        warningLog(this);
    }
}

export class TokenGenerationError extends Error {
    constructor() {
        super("Token generation failed")
        this.name = "TokenGenerationError"
        errorLog(this)
    }
}

export class TokenVerificationError extends Error {
    constructor(message: string) {
        super("Token verification failed")
        this.name = "TokenVerificationError"
        errorLog(this)
    }
}

export class UserNotVerified extends Error {
    constructor() {
        super("User is not verified")
        this.name = "UserNotVerified"
        warningLog(this)
    }
}

export class UserHasOverdueBooks extends Error {
    constructor() {
        super("User has overdue books")
        this.name = "OverdueBooks"
        errorLog(this)
    }
}

export class BookExists extends Error {
    constructor() {
        super("Book already exists")
        this.name = "BookExists"
        errorLog(this)
    }
}

export class BookNotAvailable extends Error {
    constructor() {
        super("Book is not available")
        this.name = "BookUnavailable"
        warningLog(this)
    }
}
