/**
 * 获取每日的全国城市油价计划任务
 */
import { scheduleJob } from "node-schedule";
import { default as http, RequestOptions } from "http";

import { setOilCity } from "../controllers/oil-city";
import { httpsClient } from "../util/https-client";

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
    httpsClient.get(options).then((result) => {
      if (
        result.state &&
        result.data &&
        result.data.result &&
        result.data.result.length
      ) {
        setOilCity(result.data.result, (err: any) => {
          console.log("存储油价列表失败", err);
        });
      } else {
        console.log("获取油价列表失败", result);
      }
    });
  });
}
