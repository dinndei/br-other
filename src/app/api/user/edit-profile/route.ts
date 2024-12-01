export const dynamic = 'force-dynamic';
import { connectToDB } from "@/app/DB/connection/connectToDB";
import User from "@/app/DB/models/UserModel";
import { decryptData } from "@/app/lib/dataEncryption/decryptData";
import { encryptData } from "@/app/lib/dataEncryption/encryptData";
import { PoliticalAffiliation } from "@/app/types/enums/politicalAffiliation";
import { ReligionLevel } from "@/app/types/enums/ReligionLevel";
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
    try {
        await connectToDB();

        const body = await req.json();
        if (!body || !body.userId) {
            return NextResponse.json({ message: "Missing user ID or body" },
                { status: 400 });
        }

        const { userId, ...updateData } = body;
        // הצפנה של המידע המיוחד שצריך להיות מוצפן
        const encryptedTypeReligion = encryptData(String(updateData.typeUser.religionLevel));
        const encryptedTypePolitical = encryptData(String(updateData.typeUser.politicalAffiliation));
        if (updateData.typeUser) {
            updateData.typeUser = {religionLevel:encryptedTypeReligion,politicalAffiliation:encryptedTypePolitical};
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updateData,
            { new: true });
        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" },
                { status: 404 });
        }

        const userResponse = updatedUser.toObject();

        const decryptedTypeReligion = decryptData(encryptedTypeReligion) as ReligionLevel;
        const decryptedTypePolitical = decryptData(encryptedTypePolitical) as PoliticalAffiliation;
        if (userResponse.typeUser) {
            userResponse.typeUser = {religionLevel:decryptedTypeReligion,politicalAffiliation:decryptedTypePolitical};
        }
        return NextResponse.json({
            message: "User updated successfully",
            
            user: userResponse
        }, { status: 200 });
    } catch (err) {
        console.error("Error updating user:", err);
        return NextResponse.json({ message: "Server error updating user", error: err }, { status: 500 });
    }
}
