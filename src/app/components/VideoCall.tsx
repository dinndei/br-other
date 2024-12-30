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
    // const [isCallActive, setIsCallActive] = useState(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    // const [isStreamReady, setIsStreamReady] = useState(false); // Track when stream is ready
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
