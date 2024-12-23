
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

        peer.on('open', (id) => {
            console.log('My peer ID is:', id);
            setPeerId(id);

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

        // חיפוש ה-peerId של המשתמש השני דרך ה-API שלך
        const fetchPeerId = async () => {
            try {
                const response = await fetch(`/api/video/post?userId=${userId}`);
                const data = await response.json();
                if (data.peerId) {
                    setOtherPeerId(data.peerId);
                    const call = peer.call(data.peerId, stream); // יוזמת שיחה עם המשתמש השני
                    call.on('stream', (remoteStream) => {
                        if (videoRef.current) {
                            videoRef.current.srcObject = remoteStream;
                        }
                    });
                }
            } catch (error) {
                console.error('Error fetching peerId:', error);
            }
        };

        fetchPeerId();

        return () => {
            peer.destroy(); // נקיון לאחר שהקומפוננטה תנותק
        };
    }, [userId, stream]);

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

export default VideoChat;
