import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    name:{ type:String,required:true },
    email:{ type:String,required:true,unique:true },
    password:{ type:String,required:true },
    age:{ type:Number },
    gender:{ type:String },
    country:{type:String,default:"India"},
    preferences:[String],
    allergies:[String],
    consent:{ type:Boolean,required:true }
},{ timestamps:true });

const User = mongoose.model('User',userSchema);

export default User;