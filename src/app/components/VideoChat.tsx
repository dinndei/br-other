import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import axios from "axios";

const VideoChat = ({ userId = "defaultUser1", otherUserId = "defaultUser2" }: { userId?: string; otherUserId?: string }) => {
    const [isInCall, setIsInCall] = useState(false); // משתנה לצורך שליטה על הצגת הווידאו
    const peerRef = useRef<Peer | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // יצירת Peer ID
        const peer = new Peer();
        peerRef.current = peer;

        peer.on("open", async (peerId) => {
            console.log("My Peer ID:", peerId);

            // שליחה ל-API
            const response = await fetch("/api/video/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, peerId }),
            });
            console.log("response", response);

        });

        peer.on("call", (call) => {
            // מענה לשיחה נכנסת
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                localVideoRef.current!.srcObject = stream;
                localVideoRef.current!.play();
                call.answer(stream);

                call.on("stream", (remoteStream) => {
                    remoteVideoRef.current!.srcObject = remoteStream;
                    remoteVideoRef.current!.play();
                });
            });
        });

        return () => {
            peerRef.current?.destroy();
        };
    }, [userId]);


    const startCall = async () => {
        const targetUserId = otherUserId || "defaultUser2";

        try {
            const response = await axios.get(`/api/video?userId=${targetUserId}`);

            if (!response.data.peerId) {
                console.error(`Peer ID not found for user: ${targetUserId}`);
                return;
            }

            console.log("Peer ID found:", response.data.peerId);
            const peerId = response.data.peerId;

            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                localVideoRef.current!.srcObject = stream;
                localVideoRef.current!.play();

                const call = peerRef.current!.call(peerId, stream);

                call.on("stream", (remoteStream) => {
                    remoteVideoRef.current!.srcObject = remoteStream;
                    remoteVideoRef.current!.play();
                });

                setIsInCall(true);
            });
        } catch (error) {
            console.error("Error starting call:", error);
        }
    };


    return (
        <div>
            {!isInCall && <button onClick={startCall}>Start Call</button>}
            {isInCall && (
                <div className="flex flex-col items-center">
                    <div className="flex space-x-4">
                        <video ref={localVideoRef} muted className="w-64 h-64 border-2 border-gray-300" />
                        <video ref={remoteVideoRef} className="w-64 h-64 border-2 border-gray-300" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoChat;
