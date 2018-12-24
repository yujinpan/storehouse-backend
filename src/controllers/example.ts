/**
 * h5-vue API
 */
import { Request, Response } from "express";

// /api/example
export const example = (req: Request, res: Response) => {
  return res.json({
    state: true,
    message: "Hello world!"
  });
};
