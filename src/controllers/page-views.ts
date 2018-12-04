import { Request, Response, NextFunction } from "express";
import { default as PageViews, PageViewsModel } from "../models/PageViews";
import reduce from "lodash/reduce";

/**
 * GET /pv/set
 * home page.
 */
export let getPageViews = (req: Request, res: Response) => {
    const query = req.body.date ? { date: req.body.date } : {};
    PageViews.find(query, (err, pvs) => {
        if (err) return res.json({
            state: false,
            msg: err
        });
        res.json({
            state: true,
            total: reduce(pvs, (acc, curr) => {
                return acc + curr.toObject().total;
            }, 0)
        });
    });
};

/**
 * GET /pv/set
 * home page.
 */
export let setPageViews = (req: Request, res: Response) => {
    const query = { date: req.body.date || new Date().toLocaleDateString() };
    PageViews.findOne(query, (err, pvs) => {
        if (err) return res.json({
            state: false,
            msg: err
        });

        // 更新或者添加回调
        const next = (err: any) => {
            if (err) return res.json({
                state: false,
                msg: err
            });
            PageViews.find({}, (err, pvs) => {
                if (err) return res.json({
                    state: false,
                    msg: err
                });
                res.json({
                    state: true,
                    total: reduce(pvs, (acc, curr) => {
                        return acc + curr.toObject().total;
                    }, 0)
                });
            });
        };

        // 如果查到有数据就更新数据
        // 否则添加一条新数据
        if (pvs) {
            PageViews.updateOne(pvs, { total: pvs.toObject().total + 1 }, next);
        } else {
            const pvOnce = new PageViews({
                date: query.date,
                total: 0
            });
            pvOnce.save(next);
        }
    });
};