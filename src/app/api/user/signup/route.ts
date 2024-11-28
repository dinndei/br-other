export const dynamic = 'force-dynamic';
import { connectToDB } from "@/app/DB/connection/connectToDB";
import User from "@/app/DB/models/UserModel";
import { decryptData } from "@/app/lib/dataEncryption/decryptData";
import { encryptData } from "@/app/lib/dataEncryption/encryptData";
import { hashPassword } from "@/app/lib/passwordHash/hashPassword";
import { generateToken } from "@/app/lib/tokenConfig/generateToken";
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
        console.log("body", body.user);

        const hashedPassword = await hashPassword(body.password);
        const encryptedType = encryptData(String(body.type));

        // יצירת אובייקט המשתמש עם הסיסמה המוצפנת
        const newUser = new User({
            firstName: body.user.firstName,
            lastName: body.user.lastName,
            userName: body.user.userName,
            age: body.user.age,
            email: body.user.email,
            password: hashedPassword, 
            gender: body.user.gender,
            fields: body.user.fields,
            typeUser: body.user.typeUser
        });

        console.log("newUser", newUser);

        await newUser.save();

        console.log("created", newUser);

        // מחזיר רק מידע בטוח
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = newUser.toObject();
        //המרה של הטייפ למידע לא מוצפן
        userWithoutPassword.typeUser = JSON.parse(decryptData(JSON.stringify(userWithoutPassword.typeUser)))

        const token = generateToken(userWithoutPassword._id!.toString(), userWithoutPassword.role);

        const response = NextResponse.json({
            message: "User created successfully",
            user: userWithoutPassword,
            token:token
        },
            { status: 201 });
            //cookies את הטוקן של המשתמש
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 12,
        });


    } catch (err) {
        console.error("Error creating user:", err);
        return NextResponse.json(
            { message: "Server error creating user", error: err },
            { status: 500 }
        );
    }

}

