import React from "react";
import VideoChat from "@/app/components/Video"

const ChatPage = () => {
  const myPeerId = "user1"; // המזהה של המשתמש הנוכחי
  const remotePeerId = "user2"; // המזהה של המשתמש השני

  return (
    <div>
      <h1>שיחת וידאו בין משתמשים</h1>
      <VideoChat myPeerId={myPeerId} remotePeerId={remotePeerId} />
    </div>
  );
};

export default ChatPage;
