import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import axios from "axios";

const VideoChat = ({ userId = "6760233dd69d63fc510648da", otherUserId = "6760233dd69d63fc510648da" }: { userId?: string; otherUserId?: string }) => {
    const [isInCall, setIsInCall] = useState(false);
    const peerRef = useRef<Peer | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const currentCallRef = useRef<Peer.MediaConnection | null>(null);

    useEffect(() => {
        const peer = new Peer();
        peerRef.current = peer;

        peer.on("open", async (peerId) => {
            console.log("My Peer ID:", peerId);

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
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                localStreamRef.current = stream;
                localVideoRef.current!.srcObject = stream;
                localVideoRef.current!.play();
                call.answer(stream);
                currentCallRef.current = call;

                call.on("stream", (remoteStream) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream;
                        remoteVideoRef.current.play();
                    } else {
                        console.error("Remote video element not found.");
                    }
                });
            });
            setIsInCall(true);
        });

        return () => {
            peerRef.current?.destroy();
        };
    }, [userId]);

    const startCall = async () => {
        const targetUserId = otherUserId || "6760233dd69d63fc510648da";

        try {
            const response = await axios.get(`/api/video/post?userId=${targetUserId}`);

            if (!response.data.peerId) {
                console.error(`Peer ID not found for user: ${targetUserId}`);
                return;
            }

            const peerId = response.data.peerId;
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                localStreamRef.current = stream;
                localVideoRef.current!.srcObject = stream;
                localVideoRef.current!.play();

                const call = peerRef.current!.call(peerId, stream);
                currentCallRef.current = call;

                call.on("stream", (remoteStream) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream;
                        remoteVideoRef.current.play();
                    }
                });

                setIsInCall(true);
            });
        } catch (error) {
            console.error("Error starting call:", error);
        }
    };

    const endCall = () => {
        // הפסקת השיחה הנוכחית
        currentCallRef.current?.close();
        localStreamRef.current?.getTracks().forEach((track) => track.stop());

        // ניקוי הווידאו
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

        setIsInCall(false);
    };

    return (
        <div>
            {!isInCall && <button onClick={startCall}>Start Call</button>}
            {isInCall && (
                <div className="flex flex-col items-center">
                    <div className="flex space-x-4">
                        <div>
                            Local Video
                            <video ref={localVideoRef} muted className="w-64 h-64 border-2 border-gray-300" />
                        </div>
                        <div>
                            Remote Video
                            <video ref={remoteVideoRef} className="w-64 h-64 border-2 border-gray-300" />
                        </div>
                    </div>
                    <button onClick={endCall} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">End Call</button>
                </div>
            )}
        </div>
    );
};

export default VideoChat;
