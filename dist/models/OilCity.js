"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const oilCitySchema = new mongoose_1.default.Schema({
    date: String,
    list: []
});
const OilCity = mongoose_1.default.model("OilCity", oilCitySchema);
exports.default = OilCity;
