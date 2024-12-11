import { connectToDB } from "@/app/DB/connection/connectToDB";
import Field from "@/app/DB/models/FieldToDBModel"; 
import {  NextResponse } from "next/server";

export async function POST() {
    try {
        await connectToDB();

        // משיכת כל השדות מהמסד נתונים עם תתי השדות
        const fields = await Field.find({}, 'mainField subFields'); // בחר את השדות הרלוונטיים

        if (!fields || fields.length === 0) {
            return NextResponse.json({ message: 'No fields found' }, { status: 404 });
        }

        const response = NextResponse.json({
            message: 'Fields retrieved successfully',
            fields: fields,
            success: true
        });

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
