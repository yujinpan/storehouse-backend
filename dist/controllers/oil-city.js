"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const OilCity_1 = __importDefault(require("../models/OilCity"));
/**
 * POST /oil_city/set
 * 存储今日油价
 */
exports.setOilCity = (data, callback) => {
    const oilCity = new OilCity_1.default({
        date: new Date().toLocaleDateString(),
        list: data
    });
    oilCity.save((err) => {
        if (err)
            callback(err);
    });
};
