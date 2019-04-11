/**
 * about API
 */
import { Request, Response } from "express";

import { httpsClient } from "../util/https-client";

const options = {
  hostname: "raw.githubusercontent.com",
  path: "/yujinpan/CV/master/README.md"
};

// /api/about
export const about = (req: Request, res: Response) => {
  httpsClient.get(options).then((result) => res.json(result));
};
