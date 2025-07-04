import prescriptionModel from "../models/prescriptionModel.js";
import cron from "node-cron";
import { sendEmailReminder } from "./email.js";

// so it can have cronkey
const scheduledTasks = new Map();

export const scheduledAllReminders = async () => {
  // fetch all prescriptions from user
  const prescriptions = await prescriptionModel.find().populate("user");

  prescriptions.forEach((prescription) => {
    prescription.timing.forEach((time) => {
      const [hourStr, minuteStr] = time.split(":");
      const hour = Number(hourStr);
      const minute = Number(minuteStr);
      
      // validate the time taken as input to set reminders
      if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59 ) {
        throw new Error(`Invalid time "${time}"`);
      }

      const cronkey = `${prescription._id}-${time}`;
      if (scheduledTasks.has(cronkey)) return;  // avoid duplicate prescriptions reminder
      
      // schedule the prescription using nodemailer
      const task = cron.schedule(`${minute} ${hour} * * *`, async () => {
        const email = prescription.email || prescription.user?.email;
        const consent = prescription.user?.consent ?? true;

        if (email && consent) {
        const subject = "⏰ MedNutri Reminder";

        const text = `Hi, Reminder to take: ${prescription.medications} Dosage: ${prescription.dosage || 'As directed'} Notes: ${prescription.notes || 'None'} Stay Healthy! 💚`;

       const html =
       `<div>
         <p>
         <strong>Hi, Reminder:</strong> Take ${prescription.medications} <br/>
         <strong>Dosage:</strong> ${prescription.dosage || 'As directed'}. <br/>
         <strong>Notes:</strong> ${prescription.notes || 'None'}. <br/>
         <strong>Stay Healthy! 💚</strong>
         </p>
        </div>`



          await sendEmailReminder({ to: email, subject,text, html });
        }
      });

      task.start();
      scheduledTasks.set(cronkey, task); 
    });
  });
};
