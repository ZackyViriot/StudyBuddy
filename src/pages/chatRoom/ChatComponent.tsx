import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
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
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const typingTimeoutRef = useRef<{[key: string]: NodeJS.Timeout}>({});

  const addMessage = useCallback((message: Message) => {
    setMessages(prevMessages => {
      if (prevMessages.some(m => m._id === message._id)) {
        return prevMessages;
      }
      const newMessages = [...prevMessages, message].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      return newMessages;
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
        const response = await axiosInstance.get(`${socketUrl}/chat/messages/${studyGroupId}`);
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
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      setIsConnected(true);
      newSocket.emit('joinRoom', { studyGroupId });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('chatToClient', (message: Message) => {
      console.log('Received message:', message);
      setMessages(prevMessages => 
        prevMessages.filter(m => 
          !(m._id.toString().includes('temp') && m.content === message.content)
        )
      );
      addMessage(message);
      
      // Remove typing indicator for the user who sent the message
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(message.username);
        return newSet;
      });
    });

    newSocket.on('userTyping', (data: { username: string, isTyping: boolean }) => {
      if (data.username !== username) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (data.isTyping) {
            newSet.add(data.username);
          } else {
            newSet.delete(data.username);
          }
          return newSet;
        });

        // Clear existing timeout for this user if it exists
        if (typingTimeoutRef.current[data.username]) {
          clearTimeout(typingTimeoutRef.current[data.username]);
        }

        // Set new timeout to remove typing indicator
        if (data.isTyping) {
          typingTimeoutRef.current[data.username] = setTimeout(() => {
            setTypingUsers(prev => {
              const newSet = new Set(prev);
              newSet.delete(data.username);
              return newSet;
            });
          }, 3000);
        }
      }
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
      if (err.message === 'Unauthorized') {
        navigate('/login');
      }
    });

    setSocket(newSocket);

    return () => {
      Object.values(typingTimeoutRef.current).forEach(timeout => {
        clearTimeout(timeout);
      });
      newSocket.disconnect();
    };
  }, [studyGroupId, navigate, addMessage, username]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    if (socket) {
      socket.emit('typing', { 
        studyGroupId, 
        username,
        isTyping: true 
      });
    }
  };

  // Add debounced stop typing
  useEffect(() => {
    const stopTypingTimeout = setTimeout(() => {
      if (socket) {
        socket.emit('typing', { 
          studyGroupId, 
          username,
          isTyping: false 
        });
      }
    }, 1000);

    return () => clearTimeout(stopTypingTimeout);
  }, [inputMessage, socket, studyGroupId, username]);

  const scrollToBottom = (smooth = true) => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && socket && userId) {
      const tempMessage: Message = {
        _id: `temp-${Date.now()}`,
        userId,
        username,
        content: inputMessage,
        createdAt: new Date().toISOString(),
      };

      setInputMessage('');
      addMessage(tempMessage);

      socket.emit('chatToServer', 
        { userId, studyGroupId, content: inputMessage, username },
        (response: { success: boolean, message: string }) => {
          if (!response.success) {
            console.error('Failed to send message:', response.message);
            setMessages(prevMessages => 
              prevMessages.filter(msg => msg._id !== tempMessage._id)
            );
            setInputMessage(inputMessage);
          }
        }
      );
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
      {!isConnected && (
        <div className="bg-yellow-500 text-white text-center py-2 px-4 animate-fade-down">
          Reconnecting to chat...
        </div>
      )}
      
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
        className="flex-grow p-4 overflow-y-auto scroll-smooth"
      >
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 animate-fade">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`mb-4 ${message.userId === userId ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block p-2 rounded-lg transform transition-all duration-200 ${
                  message.userId === userId
                    ? 'bg-blue-500 text-white hover:bg-blue-600 animate-fade-left'
                    : 'bg-gray-300 text-black hover:bg-gray-400 animate-fade-right'
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
        
        {typingUsers.size > 0 && (
          <div className="text-gray-500 text-sm italic animate-pulse">
            {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-white animate-fade-up">
        <div className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Type your message..."
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!isConnected || !inputMessage.trim()}
            className={`px-4 py-2 text-white rounded-r-lg transition-all duration-200 ${
              isConnected && inputMessage.trim()
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudyGroupChat;