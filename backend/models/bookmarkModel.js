import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    mealplan:{type:mongoose.Schema.Types.ObjectId,ref:'MealPlan',required:true}
},{timestamps:true});

const Bookmark = mongoose.model('Bookmark',bookmarkSchema);

export default Bookmark;