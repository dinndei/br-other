"use client";

import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

interface VideoCallProps {
  myId: string;
  peerId: string;
}

const VideoCall = ({ myId="", peerId }: VideoCallProps) => {
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const callingVideoRef = useRef<HTMLVideoElement>(null);
  const [peerInstance, setPeerInstance] = useState<Peer | null>(null);

  const generateUniqueId = () => Math.random().toString(36).substring(2, 15);

  useEffect(() => {
    let peer: Peer;

    if (typeof window !== "undefined") {
      // יצירת Peer עם המזהה של המשתמש הנוכחי
      peer = new Peer(myId, {
        host: "localhost",
        port: 9000,
        path: "/myapp",
      });

      setPeerInstance(peer);

      // קבלת הווידאו והאודיו של המשתמש
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = stream;
          }

          // מאזין לשיחות נכנסות
          peer.on("call", (call) => {
            call.answer(stream); // עונה לשיחה עם הזרם הנוכחי
            call.on("stream", (userVideoStream) => {
              if (callingVideoRef.current) {
                callingVideoRef.current.srcObject = userVideoStream;
              }
            });
          });

          // התחלת שיחה אוטומטית עם המזהה שניתן בפרופס
          if (peerId) {
            const call = peer.call(peerId, stream);
            call?.on("stream", (userVideoStream) => {
              if (callingVideoRef.current) {
                callingVideoRef.current.srcObject = userVideoStream;
              }
            });
          }
        });
    }

    return () => {
      if (peer) {
        peer.destroy();
      }
    };
  }, [myId, peerId]);

  return (
    <div className="flex flex-col justify-center items-center p-12">
      <p>Your ID: {myId}</p>
      <video className="w-72" playsInline ref={myVideoRef} autoPlay />
      <video className="w-72" playsInline ref={callingVideoRef} autoPlay />
    </div>
  );
};

export default VideoCall;
