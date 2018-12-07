"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 获取每日的全国城市油价计划任务
 */
const node_schedule_1 = require("node-schedule");
const http_1 = __importDefault(require("http"));
const oil_city_1 = require("../controllers/oil-city");
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
const options = {
    hostname: "apis.juhe.cn",
    path: "/cnoil/oil_city?key=020c973082896b965ef687d5dbbedaf6"
};
// init
doPlan();
/**
 * 每日获取油价
 */
function doPlan() {
    node_schedule_1.scheduleJob(scheduleParams, () => {
        getList(options, (result) => {
            if (result instanceof Array) {
                oil_city_1.setOilCity(result, (err) => {
                    console.log(err);
                });
            }
            else {
                console.log(result);
            }
        });
    });
}
/**
 * 获取今日油价列表
 * @param options 请求参数配置
 */
function getList(options, callback) {
    const req = http_1.default
        .get(options, res => {
        let rawData = "";
        res.on("data", chunk => {
            rawData += chunk;
        });
        res.on("end", () => {
            let result;
            try {
                result = JSON.parse(rawData);
            }
            catch (e) {
                return callback(e);
            }
            if (result.resultcode === "200") {
                callback(result.result);
            }
            else {
                callback(result.reason);
            }
        });
    })
        .on("error", e => {
        console.error(`Got error: ${e.message}`);
    });
    req.end();
}
