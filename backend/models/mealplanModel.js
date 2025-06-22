import mongoose from "mongoose";

const mealPlanSchema = new mongoose.Schema({
    user:{ type:mongoose.Schema.Types.ObjectId,ref:'User'},
    preferences:[String],
    allergies:[String],
    goal:{type:String,required:true},
    age:Number,
    gender:String,
    plan:String
},{ timestamps:true});

const mealPlan = mongoose.model('MealPlan',mealPlanSchema);

export default mealPlan;