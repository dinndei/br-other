
import { NextResponse } from 'next/server';
import {connectToDB} from '@/app/DB/connection/connectToDB';
import Image from '@/app/DB/models/ImageModel';

export async function POST(request: Request) {
    try {
        const { imageUrl } = await request.json(); 

        await connectToDB();

        const newImage = new Image({
            imageUrl,  
        });

        await newImage.save();

        return NextResponse.json({ message: 'Image saved successfully', image: newImage }, { status: 201 });
    } catch (error) {
        console.error("Error saving image:", error);

        return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }
}
