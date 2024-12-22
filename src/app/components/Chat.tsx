// "use client";

// import { useState, useEffect } from "react";
// import { StreamChat } from "stream-chat";
// import { Chat, Channel, MessageList, MessageInput } from "stream-chat-react";

// const ChatPage = () => {
//     const [client, setClient] = useState<any>(null);
//     const [channel, setChannel] = useState<any>(null);

//     useEffect(() => {
//         const initChat = async () => {
//             try {
//                 // קבלת הטוקן מהשרת
//                 const response = await fetch("/api/socket", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ userId: "user-123" }),
//                 });

//                 const data = await response.json();
//                 if (!data.token) throw new Error("Failed to fetch token");

//                 const chatClient = StreamChat.getInstance("vfca9rmrz9cs");

//                 // חיבור המשתמש
//                 await chatClient.connectUser(
//                     {
//                         id: "user-123",
//                         name: "John Doe",
//                     },
//                     data.token
//                 );

//                 // יצירת ערוץ (או הצטרפות לערוץ קיים)
//                 const channel = chatClient.channel("messaging", "general", {
//                     name: "General",
//                 });

//                 await channel.watch();

//                 setClient(chatClient);
//                 setChannel(channel);
//             } catch (error) {
//                 console.error("Error initializing chat:", error);
//             }
//         };

//         initChat();

//         return () => {
//             client?.disconnectUser();
//         };
//     }, []);

//     useEffect(() => {
//         // מחילים עיצובים מותאמים אישית על רכיבי ה-chat
//         const messageList = document.querySelector('.str-chat__message-list');
//         const messageInput = document.querySelector('.str-chat__message-input');

//         if (messageList) {
//             messageList.classList.add('custom-message-list');
//         }
//         if (messageInput) {
//             messageInput.classList.add('custom-message-input');
//         }
//     }, []);

//     if (!client || !channel) return <div>Loading chat...</div>;


   

//     return (

//         <Chat
//             client={client}
//             theme="messaging light"
            
//         >
//             <Channel channel={channel}>
//                 <MessageList />
//                 <MessageInput />
//             </Channel>
//         </Chat>
//     );
// };

// export default ChatPage;
