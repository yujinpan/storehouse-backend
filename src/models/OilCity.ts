import mongoose from "mongoose";

export interface OilCityData {
  city: string;
  b90: string;
  b93: string;
  b97: string;
  b0: string;
  "92h": string;
  "95h": string;
  "98h": string;
  "0h": string;
}

export type OilCityModel = mongoose.Document & {
  date: String;
  list: OilCityData[];
};

const oilCitySchema = new mongoose.Schema({
  date: String,
  list: []
});

const OilCity = mongoose.model("OilCity", oilCitySchema);
export default OilCity;
