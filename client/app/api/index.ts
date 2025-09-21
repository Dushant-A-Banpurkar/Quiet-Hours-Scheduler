/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import { createClient } from "@supabase/supabase-js";


const MONGO_URI: string = process.env.MONGO_URI!;
const MONGO_DB = process.env.MONGO_DB;
const SUPABASE_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

let cachedClient: MongoClient | null = null;

async function getDB() {
  if (cachedClient)return cachedClient.db(MONGO_DB);
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  cachedClient = client;
  return client.db(MONGO_DB);
}

async function verifyTokenAndGetUser(accessToken: string) {
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data?.user) throw new Error("Invalid token");
  return data.user;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") return res.status(405).end();
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer", "").trim();
    if (!token) return res.status(401).json({ error: "Missing Token" });
    const user = await verifyTokenAndGetUser(token);
    const { start_time, end_time } = req.body;
    if (!start_time || !end_time)
      return res.status(400).json({ error: "Invalid time range" });
    const newStart = new Date(start_time);
    const newEnd = new Date(end_time);

    if (!(newStart < newEnd))
      return res.status(400).json({ error: "Missing times" });

    const db = await getDB();

    const overlapping = await db.collection("quiet_scheduler").findOne({
      user_id: user.id,
      start_time: { $lt: newEnd },
      end_time: { $gt: newStart },
    });
    if (overlapping) {
      return res.status(409).json({ error: "Overlapping block exists" });
    }
    const doc = {
      user_id: user.id,
      email: user.email || "",
      start_time: newStart,
      end_time: newEnd,
      reminder_sent: false,
      created_at: new Date(),
      reminder_sent_at: null,
      email_status: null,
    };
    const result = await db.collection("quiet_scheduler").insertOne(doc);
    return res.status(201).json({ id: result.insertedId });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || "Server Error" });
  }
}
