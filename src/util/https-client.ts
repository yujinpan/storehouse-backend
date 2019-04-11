import https from "https";
import { IncomingMessage } from "http";

export const httpsClient = {
  get(options: https.RequestOptions | URL | string): Promise<any> {
    return new Promise((resolve, reject) => {
      const req = https
        .get(options, (request: IncomingMessage) => {
          let resRaw: string = "";
          request.on("data", (data) => {
            resRaw += data;
          });
          request.on("end", () => {
            // try toJSON
            let resultJsonStr = resRaw;
            try {
              resultJsonStr = JSON.parse(resultJsonStr);
            } catch (e) {}

            // return
            resolve({
              state: true,
              data: resultJsonStr
            });
          });
          request.on("error", (e) => {
            resolve({
              state: false,
              message: e.message
            });
          });
        })
        .on("error", (e) => {
          resolve({
            state: false,
            message: e.message
          });
        });
      req.end();
    });
  }
};
