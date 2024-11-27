export const dynamic = 'force-dynamic';
import { connectToDB, disconnectFromDB } from "@/app/DB/connection/connectToDB";
import User from "@/app/DB/models/UserModel";
import { hashPassword } from "@/app/lib/passwordHash/hashPassword";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {

    try {
        await connectToDB();

        const body = await req.json();
        if (!body) {
            return NextResponse.json({ message: "Missing body" }, { status: 400 });
        }

        // const parsedData = userSchema.parse(body);
        // const newUser = new User(parsedData);

        const hashedPassword = await hashPassword(body.password);
        
        // יצירת אובייקט המשתמש עם הסיסמה המוצפנת
        const newUser = new User({ 
            ...body, 
            password: hashedPassword // הסיסמה המוצפנת
        });

        await newUser.save();

        console.log("created", newUser);

        // מחזיר רק מידע בטוח
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = newUser.toObject();
        return NextResponse.json(
            { message: "User created successfully", user: userWithoutPassword },
            { status: 201 }
        );

    } catch (err) {
        console.error("Error creating user:", err);
        return NextResponse.json(
            { message: "Server error creating user", error: err},
            { status: 500 }
        );
    } finally {
        await disconnectFromDB();
    }

}

