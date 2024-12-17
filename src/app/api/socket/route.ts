import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

const apiKey = "vfca9rmrz9cs";
const apiSecret = "pqgd6en8rscvuubtpqfpjzy5nutyznfzxabyvdys2mth8kt67kykraazf88evdgs";

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // יצירת טוקן ייחודי למשתמש
        const token = serverClient.createToken(userId);

        return NextResponse.json({ token });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
