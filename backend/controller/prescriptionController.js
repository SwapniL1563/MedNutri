import Prescription from "../models/prescriptionModel.js";
import { scheduledAllReminders } from "../utils/reminderCron.js";


// create new prescription
export const createPrescription = async(req,res) => {
    const { dosage , medications , frequency , timing , notes, email } = req.body;

    try {
        const prescription = await Prescription.create({
        user:req.user._id,
        medications,
        dosage,
        frequency,
        timing,
        notes,
        email:email
    }); 
    
    await scheduledAllReminders(prescription); 

    res.status(201).json({
        "msg":"New prescription created successfully"
    })
    } catch (error) {
    console.error("Create Prescription Error:", error.message);
    res.status(500).json({
    error: "Failed to create prescription",
    message: error.message,
  });
    }
}

// fetch all the prescriptions of logged user
export const getPrescriptions = async(req,res) => {
    try {
    const prescriptions = await Prescription.find({user:req.user._id});
    res.status(200).json(prescriptions);
    } catch (error) {
    res.status(500).json({
        error:"Unable to fetch prescriptions",        
        message:error.message
    })  
    }
}

// update prescriptons of the logged user
export const updatePrescriptions = async(req,res) => {
    try {
      const updated = await Prescription.findByIdAndUpdate({
       _id:req.params.id, user:req.user._id
      },req.body,{new:true});

      res.status(201).json(updated);
    } catch (error) {
    res.status(500).json({
        error:"Unable to update prescriptions"
    });
    }
}

// delete prescriptions for logged user
export const deletePrescriptions = async(req,res) => {
    try {
        await Prescription.findByIdAndDelete({
            _id:req.params.id,user:req.user._id
        });
        res.json({
            "msg":"Prescriptions deleted successsfully"
        })
    } catch (error) {
        res.json({
            error:"Unable to delete prescriptions"
        })
    }
}
