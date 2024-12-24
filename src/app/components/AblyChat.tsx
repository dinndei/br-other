"use client";

import React, { useEffect, useRef, useState } from "react";
import Types from "ably";
import { Realtime } from "ably";
import { useUserStore } from "../store/userStore";
import axios from "axios";
import  {  isToxic } from "../actions/textModelActions";

const ably = new Realtime({ key: "1jLHPA.p9RW9g:MVb0GFzKUviMVC1i5vyIGPqIX4XyGj1Dg_762-7Mw4c" });

const Chat = ({ courseId = "6763f73f3b12e25ed1e2971d" }: { courseId: string }) => {
    const [messages, setMessages] = useState<{ username: string; text: string }[]>([]);
    const [message, setMessage] = useState("");
    const username = useUserStore((st) => st.user?.userName) || "xxx";
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const audio = new Audio("/ding.mp3");
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const channel = ably.channels.get(courseId);

        // Subscribe to messages on the channel
        channel.subscribe("newMessage", (msg: Types.Message) => {
            setMessages((prev) => [...prev, msg.data]);
            if (msg.data.username !== username) {
                console.log("Attempting to play sound...");
                audio.play()
                    .then(() => console.log("Sound played successfully"))
                    .catch((error) => {
                        console.error("Failed to play sound:", error)
                    });
            }
        }
        )
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
        if (isSending || !message.trim()) return;
        setIsSending(true);
        try {
            const isMessageToxic = await isToxic(message) 
            console.log("status", isMessageToxic);
            if (isMessageToxic)
                alert("Your message contains toxic language and cannot be sent.");
            else {
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
        finally {
            setIsSending(false); // שחרור הנעילה לאחר השליחה
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
        <div className="flex flex-col h-[600px] w-[1000px] mx-auto bg-gray-50 shadow-md rounded-lg">
        {/* Header */}
        <div className="bg-blue-200 text-blue-900 py-3 px-4 flex items-center justify-between shadow-sm rounded-t-lg">
            <h2 className="text-lg font-medium">Chat Room</h2>
            <span className="text-sm">Course {courseId}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-white p-4 space-y-3">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`flex ${msg.username === username ? "justify-end" : "justify-start"}`}
                >
                    <div
                        className={`max-w-[75%] px-4 py-2 rounded-lg shadow-sm ${msg.username === username
                            ? "bg-blue-100 text-blue-900"
                            : "bg-gray-200 text-gray-800"
                            }`}
                    >
                        <span className="text-xs text-gray-500 block">
                            {msg.username === username ? "You" : msg.username}
                        </span>
                        <p className="text-sm mt-1">{msg.text}</p>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-gray-100 p-3 flex items-center gap-2 rounded-b-lg">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
                onClick={handleSendMessage}
                disabled={isSending}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-400 disabled:opacity-50"
            >
                {isSending ? "Sending..." : "Send"}
            </button>
        </div>
    </div>
    );
};

export default Chat;
