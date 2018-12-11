"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const PageViews_1 = __importDefault(require("../models/PageViews"));
const reduce_1 = __importDefault(require("lodash/reduce"));
/**
 * GET /pv/set
 * home page.
 */
exports.getPageViews = (req, res) => {
    const query = req.body.date ? { date: req.body.date } : {};
    PageViews_1.default.find(query, (err, pvs) => {
        if (err)
            return res.json({
                state: false,
                msg: err
            });
        res.json({
            state: true,
            total: reduce_1.default(pvs, (acc, curr) => {
                return acc + curr.toObject().total;
            }, 0)
        });
    });
};
/**
 * GET /pv/set
 * home page.
 */
exports.setPageViews = (req, res) => {
    const query = { date: req.body.date || new Date().toLocaleDateString() };
    PageViews_1.default.find(query, (err, pvs) => {
        if (err) {
            return res.json({
                state: false,
                msg: err
            });
        }
        // 更新或者添加回调
        const next = (err) => {
            if (err) {
                return res.json({
                    state: false,
                    msg: err
                });
            }
            PageViews_1.default.count({}, (err, total) => {
                if (err) {
                    return res.json({
                        state: false,
                        msg: err
                    });
                }
                return res.json({
                    state: true,
                    total: total
                });
            });
        };
        // 如果查到该 ip 有数据，就不保存信息
        // 否则添加一条新数据
        if (pvs && pvs.length) {
            const curr = pvs.find((pv) => pv.toObject().ip === req.ip);
            if (curr) {
                return next();
            }
        }
        const pvOnce = new PageViews_1.default({
            date: query.date,
            ip: req.ip
        });
        pvOnce.save(next);
    });
};
