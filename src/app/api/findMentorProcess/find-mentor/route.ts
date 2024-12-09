import { connectToDB } from "@/app/DB/connection/connectToDB";
import User from "@/app/DB/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { mainField, subField } = await req.json();

    if (!mainField || !subField) {
        return NextResponse.json({ message: 'Main field and sub field are required' }, { status: 400 });
    }

    try {
        await connectToDB();

        const mentors = await User.find({
            fields: {
                $elemMatch: {
                    mainField: mainField,
                    subField: subField,
                },
            },
        });

        if (mentors.length === 0) {
            return NextResponse.json({ message: 'No mentors found for the selected fields' }, { status: 404 });
        }

        console.log("mentors in API", mentors);


        return NextResponse.json(mentors);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
