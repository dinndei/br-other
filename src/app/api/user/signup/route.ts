export const dynamic = 'force-dynamic';
import { connectToDB } from "@/app/DB/connection/connectToDB";
import User from "@/app/DB/models/UserModel";
import { decryptData } from "@/app/lib/dataEncryption/decryptData";
import { encryptData } from "@/app/lib/dataEncryption/encryptData";
// import { encryptData } from "@/app/lib/dataEncryption/encryptData";
import { hashPassword } from "@/app/lib/passwordHash/hashPassword";
import { generateToken } from "@/app/lib/tokenConfig/generateToken";
import { PoliticalAffiliation } from "@/app/types/enums/politicalAffiliation";
import { ReligionLevel } from "@/app/types/enums/ReligionLevel";
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
        console.log("user", body.user.password);

        const hashedPassword = await hashPassword(body.user.password);
        const encryptedTypeReligion = encryptData(String(body.user.typeUser.religionLevel));
        console.log("encryptedTypeReligion", encryptedTypeReligion);

        const encryptedTypePolitical = encryptData(String(body.user.typeUser.politicalAffiliation));
        console.log("encryptedTypePolitical", encryptedTypePolitical);

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
            profileImage: body.user.profileImage,
            typeUser: {
                religionLevel: encryptedTypeReligion,
                politicalAffiliation: encryptedTypePolitical
            },

        });

        console.log("newUser", newUser);

        await newUser.save();

        console.log("created", newUser);

        // מחזיר רק מידע בטוח
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = newUser.toObject();
        //המרה של הטייפ למידע לא מוצפן

        const decryptedTypeReligion = decryptData(encryptedTypeReligion) as ReligionLevel;
        const decryptedTypePolitical = decryptData(encryptedTypePolitical) as PoliticalAffiliation;
        if (userWithoutPassword.typeUser) {
            userWithoutPassword.typeUser = { religionLevel: decryptedTypeReligion, politicalAffiliation: decryptedTypePolitical };
        }
        const token = generateToken(userWithoutPassword);

        const response = NextResponse.json({
            message: "User created successfully",
            user: userWithoutPassword,
            token: token
        },
            { status: 201 });
        //cookies את הטוקן של המשתמש
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 12,
        });

        return response;
    } catch (err) {
        console.error("Error creating user:", err);
        return NextResponse.json(
            { message: "Server error creating user", error: err },
            { status: 500 }
        );
    }

}

