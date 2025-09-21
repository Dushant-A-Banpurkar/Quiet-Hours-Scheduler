/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";


export async function GET() {
  const client = await clientPromise;
  const db = client.db("quiet_scheduler");
  const blocks = await db.collection("blocks").find({}).toArray();
  return NextResponse.json(blocks);
}


export async function POST(req: Request) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("quiet_scheduler");
  const result = await db.collection("blocks").insertOne(body);
  return NextResponse.json({ insertedId: result.insertedId });
}


export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing Id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("quiet_scheduler");

    const result = await db
      .collection("blocks")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
