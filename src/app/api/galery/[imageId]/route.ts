import { NextResponse } from 'next/server';
import { connectToDB } from '@/app/DB/connection/connectToDB';
import Image from '@/app/DB/models/ImageModel';

export async function DELETE(req: Request, { params }: { params: { imageId: string } }) {
    try {
        // קבלת מזהה התמונה מה-URL params
        const { imageId } = params;  // מזהה התמונה יהיה החלק האחרון ב-URL

        if (!imageId) {
            return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
        }

        await connectToDB();

        const imageToDelete = await Image.findByIdAndDelete(imageId); // חיפוש ומחיקה של התמונה לפי מזהה

        if (!imageToDelete) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error deleting image:", error);

        return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }
}
