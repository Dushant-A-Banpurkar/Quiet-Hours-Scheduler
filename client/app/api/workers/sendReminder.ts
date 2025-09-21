import clientPromise from "@/lib/mongodb";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendReminders() {
  const client = await clientPromise;
  const db = client.db("quiet_scheduler");

  const now = new Date();
  const tenMinLater = new Date(now.getTime() + 10 * 60000);

  const blocks = await db.collection("blocks").find({
    start_time: { $gte: now, $lte: tenMinLater }
  }).toArray();

  for (const block of blocks) {

    const user=await db.collection("users").findOne({_id:block.userId});

    if(!user || !user.email){
      console.log(`User not found or email is missing for block with iD: ${block._id}`);
      continue;
    }

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [user.email],
      subject: "Quiet Hour Reminder ⏰",
      html: `Your quiet hour starts at ${new Date(block.start_time).toLocaleTimeString()}`
    });

    await db.collection("blocks").updateOne(
      { _id: block._id },
      { $set: { reminder_sent: true, reminder_sent_at: new Date() } }
    );
  }
}
