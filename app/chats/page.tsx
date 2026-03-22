"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Chat } from "../../types";

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/login";
      return;
    }
    setUser(JSON.parse(storedUser));
  }, []);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockChats: Chat[] = [
      {
        id: "1",
        participants: [
          { id: "2", name: "Alice Johnson", email: "alice@example.com" },
          { id: user?.id || "current", name: user?.name || "Current User", email: user?.email || "user@example.com" }
        ],
        lastMessage: {
          id: "m1",
          content: "Hey, how are you?",
          senderId: "2",
          timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
          read: false
        },
        unreadCount: 2,
        updatedAt: new Date(Date.now() - 1000 * 60 * 5)
      },
      {
        id: "2",
        participants: [
          { id: "3", name: "Bob Smith", email: "bob@example.com" },
          { id: user?.id || "current", name: user?.name || "Current User", email: user?.email || "user@example.com" }
        ],
        lastMessage: {
          id: "m2",
          content: "See you tomorrow!",
          senderId: user?.id || "current",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: true
        },
        unreadCount: 0,
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
      },
      {
        id: "3",
        participants: [
          { id: "4", name: "Charlie Brown", email: "charlie@example.com" },
          { id: user?.id || "current", name: user?.name || "Current User", email: user?.email || "user@example.com" }
        ],
        lastMessage: {
          id: "m3",
          content: "Thanks for the help!",
          senderId: "4",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          read: true
        },
        unreadCount: 0,
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
      }
    ];
    setChats(mockChats);
    setFilteredChats(mockChats);
  }, []);

  useEffect(() => {
    const filtered = chats.filter(chat => {
      const otherUser = chat.participants.find(p => p.id !== "current");
      return otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             otherUser?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
             chat.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredChats(filtered);
  }, [searchTerm, chats]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="chats-page">
      <div className="chats-container">
        <div className="chats-header">
          <h1 className="chats-title">Chats</h1>
          <div className="header-right">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <Link href="/profile" className="profile-link">
              <div className="avatar-placeholder small">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </Link>
          </div>
        </div>

        <div className="chats-list">
          {filteredChats.length === 0 ? (
            <div className="no-chats">
              <p>No chats found</p>
            </div>
          ) : (
            filteredChats.map(chat => {
              const otherUser = chat.participants.find(p => p.id !== "current");
              return (
                <Link key={chat.id} href={`/chat/${chat.id}`} className="chat-item">
                  <div className="chat-avatar">
                    <div className="avatar-placeholder">
                      {otherUser?.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="chat-info">
                    <div className="chat-header">
                      <h3 className="chat-name">{otherUser?.name}</h3>
                      <span className="chat-time">
                        {formatTime(chat.updatedAt)}
                      </span>
                    </div>
                    <div className="chat-preview">
                      <p className="last-message">
                        {chat.lastMessage?.content || "No messages yet"}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="unread-badge">{chat.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}