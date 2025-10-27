import { describe, it, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { authMiddlware } from "../auth.middleware";

//import { env } from "prisma/config";
import "dotenv/config"
//require('dotenv').config()

function mockRes() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe("auth testing", () => {
  it("returns 401 when Authorization header is missing", async () => {
    const req = { headers: {} } as unknown as Request;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    await authMiddlware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "No Auth Header Provided",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when Authorization header does not start with "Bearer "', async () => {
    const req = {
      headers: { authorization: "Token abc123" },
    } as unknown as Request;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    await authMiddlware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token format" });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when Authorization header start with "Bearer BUT no token"', async () => {
    const req = { headers: { authorization: "Bearer " } } as unknown as Request;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    await authMiddlware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No token found" });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when JWT is invalid or not Kinde generated"', async () => {
    const req = {
      headers: { authorization: "Bearer dcdcsdcsdcsdc " },
    } as unknown as Request;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    await authMiddlware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid JWT" });
    expect(next).not.toHaveBeenCalled();
  });

  it("Calls next and no error is thrown", async () => {
    const req = {
      headers: { authorization: `Bearer ${process.env.KINDE_JWT}`},
    } as unknown as Request;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    await authMiddlware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
