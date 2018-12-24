import mongoose from "mongoose";
export type PageViewsModel = mongoose.Document & {
    date: String,
    ip: String,
    times: String
};

const pageViewsSchema = new mongoose.Schema({
    date: String,
    ip: String,
    times: String
});

const PageViews = mongoose.model("PageViews", pageViewsSchema);
export default PageViews;