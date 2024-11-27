export const dynamic = 'force-dynamic';
import { connectToDB } from "@/app/DB/connection/connectToDB";
import User from "@/app/DB/models/UserModel";
import { decryptData } from "@/app/lib/dataEncryption/decryptData";
import { encryptData } from "@/app/lib/dataEncryption/encryptData";
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
        const encryptedType =  encryptData(String(body.type));
        
        // יצירת אובייקט המשתמש עם הסיסמה המוצפנת
        const newUser = new User({ 
            ...body, 
            password: hashedPassword, // הסיסמה המוצפנת
            type:encryptedType//הצפנת השתייכות המשתמש
        });

        await newUser.save();

        console.log("created", newUser);

        // מחזיר רק מידע בטוח
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password , ...userWithoutPassword } = newUser.toObject();
        //המרה של הטייפ למידע לא מוצפן
        userWithoutPassword.typeUser=JSON.parse(decryptData(JSON.stringify(userWithoutPassword.typeUser)))
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
    }

}

