import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const imageUrl = searchParams.get("url");

        if (!imageUrl) {
            return NextResponse.json(
                { error: "Missing 'url' parameter in query" },
                { status: 400 }
            );
        }

        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

        return new NextResponse(response.data, {
            headers: {
                "Content-Type": response.headers["content-type"],
                "Content-Disposition": `attachment; filename="${imageUrl.split('/').pop()}"`,
            },
        });
    } catch (error) {
        console.error("Error in download API:", error);
        return NextResponse.json(
            { error: "Failed to download image. Please check the URL." },
            { status: 500 }
        );
    }
}
