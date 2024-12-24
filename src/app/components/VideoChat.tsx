
// import { useEffect, useState } from 'react';
// import Video from './Video'; // ייבוא הקומפוננטה שלך

// const VideoChat = () => {
//     const [stream, setStream] = useState<MediaStream | null>(null);

//     useEffect(() => {
//         const getUserMedia = async () => {
//             try {
//                 console.log('Requesting user media...');
//                 const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//                 console.log('Media stream obtained:', mediaStream);
//                 setStream(mediaStream); // שמירת ה- stream ב-state
//             } catch (error) {
//                 console.error('Error accessing media devices:', error);
//             }
//         };

//         getUserMedia();

//         // ניקוי כאשר הקומפוננטה נפרסת
//         return () => {
//             if (stream) {
//                 stream.getTracks().forEach(track => track.stop());
//             }
//         };
//     }, []);

//     if (!stream) {
//         return <div>Loading video...</div>; // מחכה ל-stream אם הוא לא קיים
//     }

//     return (
//         <div>
//             <h2>Video Chat</h2>
//             <Video stream={stream} /> {/* העברת ה-stream לקומפוננטה Video */}
//         </div>
//     );
// };

// export default VideoChat;

import { useEffect, useState, useRef } from 'react';
import Peer from 'peerjs';

const VideoChat = ({ userId, stream }: { userId: string, stream: MediaStream }) => {
    const [peerId, setPeerId] = useState<string | null>(null);
    const [otherPeerId, setOtherPeerId] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // יצירת PeerJS עבור המשתמש המקומי
        const peer = new Peer();

        
        peer.on("open", async (peerId) => {
            console.log("My Peer ID:", peerId);

            // שליחת ה-peerId לשרת
            fetch('/api/video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, peerId: id }),
            });
        });

        peer.on('call', (call) => {
            // קבלת שיחה
            call.answer(stream); // השמע את ה-stream המקומי
            call.on('stream', (remoteStream) => {
                // הצג את ה-stream של המשתמש המרוחק
                if (videoRef.current) {
                    videoRef.current.srcObject = remoteStream;
                }
            });
        });

        return () => {
            peerRef.current?.destroy();
        };
    }, []);

    const startCall = async () => {
        const targetUserId = otherUserId || "defaultUser2";

        try {
            const response = await fetch(`/api/video?userId=${targetUserId}`,
                {
                    method: "GET",
                }

            );
            if (!response.ok) {
                throw new Error(`Failed to fetch peer ID for user: ${targetUserId}`);
            }

            const data = await response.json();

            if (!data.peerId) {
                console.error(`Peer ID not found for user: ${targetUserId}`);
                return;
            }

            console.log("Peer ID found:", data.peerId);
            const peerId = data.peerId;

            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                localVideoRef.current!.srcObject = stream;
                localVideoRef.current!.play();
                const call = peerRef.current!.call(peerId, stream);

                call.on("stream", (remoteStream) => {
                    remoteVideoRef.current!.srcObject = remoteStream;
                    remoteVideoRef.current!.play();
                });

                setIsInCall(true); // מציג את שיחת הווידאו
            });
        } catch (error) {
            console.error("Error starting call:", error);
        }
    };

    return (
        <div>
            <video ref={videoRef} autoPlay playsInline />
            <div>
                {peerId && <p>Your Peer ID: {peerId}</p>}
                {otherPeerId && <p>Other Peer ID: {otherPeerId}</p>}
            </div>
        </div>
    );
};

export default VideoCall;
