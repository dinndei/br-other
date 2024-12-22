'use client';

import React, { useEffect, useState } from "react";
import { fetchMessagesByCourseId, sendMessage } from "../actions/chatActions";
import { useUserStore } from "../store/userStore";
import { log } from "console";
import checkModelStatus from "../actions/textModelActions";

const Chat = ({ courseId="6763f73f3b12e25ed1e2971d" }: { courseId: string }) => {
    const [messages, setMessages] = useState<{ username: string; text: string ,courseId:string}[]>([]);
    const [message, setMessage] = useState("");
    const username = useUserStore(st=>st.user?.userName)||"xxx";
//לעצב את העמוד כמו צאט נורמלי

//להוסיף לוגיקה של חסימת משתמש-אולי משתנה.
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const fetchedMessages = await fetchMessagesByCourseId(courseId);
                console.log("!!!!!!!!!!!!",fetchedMessages);
                
                setMessages(fetchedMessages);
            } catch (error) {
                console.error("Error loading messages:", error);
            }
        };

        loadMessages();
    }, [courseId]);

    const handleSendMessage = async () => {
        if (message.trim()) {
            try {
                let messageStatus=await checkModelStatus(message);
                console.log("status",messageStatus);
                await sendMessage(username, message, courseId);
                setMessages((prev) => [...prev, { username, text: message,courseId }]);
                setMessage("");
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };
//hit send on click on enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
          handleSendMessage();
      }
  };

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-100">
            {/* Header */}
            <div className="bg-green-600 text-white py-4 px-6 flex items-center justify-between shadow-md">
                <h2 className="text-lg font-semibold">Chat Room</h2>
                <span className="text-sm">Course {courseId}</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-scroll bg-white p-4 space-y-2">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            msg.username === username ? "justify-end" : "justify-start"
                        }`}
                    >
                        
                        <div
                            className={`max-w-xs px-4 py-2 rounded-lg text-white ${
                                msg.username === username ? "bg-green-500" : "bg-gray-300 text-black"
                            }`}
                        >
                             <span className="text-xs text-gray-200 block mt-1">
                                {msg.username === username ? "You" : msg.username}
                            </span>
                            <p className="text-sm">{msg.text}</p>
                           
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="bg-gray-200 p-4 flex items-center gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-400"
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-500"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
