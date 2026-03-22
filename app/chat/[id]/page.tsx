"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Message, User } from "../../../types";

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/login";
      return;
    }
    setUser(JSON.parse(storedUser));
  }, []);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Mock other user
    const mockUsers: Record<string, User> = {
      "1": { id: "2", name: "Alice Johnson", email: "alice@example.com" },
      "2": { id: "3", name: "Bob Smith", email: "bob@example.com" },
      "3": { id: "4", name: "Charlie Brown", email: "charlie@example.com" }
    };
    setOtherUser(mockUsers[chatId] || null);

    // Mock messages
    const mockMessages: Record<string, Message[]> = {
      "1": [
        {
          id: "m1",
          content: "Hey, how are you?",
          senderId: "2",
          timestamp: new Date(Date.now() - 1000 * 60 * 10),
          read: true
        },
        {
          id: "m2",
          content: "I'm doing great! Thanks for asking. How about you?",
          senderId: user?.id || "current",
          timestamp: new Date(Date.now() - 1000 * 60 * 9),
          read: true
        },
        {
          id: "m3",
          content: "Pretty good! Working on some new projects.",
          senderId: "2",
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          read: false
        }
      ],
      "2": [
        {
          id: "m4",
          content: "See you tomorrow!",
          senderId: user?.id || "current",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          read: true
        }
      ],
      "3": [
        {
          id: "m5",
          content: "Thanks for the help!",
          senderId: "4",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          read: true
        }
      ]
    };
    setMessages(mockMessages[chatId] || []);
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `m${Date.now()}`,
      content: newMessage,
      senderId: user?.id || "current",
      timestamp: new Date(),
      read: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!otherUser) {
    return (
      <div className="chat-page">
        <div className="chat-container">
          <div className="chat-not-found">
            <p>Chat not found</p>
            <Link href="/chats" className="back-link">Back to Chats</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <Link href="/chats" className="back-button">
            ←
          </Link>
          <div className="chat-user-info">
            <div className="avatar-placeholder small">
              {otherUser.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="chat-user-name">{otherUser.name}</h2>
          </div>
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="no-messages">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map(message => (
              <div
                key={message.id}
                className={`message ${message.senderId === user?.id ? "own" : "other"}`}
              >
                <div className="message-content">
                  <p>{message.content}</p>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                  {message.read && message.senderId === user?.id && (
                    <span className="read-indicator">✓✓</span>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="message-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="message-input"
          />
          <button type="submit" className="send-button" disabled={!newMessage.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}