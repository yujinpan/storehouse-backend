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
    if (err)
      return res.json({
        state: false,
        msg: err
      });
    res.json({
      state: true,
      total: reduce(
        pvs,
        (acc, curr) => {
          return acc + curr.toObject().total;
        },
        0
      )
    });
  });
};

/**
 * GET /pv/set
 * home page.
 */
export let setPageViews = (req: Request, res: Response) => {
  const query = { date: req.body.date || new Date().toLocaleDateString() };
  PageViews.find(query, (err, pvs) => {
    if (err) {
      return res.json({
        state: false,
        msg: err
      });
    }

    // 更新或者添加回调
    const next = (err?: any) => {
      if (err) {
        return res.json({
          state: false,
          msg: err
        });
      }
      PageViews.count({}, (err, total) => {
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
      const curr = pvs.find((pv: any) => pv.toObject().ip === req.ip);
      if (curr) {
        return next();
      }
    }
    const pvOnce = new PageViews({
      date: query.date,
      ip: req.ip
    });
    pvOnce.save(next);
  });
};
