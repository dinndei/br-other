'use client';
import { PiPhoneDisconnect } from "react-icons/pi";
import { IoCallOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { VideoChatProps } from "../types/props/VideoChatProps";

const VideoChat: React.FC<VideoChatProps> = ({ teacher, teacherId, studentId }) => {
  const [isConnected, setIsConnected] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer | null>(null);

  useEffect(() => {
    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, []);

  const startCall = async () => {
    const isTeacher: boolean = teacher;
    const peerId = isTeacher ? teacherId : studentId;
    const remotePeerId = isTeacher ? studentId : teacherId;

    // יצירת Peer
    const peer = new Peer(peerId);
    peerRef.current = peer;

    // קבלת הזרם המקומי
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localVideoRef.current) {
      console.log("if (localVideoRef.current)");

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

  //סיום שיחה
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="rounded-lg p-1 w-full max-w-3xl space-y-6">

        <div className="flex flex-col md:flex-row justify-center items-center md:space-x-6 space-y-4 md:space-y-0 w-full">
          <div className="space-y-2 text-center w-full ml-10">
            <h3 className="text-sm font-semibold text-gray-600">Your Video</h3>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="border rounded-lg w-full h-full object-cover shadow-md bg-white"
            />
          </div>
          <div className="space-y-2 text-center w-full">
            <h3 className="text-sm font-semibold text-gray-600">Remote Video</h3>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="border rounded-lg w-full h-full object-cover shadow-md bg-white"
            />
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          {!isConnected ? (
            <button
              onClick={startCall}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow  hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              <IoCallOutline />
            </button>
          ) : (
            <button
              onClick={endCall}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              <PiPhoneDisconnect />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoChat;
