"use client";

import React, { useEffect, useRef, useState } from "react";
import Types from "ably";
import { Realtime } from "ably";
import { useUserStore } from "../store/userStore";
import axios from "axios";
import { isToxic } from "../actions/textModelActions";
import { deleteMessage } from "../actions/chatActions";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
const ably = new Realtime({ key: "1jLHPA.p9RW9g:MVb0GFzKUviMVC1i5vyIGPqIX4XyGj1Dg_762-7Mw4c" });

const Chat = ({ courseId = "6763f73f3b12e25ed1e2971d" }: { courseId: string }) => {
    const [messages, setMessages] = useState<{ _id: string, username: string; text: string }[]>([]);
    const [message, setMessage] = useState("");
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState("");
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
                toast.error("הודעתך מכילה תוכן רעיל ועל כן לא תישלח, נסח מילותיך בעידון");
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

    const handleDeleteMessage = async (messageId: string) => {
        try {
            await deleteMessage(messageId);
            setMessages((prev) => prev.filter((msg) => msg._id !== messageId)); // עדכון הסטייט
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    //handle edit functions

    const handleEditMessage = async () => {
        if (!editingMessageId) {
            console.log("no message id");
            return
        };
        try {
            await axios.put("/api/ablyChat", {
                messageId: editingMessageId,
                newText: editingText,
            });
            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === editingMessageId ? { ...msg, text: editingText } : msg
                )
            );
            setEditingMessageId(null);
            setEditingText("");
        } catch (error) {
            console.error("Error editing message:", error);
        }
    };

    const startEditing = (id: string, text: string) => {
        setEditingMessageId(id);
        setEditingText(text);
    };

    const cancelEditing = () => {
        setEditingMessageId(null);
        setEditingText("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (editingText != "") {
                handleEditMessage();
            }
            else
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
        <div className="flex flex-col h-[400px] w-[750px] mx-auto bg-gray-50 shadow-md rounded-lg mt-16">
            {/* Header */}
            <div className="bg-blue-200 text-blue-900 py-3 px-4 flex items-center justify-between shadow-sm rounded-t-lg">
                <h2 className="text-lg font-medium">Chat Room</h2>
                <span className="text-sm">Course {courseId}</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-white p-4 space-y-3">
                {messages.map((msg,_index) => (
            <div className="flex-1 overflow-y-auto bg-white p-4 space-y-3 flex flex-col-reverse">
                {messages.map((msg, index) => (
                    <div
                        key={msg._id}
                        className={`group flex items-center gap-2 ${msg.username === username ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`relative max-w-[75%] px-4 py-2 rounded-lg shadow-sm ${msg.username === username
                                ? "bg-blue-100 text-blue-900"
                                : "bg-gray-200 text-gray-800"
                                }`}
                        >
                            {editingMessageId === msg._id ? (
                                <div>
                                    <div>id:{editingMessageId}</div>
                                    <input
                                        type="text"
                                        value={editingText}
                                        onChange={(e) => setEditingText(e.target.value)}
                                        className="w-full border rounded p-1"
                                        onKeyDown={handleKeyDown}

                                    />
                                    <div className="flex justify-end gap-2 mt-1">
                                        <button onClick={handleEditMessage} className="text-blue-500" >Save</button>
                                        <button onClick={cancelEditing} className="text-red-500">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p>{msg.text}</p>
                                    <div className="absolute top-0 right-0 hidden group-hover:flex gap-1 m-4 ml-36">
                                        {msg.username === username && (
                                            <div className="flex gap-2 mr-6">
                                                <button
                                                    onClick={() => startEditing(msg._id, msg.text)}
                                                    className="text-blue-500"
                                                   
                                                >
                                               <MdModeEdit />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleDeleteMessage(msg._id);
                                                            console.log("msg id", msg._id);
                                                    }
                                                    }
                                                    className="text-red-500"
                                                >
                                                    <MdDelete/>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
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
