import { NextResponse } from "next/server";
import { connectToDB } from "@/app/DB/connection/connectToDB";
import Image from "@/app/DB/models/ImageModel"

export async function GET() {
    try {
        await connectToDB(); 

        const images = await Image.find(); 
    
        return NextResponse.json(images); 
    } catch (error) {
        return NextResponse.json({ error: error+"Error fetching images" }, { status: 500 });
    }
}
