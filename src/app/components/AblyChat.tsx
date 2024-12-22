"use client";

import React, { useEffect, useRef, useState } from "react";
import { Types } from "ably";
import { Realtime } from "ably";
import { useUserStore } from "../store/userStore";
import axios from "axios";
import checkModelStatus from "../actions/textModelActions";

const ably = new Realtime({ key: "1jLHPA.p9RW9g:MVb0GFzKUviMVC1i5vyIGPqIX4XyGj1Dg_762-7Mw4c" });

const Chat = ({ courseId = "6763f73f3b12e25ed1e2971d" }: { courseId: string }) => {
    const [messages, setMessages] = useState<{ username: string; text: string }[]>([]);
    const [message, setMessage] = useState("");
    const username = useUserStore((st) => st.user?.userName) || "xxx";
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const audio = new Audio("C:/Users/User/Documents/הכשרה הדסים/BR-OTHER/br-other/public/ding.mp3");

    useEffect(() => {
        const channel = ably.channels.get(courseId);

        // Subscribe to messages on the channel
        channel.subscribe("newMessage", (msg: Types.Message) => {
            setMessages((prev) => [...prev, msg.data]);

              
        // Play notification sound
        if (msg.data.username !== username) { // השמיעו צליל רק אם ההודעה אינה של המשתמש הנוכחי
            audio.play().catch((error) => {
                console.error("Failed to play sound:", error);
            });
        }
        });

        // Fetch initial messages from the server
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/api/ablyChat/${courseId}`);
                setMessages(response.data.messages);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();

        return () => {
            channel.unsubscribe();
        };
    }, [courseId]);

    const handleSendMessage = async () => {
        if (message.trim()) {
            try {
                const messageStatus=await checkModelStatus(message);
                console.log("status",messageStatus);
                if(messageStatus=="negetive")
                    alert("Your message contains inappropriate language and cannot be sent.");
                else{
                // Send message to the server
                await axios.post("/api/ablyChat", {
                    username,
                    text: message,
                    courseId,
                });

                // Publish message to Ably
                const channel = ably.channels.get(courseId);
                channel.publish("newMessage", { username, text: message });
            }
                setMessage("");
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };



//auto scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    
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
                                msg.username === username
                                    ? "bg-green-500"
                                    : "bg-gray-300 text-black"
                            }`}
                        >
                              <span className="text-xs text-gray-200 block mt-1">
                                {msg.username === username ? "You" : msg.username}
                            </span>
                            <p className="text-sm">{msg.text}</p>
                          
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
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
