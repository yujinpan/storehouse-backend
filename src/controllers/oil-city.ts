import { Request, Response, NextFunction } from "express";
import {
  default as OilCity,
  OilCityData,
  OilCityModel
} from "../models/OilCity";

/**
 * POST /oil_city/set
 * 存储今日油价
 */
export let setOilCity = (data: OilCityData[], callback: any) => {
  const oilCity = new OilCity({
    date: new Date().toLocaleDateString(),
    list: data
  });
  oilCity.save((err: any) => {
    if (err) callback(err);
  });
};
