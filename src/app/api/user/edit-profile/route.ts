export const dynamic = 'force-dynamic';
import { connectToDB } from "@/app/DB/connection/connectToDB";
import User from "@/app/DB/models/UserModel";
import { decryptData } from "@/app/lib/dataEncryption/decryptData";
import { encryptData } from "@/app/lib/dataEncryption/encryptData";
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
    try {
        await connectToDB();

        const body = await req.json();
        if (!body || !body.userId) {
            return NextResponse.json({ message: "Missing user ID or body" }, { status: 400 });
        }

        const { userId, ...updateData } = body;

        const encryptedType = encryptData(String(body.type));
 
        if (updateData.typeUser) {
            updateData.typeUser = encryptedType;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const userResponse = updatedUser.toObject();
        userResponse.typeUser = JSON.parse(decryptData(JSON.stringify(updatedUser.typeUser)))
        return NextResponse.json({ message: "User updated successfully", user: userResponse }, { status: 200 });
    } catch (err) {
        console.error("Error updating user:", err);
        return NextResponse.json({ message: "Server error updating user", error: err }, { status: 500 });
    }
}
