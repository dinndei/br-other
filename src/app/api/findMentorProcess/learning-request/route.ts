// app/api/learning-request/route.ts
import { connectToDB } from "@/app/DB/connection/connectToDB";
import LearningRequest from "@/app/DB/models/LearningRequestModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { requesterId, mainField, subField } = await req.json();

    if (!requesterId || !mainField || !subField) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const newRequest = new LearningRequest({ requesterId, mainField, subField, approvals: []});
    await newRequest.save();

    return NextResponse.json({ message: "Learning request created successfully", request: newRequest }, { status: 201 });
  } catch (error) {
    console.error("Error creating learning request:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
