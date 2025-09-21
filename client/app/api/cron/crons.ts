import { NextApiRequest, NextApiResponse } from "next";
import { sendReminders } from "../workers/sendReminder";

export default async function handler(req: NextApiRequest,
  res: NextApiResponse) {
    try {
        await sendReminders();
        return res.status(200).json({message:"Reminders sent successfully"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:'Failed to send reminders'})
    }
}