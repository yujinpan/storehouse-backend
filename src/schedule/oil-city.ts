/**
 * 获取每日的全国城市油价计划任务
 */
import { scheduleJob } from "node-schedule";
import { default as http, RequestOptions } from "http";

import { OilCityData } from "../models/OilCity";
import { setOilCity } from "../controllers/oil-city";

/**
 * 计划任务执行参数（每日 7:30 分）
 * @param scheduleJob 参数：
 * s    m    h    d    M    week
 * 0-59 0-59 0-23 1-31 1-12 0-7
 */
const scheduleParams = "0 7 16 * * *";

/**
 * 请求油价列表接口参数
 */
const options: RequestOptions = {
  hostname: "apis.juhe.cn",
  path: "/cnoil/oil_city?key=020c973082896b965ef687d5dbbedaf6"
};

// init
doPlan();

/**
 * 每日获取油价
 */
function doPlan() {
  scheduleJob(scheduleParams, () => {
    getList(options, (result: any) => {
      if (result instanceof Array) {
        setOilCity(result, (err: any) => {
          console.log(err);
        });
      } else {
        console.log(result);
      }
    });
  });
}

/**
 * 获取今日油价列表
 * @param options 请求参数配置
 */
function getList(options: RequestOptions, callback: any) {
  const req = http
    .get(options, res => {
      let rawData = "";
      res.on("data", chunk => {
        rawData += chunk;
      });
      res.on("end", () => {
        let result;
        try {
          result = JSON.parse(rawData);
        } catch (e) {
          console.log(e);
          return callback(rawData);
        }
        if (result.resultcode === "200") {
          callback(result.result);
        } else {
          callback(result.reason);
        }
      });
    })
    .on("error", e => {
      console.error(`Got error: ${e.message}`);
    });
  req.end();
}
