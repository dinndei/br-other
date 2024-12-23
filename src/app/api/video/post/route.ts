
import { NextResponse } from "next/server";

const peers: Record<string, string> = {};

export async function POST(request: Request) {
    console.log("rvrvrvrvvrvr");
    
    try {
        const { userId, peerId } = await request.json();
        console.log("userId, peerId  in API", userId, peerId);


        if (!userId || !peerId) {
            return NextResponse.json(
                { error: "Missing userId or peerId" },
                { status: 400 }
            );
        }

        // שמירת Peer ID עבור משתמש
        peers[userId] = peerId;
        console.log("Saved Peer ID:", { userId, peerId });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in POST /api/video:", error);
        return NextResponse.json(
            { error: "Failed to save peer ID" },
            { status: 500 }
        );
    }
}


export async function GET(request: Request) {

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        console.log("userId in get", userId);

        if (!userId) {
            return NextResponse.json(
                { error: "Missing userId parameter" },
                { status: 400 }
            );
        }

        const peerId = peers[userId];
        if (!peerId) {
            return NextResponse.json(
                { error: `Peer ID not found for userId: ${userId}` },
                { status: 404 }
            );
        }

        console.log("Fetched Peer ID for userId:", userId, peerId);
        return NextResponse.json({ peerId });
    } catch (error) {
        console.error("Error in GET /api/video:", error);
        return NextResponse.json(
            { error: "Failed to fetch peer ID" },
            { status: 500 }
        );
    }
}


