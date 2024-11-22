import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../axios/axiosSetup';

interface Message {
  _id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

interface StudyGroup {
  _id: string;
  name: string;
}

const StudyGroupChat: React.FC = () => {
  const { studyGroupId } = useParams<{ studyGroupId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [studyGroup, setStudyGroup] = useState<StudyGroup | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");

  const addMessage = useCallback((message: Message) => {
    console.log('Adding message:', message);
    setMessages(prevMessages => {
      if (prevMessages.some(m => m._id === message._id)) {
        console.log('Duplicate message detected, not adding:', message);
        return prevMessages;
      }
      console.log('New message added to state:', message);
      return [...prevMessages, message];
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const decoded: any = jwtDecode(token);
    setUserId(decoded.id);
    setUsername(decoded.username);

    const fetchStudyGroup = async () => {
      try {
        const response = await axiosInstance.get(`/studyGroup/${studyGroupId}`);
        setStudyGroup(response.data);
      } catch (error) {
        console.error('Error fetching study group:', error);
      }
    };

    const fetchMessages = async () => {
      try {
        const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8000';
        const response = await axiosInstance.get(`${socketUrl}/chat/messages/${studyGroupId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched messages:', response.data);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchStudyGroup();
    fetchMessages();

    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8000';
    const newSocket = io(`${socketUrl}/chat`, {
      transports: ['websocket'],
      query: { studyGroupId },
      auth: { token },
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      newSocket.emit('joinRoom', { studyGroupId });
    });

    newSocket.on('chatToClient', (message: Message) => {
      console.log('Received message:', message);
      addMessage(message);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
      if (err.message === 'Unauthorized') {
        navigate('/login');
      }
    });

    setSocket(newSocket);

    return () => {
      console.log('Disconnecting socket');
      newSocket.disconnect();
    };
  }, [studyGroupId, navigate, addMessage]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && socket && userId) {
      const tempMessage: Message = {
        _id: Date.now().toString(), // Temporary ID
        userId,
        username,
        content: inputMessage,
        createdAt: new Date().toISOString(),
      };

      // Immediately add the message to the local state
      addMessage(tempMessage);

      console.log('Sending message:', inputMessage);
      socket.emit('chatToServer', { userId, studyGroupId, content: inputMessage, username }, (response: { success: boolean, message: string }) => {
        console.log('Send message response:', response);
        if (response.success) {
          setInputMessage('');
        } else {
          console.error('Failed to send message:', response.message);
          // Optionally, remove the message from the local state if it failed to send
          setMessages(prevMessages => prevMessages.filter(msg => msg._id !== tempMessage._id));
        }
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleTimeString();
  };

  const handleGroupNameClick = () => {
    navigate('/userDashboard');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-4">
        <h2 
          className="text-xl font-bold cursor-pointer hover:underline"
          onClick={handleGroupNameClick}
        >
          {studyGroup ? `${studyGroup.name} Chat` : 'Study Group Chat'}
        </h2>
      </div>
      <div
        ref={chatContainerRef}
        className="flex-grow p-4 overflow-y-auto"
      >
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`mb-4 ${
                message.userId === userId ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.userId === userId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-black'
                }`}
              >
                <p className="font-bold">{message.username}</p>
                <p>{message.content}</p>
                <p className="text-xs opacity-75">
                  {formatDate(message.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={sendMessage} className="p-4 bg-white">
        <div className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudyGroupChat;