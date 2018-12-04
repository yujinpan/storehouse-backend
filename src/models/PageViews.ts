import mongoose from "mongoose";
export type PageViewsModel = mongoose.Document & {
    date: String,
    total: Number
};

const pageViewsSchema = new mongoose.Schema({
    date: String,
    total: Number
});

const PageViews = mongoose.model("PageViews", pageViewsSchema);
export default PageViews;