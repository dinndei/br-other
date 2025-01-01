
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

------
'use client'
import { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';

interface VideoCallProps {
    teacherID: string;
    studentID: string;
    roomId: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ teacherID, studentID, roomId }) => {
    const [peer, setPeer] = useState<Peer | null>(null);
    const [myPeerID, setMyPeerID] = useState<string | null>(null);
    const [isCallActive, setIsCallActive] = useState(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isStreamReady, setIsStreamReady] = useState(false); // Track when stream is ready
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const getLocalStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                setLocalStream(stream);
                setIsStreamReady(true);
            } catch (error) {
                if (error instanceof DOMException) {
                    if (error.name === 'NotAllowedError') {
                        console.error("Permission denied: User has denied access to the camera or microphone.");
                        alert("Please allow access to the camera and microphone.");
                    } else if (error.name === 'NotFoundError') {
                        console.error("No camera or microphone found.");
                        alert("No camera or microphone found. Please ensure your device has them available.");
                    } else if (error.name === 'NotReadableError') {
                        console.error("Could not start video source: The device may already be in use.");
                        alert("The camera or microphone is already in use. Please close other applications that might be using them.");
                    } else {
                        console.error("Unknown error:", error);
                    }
                } else {
                    console.error("Error:", error);
                }
            }
        };

        getLocalStream(); // Fetch local stream

        const newPeer = new Peer();
        setPeer(newPeer);

       
     
        newPeer.on('error', (err) => console.error(err));

        newPeer.on('disconnected', () => {
            console.log('Peer disconnected');
        });
    
        newPeer.on('close', () => {
            console.log('Peer connection closed');
        });
        // Handle incoming calls
        newPeer.on('call', (call) => {
            if (localStream) {
                call.answer(localStream); // Answer the call with the local stream
            }

            call.on('stream', (remoteStream) => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteStream; // Show remote stream
                }
            });
        });

        return () => {
            newPeer.destroy(); // Clean up the connection when component unmounts
        };
    }, []);

    // const startCall = () => {
    //     if (peer && myPeerID && localStream && isStreamReady && teacherID) {
    //         // Try to make the call
    //         const call = peer.call(teacherID, localStream);
    
    //         if (call) {
    //             call.on('stream', (remoteStream) => {
    //                 if (remoteVideoRef.current) {
    //                     remoteVideoRef.current.srcObject = remoteStream;
    //                 }
    //             });
    
    //             call.on('error', (error) => {
    //                 console.error('Call error:', error);
    //             });
    
    //             setIsCallActive(true);
    //         } else {
    //             console.error('Failed to make the call');
    //         }
    //     } else {
    //         console.error('Cannot start call, missing necessary data');
    //     }
    // };
    

    // const endCall = () => {
    //     if (peer) {
    //         peer.disconnect(); // Disconnect from the call
    //     }

    //     // Stop the local stream tracks to release the camera and microphone
    //     if (localStream) {
    //         localStream.getTracks().forEach(track => track.stop());
    //     }

    //     setIsCallActive(false);
    // };

    return (
        <div>
            <h2>Video Call - Classroom {roomId}</h2>

            {/* Local video */}
            <div>
                <video ref={localVideoRef} autoPlay muted></video>
            </div>

            {/* Remote video */}
            <div>
                <video ref={remoteVideoRef} autoPlay></video>
            </div>
 
            {/* Start call button */}
            {/* {!isCallActive && isStreamReady && (
                <button onClick={startCall} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Join Call
                </button>
            )} */}

            {/* End call button */}
            {/* {isCallActive && (
                <button onClick={endCall} className="bg-red-500 text-white px-4 py-2 rounded">
                    End Call
                </button>
            )}  */}
        </div>
    );
};

export default VideoCall;
