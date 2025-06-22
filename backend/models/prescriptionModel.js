import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    medications:{type:String,required:true},
    dosage:String,
    frequency:{type:String,default:'Daily'},
    timing:[{type:String,required:true}],
    notes:String,
    email: {type: String, required: true},

},{
    timestamps:true
});

const prescriptionModel = mongoose.model('Prescription',prescriptionSchema);

export default prescriptionModel;