import { NextResponse } from "next/server";
import { connectToDB } from "@/app/DB/connection/connectToDB";
import Image from "@/app/DB/models/ImageModel"

export async function GET() {
    try {
        await connectToDB(); 

        const images = await Image.find(); 
        const imageUrls = images.map(image => image.imageUrl); 

        return NextResponse.json(imageUrls); 
    } catch (error) {
        return NextResponse.json({ error: error+"Error fetching images" }, { status: 500 });
    }
}
