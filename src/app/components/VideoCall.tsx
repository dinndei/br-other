'use client';

import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';

interface VideoChatProps {
  teacher: boolean;
  teacherId: string;
  studentId: string;
}

const VideoChat: React.FC<VideoChatProps> = ({teacher=false, teacherId = "1234", studentId = "5678" }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, []);

  const startCall = async () => {
    const isTeacher:boolean = teacher;
    const peerId = isTeacher ? teacherId:studentId;
    const remotePeerId =isTeacher ?studentId:teacherId;
  
    // יצירת Peer
    const peer = new Peer(peerId);
    peerRef.current = peer;

    // קבלת הזרם המקומי
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    // אירוע פתיחה של Peer
    peer.on('open', () => {
      console.log(`Peer connected with ID: ${peerId}`);
      setIsConnected(true);
      if (isTeacher) {
        // יצירת שיחה
        const call = peer.call(remotePeerId, stream);
        console.log(call);
        call.on('stream', (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });
      }
    });

    // אירוע קבלת שיחה
    peer.on('call', (call) => {
      call.answer(stream); // השב לשיחה עם הזרם המקומי
      call.on('stream', (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });
    });

    // ניהול שגיאות
    peer.on('error', (err) => {
      console.error('Peer error:', err);
    });
  };

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
      setIsConnected(false);
    }

    if (localVideoRef.current && localVideoRef.current.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      (remoteVideoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">Video Chat</h2>
      <div className="flex space-x-4">
        <div>
          <h3 className="text-sm font-semibold">Your Video</h3>
          <video ref={localVideoRef} autoPlay muted playsInline className="border rounded w-60 h-40" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">Remote Video</h3>
          <video ref={remoteVideoRef} autoPlay playsInline className="border rounded w-60 h-40" />
        </div>
      </div>
      <div className="flex space-x-4 mt-4">
        {!isConnected ? (
          <button
            onClick={startCall}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Join Call
          </button>
        ) : (
          <button
            onClick={endCall}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Leave Call
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoChat;
