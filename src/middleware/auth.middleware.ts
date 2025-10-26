import {
  validateToken,
  type jwtValidationResponse,
} from "@kinde/jwt-validator";
import type { NextFunction, Request, Response } from "express";
import { decodeJwt } from "jose";

export const authMiddlware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Auth middleware used...");

  const authHeader = req.headers.authorization;

  //FIRST to token or incorrect token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No token found");
    return res.status(401).json({ message: "No token provided" });
  }

  //SECOND get token
  const token = authHeader.split(" ")[1]; //will return token and discard Bearer word
  if (!token) throw new Error("No token found");

  console.log(`Token extracted, ${token}`);

  //THIRD validate if comes from KINDE
  try {
    const validationResult = await validateToken({
      token,
      domain: "https://altacios.kinde.com",
    });
    //{valid:boolean, message:"Token is valid"/"JWK not found"}
    if (!validationResult.valid) {
      console.log(validationResult.message);
      return res.status(403).json({ message: "Invalid token" });
    }
    console.log(validationResult.message);
    //FOURTH decode token to get Kinde userId
    const claims = decodeJwt(token);
    console.log("decoded jwt:", claims);

    if (!claims.sub) {
      throw new Error("Token is missing sub (user id)");
    }

    //FIFTH add to req
    req.userId = claims.sub;
    console.log("userId: ", req.userId);

    next();
  } catch (err) {
    console.error("Error validating token:", err);
    return res.status(500).json({ message: "Token validation failed" });
  }
};
