"use client";
import React, { useEffect, useRef } from "react";
import Peer from "peerjs";

type VideoChatProps = {
  myPeerId: string; // המזהה של המשתמש הנוכחי
  remotePeerId: string; // המזהה של המשתמש השני
};

const VideoChat = ({ myPeerId, remotePeerId }: VideoChatProps) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const peer = new Peer(myPeerId); // יצירת Peer עם המזהה הייחודי של המשתמש

    peer.on("open", () => {
      console.log("Peer מחובר עם מזהה:", myPeerId);

      if (myPeerId !== remotePeerId) {
        // יוזם שיחה אם זה המשתמש שמתקשר
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
              localVideoRef.current.play();
            }

            const call = peer.call(remotePeerId, stream);

            call.on("stream", (remoteStream) => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
                remoteVideoRef.current.play();
              }
            });
          })
          .catch((err) => console.error("שגיאה בגישה לזרם המקומי:", err));
      }
    });

    // האזנה לשיחות נכנסות
    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play();
          }

          call.answer(stream); // שולח את הזרם המקומי בחזרה
          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
              remoteVideoRef.current.play();
            }
          });
        })
        .catch((err) => console.error("שגיאה בגישה לזרם המקומי:", err));
    });

    return () => {
      peer.destroy();
    };
  }, [myPeerId, remotePeerId]);

  return (
    <div className="flex gap-4">
      <video
        ref={localVideoRef}
        muted
        playsInline
        className="border rounded w-1/3"
      />
      <video
        ref={remoteVideoRef}
        playsInline
        className="border rounded w-1/3"
      />
    </div>
  );
};

export default VideoChat;
