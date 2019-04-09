/**
 * about API
 */
import { Request, Response } from "express";
import { default as https } from "https";
import { IncomingMessage } from "http";

const options = {
  hostname: "raw.githubusercontent.com",
  path: "/yujinpan/CV/master/README.md"
};

// /api/about
export const about = (req: Request, res: Response) => {
  const request = https
    .get(options, (request: IncomingMessage) => {
      let resRaw: string = "";
      request.on("data", (data) => {
        resRaw += data;
      });
      request.on("end", () => {
        res.json({
          state: true,
          data: resRaw
        });
      });
      request.on("error", (e) => {
        res.json({
          state: false,
          message: e.message
        });
      });
    })
    .on("error", (e) => {
      res.json({
        state: false,
        message: e.message
      });
    });
  request.end();
};
