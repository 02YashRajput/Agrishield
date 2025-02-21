import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  Fab,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";

interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface Chat {
  _id: string;
  participants: { userId: string; name: string; profileLink: string }[];
  lastMessage: string;
  lastUpdated: string;
}

const ChatComponent :React.FC= () => {
  const {t} = useTranslation("chat");
  const {isChatOpen,setIsChatOpen,currentChatId,setCurrentChatId} = useLanguage();
  const [user, setUser] = useState("");
 
  const [chats, setChats] = useState<Chat[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    
    if (currentChatId) {

      fetchMessages(currentChatId);
      const newSocket = io(import.meta.env.VITE_SERVER_URL, {
        withCredentials: true,
        extraHeaders: {
          'ngrok-skip-browser-warning': 'any-value',  // Use extraHeaders instead of headers
        }
      });
      
      setSocket(newSocket);
      newSocket.emit("joinChat", { chatId: currentChatId });
      newSocket.on("newMessage", (newMessage: Message) => {
        if (newMessage.chatId === currentChatId) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          setChats((prev)=>{
            prev.forEach((chat)=>{
              if(chat._id === currentChatId){
                chat.lastMessage = newMessage.content
              }
            })
            return prev
          })
        }
      });
      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [currentChatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const fetchChats = async () => {
    try {
      const response = await axios.get(`/api/chat`, { withCredentials: true ,headers: {
        'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
      },});
      setUser(response.data.user);
      setChats(response.data.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await axios.get(`/api/chat/${chatId}`, {
        withCredentials: true,
        headers: {
          'ngrok-skip-browser-warning': 'any-value',  // Add the custom header here
        },
      });
      setMessages(response.data.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = (e:any) => {
    e.preventDefault();
    if (!messageContent.trim() || !socket || !currentChatId) return;

    socket.emit("sendMessage", {
      chatId: currentChatId,
      senderId: user,
      content: messageContent,
    });
    setChats((prev)=>{
      prev.forEach((chat)=>{
        if(chat._id === currentChatId ){
          chat.lastMessage = messageContent
        }
      })
      return prev
    })
    setMessageContent("");
  
  };

  const handleOpenChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setCurrentChatId(null);
    setMessages([]);
  };

  useEffect(() => {
    fetchChats();
  }, [isChatOpen,currentChatId]);

  return (
    <>
      {/* Floating action button */}
      <Fab
        color="primary"
        onClick={() => {
          !isChatOpen ? setIsChatOpen(true) : handleCloseChat();
        }}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1300,
        }}
      >
        {isChatOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      {/* Chat list or messages */}
      {isChatOpen && (
        <Card
          sx={{
            position: "fixed",
            bottom: 80,
            right: 16,
            width: 350,
            height: 500,
            boxShadow: 4,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            zIndex: 1300,
          }}
        >
          {/* Chat header */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            {currentChatId && (
              <IconButton
                onClick={() => {
                  setCurrentChatId(null);
                  setMessages([]);
                }}
                sx={{ mr: 1 }}
              >
                <FaChevronLeft />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {currentChatId
                ? chats
                    .find((chat) => chat._id === currentChatId)
                    ?.participants.filter((p) => p.userId !== user)
                    .map((p) => (
                      (
                        <Link
                          key={p.userId}
                          to={p.profileLink} 
                          
                        >
                          {p.name}
                        </Link>
                      )
                    ))
                    
                : t("Chats")}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
              display: "flex",
              flexDirection: "column", // Ensure items stack vertically
            }}
          >
            {currentChatId ? (
              <>
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <Typography
                      key={message._id}
                      sx={{
                        mb: 1,
                        p: 1.5,
                        borderRadius: 1,
                        backgroundColor:
                          message.senderId === user ? "#d1e7dd" : "#f8d7da",
                        alignSelf:
                          message.senderId === user ? "flex-end" : "flex-start",
                        maxWidth: "70%",
                        overflowWrap: "break-word", // Ensures long text wraps
                        wordWrap: "break-word",    // Alternative for legacy browsers
                        whiteSpace: "normal",      // Normal text wrapping behavior
                  
                      }}
                    >
                      {message.content}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    {t("No messages yet")}
                  </Typography>
                )}
                
                <div ref={messagesEndRef} />
              </>
            ) : chats.length > 0 ? (
              chats.map((chat) => (
                <Box
                  key={chat._id}
                  onClick={() => handleOpenChat(chat._id)}
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 1,
                    backgroundColor: "#fff",
                    boxShadow: 1,
                    cursor: "pointer",
                  }}
                >
                  <Typography sx={{ fontWeight: "bold" }}>
                    {chat.participants
                      .filter((p) => p.userId !== user)
                      .map((p) => p.name)
                      .join(", ")}
                  </Typography>
                  <Typography
  variant="body2"
  color="textSecondary"
  sx={{
    textOverflow: "ellipsis", // Adds the three dots
    overflow: "hidden",       // Hides overflowed text
    whiteSpace: "nowrap",     // Prevents text from wrapping to the next line
    display: "block",         // Ensures the ellipsis works (block or inline-block)
  }}
>
  {chat.lastMessage || "No messages"}
</Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                {t("No chats available")}
              </Typography>
            )}
          </Box>

          {currentChatId && (
            <form
              
              onSubmit={handleSendMessage}
              className="flex  items-center p-2 border-t border-gray-300"
            >
              <TextField
                variant="outlined"
                placeholder="Type a message..."
                size="small"
                fullWidth
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                sx={{ mr: 1 }}
              />
              <Button type="submit" variant="contained" >
              {t("send")}
              </Button>
            </form>
          )}
        </Card>
      )}
    </>
  );
};

export default ChatComponent;
