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

  const fetchMessages = async () => {
    try {
      const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8000';
      const response = await axiosInstance.get(`${socketUrl}/chat/messages/${studyGroupId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Add periodic message fetching
  useEffect(() => {
    fetchMessages(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchMessages();
    }, 2000); // Fetch every 2 seconds

    return () => clearInterval(intervalId);
  }, [studyGroupId]);

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

    fetchStudyGroup();

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

        if (typingTimeoutRef.current[data.username]) {
          clearTimeout(typingTimeoutRef.current[data.username]);
        }

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
    <div className="flex flex-col h-screen bg-gray-50">
      {!isConnected && (
        <div className="bg-yellow-500 text-white text-center py-2 px-4 animate-fade-down font-medium">
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Reconnecting to chat...
          </span>
        </div>
      )}
      
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h2 
              className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
              onClick={handleGroupNameClick}
            >
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              {studyGroup ? `${studyGroup.name}` : 'Study Group Chat'}
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-grow p-4 overflow-y-auto scroll-smooth space-y-4 bg-gray-50"
        style={{ backgroundImage: 'radial-gradient(circle at center, #f3f4f6 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
            <svg className="h-16 w-16 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-center animate-fade font-medium">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${message.userId === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] md:max-w-[60%] break-words rounded-2xl px-4 py-3 shadow-sm ${
                  message.userId === userId
                    ? 'bg-blue-600 text-white animate-fade-left'
                    : 'bg-white text-gray-800 animate-fade-right'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-medium text-sm ${
                    message.userId === userId ? 'text-blue-100' : 'text-gray-600'
                  }`}>
                    {message.username}
                  </span>
                  <span className={`text-xs ${
                    message.userId === userId ? 'text-blue-200' : 'text-gray-400'
                  }`}>
                    {formatDate(message.createdAt)}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}
        
        {typingUsers.size > 0 && (
          <div className="flex items-center gap-2 text-gray-500 text-sm animate-pulse p-2">
            <div className="flex gap-1">
              <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span className="italic">
              {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
            </span>
          </div>
        )}
      </div>

      <div className="border-t bg-white p-4 shadow-lg">
        <form onSubmit={sendMessage} className="max-w-7xl mx-auto">
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder="Type your message..."
                disabled={!isConnected}
              />
              {typingUsers.size > 0 && (
                <div className="absolute -top-6 left-0 text-xs text-gray-500">
                  {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!isConnected || !inputMessage.trim()}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                isConnected && inputMessage.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Send</span>
              <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default StudyGroupChat;