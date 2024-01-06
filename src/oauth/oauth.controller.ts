import { Request, Response } from "express";
import { validateLogin, validateLogout, validateSignup, validateToken } from "./oauth.validator";
import * as OauthService from "./oauth.service";
import { NotFoundError, AlreadyRegistered } from "../utils/errors";

export const signupController = async (req: Request, resp: Response) => {
  try {
    const result = validateSignup(req.body);

    if (result.error) {
      return resp.status(400).json({ error: result.error.details });
    }

    const user = result.value;

    const { user: newUser, accessToken } = await OauthService.createUser(user);

    const { id, email } = newUser;

    // Set the access token as a cookie in the response
    setAccessTokenCookie(resp, accessToken);

    return resp.status(201).json({ success: true, id, email });
  } catch (error: any) {
    if (error instanceof AlreadyRegistered) {
      return resp.status(409).json("User already registered");
    } else if (error.status) {
      return resp.status(error.status).json(error.message);
    } else {
      console.error('Unexpected error:', error);
      return resp.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export const loginController = async (req: Request, resp: Response) => {
  try {
      const result = validateLogin(req.body);

      if (result.error) {
          return resp.status(400).json({ error: result.error.details });
      }

      const user = result.value;

      const { user: newUser, accessToken } = await OauthService.loginuser(user);

      const { id, email } = newUser;

      // Set the access token as a cookie in the response
      setAccessTokenCookie(resp, accessToken);

      return resp.status(200).json({ success: true, id, email });
  } catch (error: any) {
      return resp.status(500).json({ error: error.message });
  }
};

export const logoutController = async (req: Request, resp: Response) => {
  try {

    const result = validateLogout(req.body)
    if (result.error) {
      return resp.status(400).json({ error: result.error.details })
    }

    const { refreshToken, accessToken } = result.value;

    await OauthService.logout(refreshToken);

    // Clear the access token cookie in the response
    resp.clearCookie("access_token");

    return resp.status(200).json({ success: true, message: "Logout successful" });
  } catch (error: any) {
    if (error.message === "Invalid or expired refresh token") {
      return resp.status(401).json("Invalid or expired token")
    } else if (error.message === "Invalid token. User not found") {
      return resp.status(404).json("Invalid token. User not found")
    }
      return resp.status(500).json({ error: error.message });
  }
}

function setAccessTokenCookie(resp: Response, accessToken: string) {
  resp.cookie("access_token", accessToken, {
      expires: new Date(Date.now() + 15 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
  });
}

export const refreshController = async (req: Request, resp: Response) => {
  try {
    const result = validateToken(req.body);
    if (result.error) {
      return resp.status(400).json({ error: result.error.details })
    }

    const token: { token: string } = result.value

    const { accessToken, user } = await OauthService.refresh(token.token);

    resp.cookie("access_token", accessToken, {
        expires: new Date(Date.now() + 15 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

      return resp.status(200).json({ user });

  } catch (error: any) {
    if (error.message === "Error getting data from Redis") {
      return resp.status(500).json(`Error getting data from Redis: ${error.message}`)

    } else if (error.message === "Invalid token") {
      return resp.status(401).json(`Invalid token: ${error.message}`)
    }
      return resp.status(500).json({ error: error.message });
  }
};

export const get_token = async (req: Request, resp: Response) => {
  try {
    const token = req.params.token

    const user = await OauthService.verifyEmail(token);

    if (!user) {
      return resp.status(404).json("No user associated with the token");
    }

    return resp.status(200).json({ success: true, message: "Token successfully received and processed" });
  } catch (error: any) {
    if (error.status) {
      return resp.status(error.status).json(error.message);
    }
    return resp.status(500).json("Internal server error");
  }
};

export const password_reset = async (req: Request, resp: Response) => {
  try {
    const { username, email } = req.body;

    // Validate the request body
    if (!username && !email) {
      return resp.status(400).json({ error: "Username or email is required" });
    }

    await OauthService.resetPassword(username || email);

    return resp.status(200).json({ success: true, message: "Password reset initiated successfully" });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return resp.status(404).json({ error: "Username or email not found" });
    } else if (error.status) {
      return resp.status(error.status).json({ error: error.message });
    }

    return resp.status(500).json({ error: "Internal server error" });
  }
};
