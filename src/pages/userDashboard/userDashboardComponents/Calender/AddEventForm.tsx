import React, { useState, FormEvent, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CalendarIcon, ClockIcon, TagIcon, CheckCircleIcon } from 'lucide-react';
import axiosInstance from "../../../../axios/axiosSetup";

interface Event {
  title: string;
  description?: string;
  start: string;
  end: string;
  color?: string;
  status: string;
}

interface AddEventFormProps {
  onClose: () => void;
  onEventAdded?: () => void;
}

export default function AddEventForm({ onEventAdded, onClose }: AddEventFormProps) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [event, setEvent] = useState<Event>({
    title: "",
    description: "",
    start: "",
    end: "",
    color: "#3B82F6",
    status: "pending"
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");
        const decoded: any = jwtDecode(token);
        setUserId(decoded.id);
      } catch (error) {
        setError("Failed to authenticate user. Please log in again.");
      }
    };
    fetchUserInfo();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEvent(prev => ({ ...prev, [name]: value }));
  };

  const validateDates = () => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setError("Please enter valid start and end dates");
      return false;
    }

    if (startDate > endDate) {
      setError("End date must be after start date");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (!validateDates()) {
      return;
    }
  
    setIsSubmitting(true);
  
    const payload = {
      title: event.title,
      description: event.description || '',
      start: new Date(event.start).toISOString(),
      end: new Date(event.end).toISOString(),
      color: event.color,
      status: event.status,
      userId
    };
  
    try {
      const res = await axiosInstance.post('/Event', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      onEventAdded?.();
      navigate('/userDashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(Array.isArray(err.response?.data) ? err.response?.data.join(', ') : err.response?.data?.message || "Failed to create event");
        console.error("Error response:", err.response?.data);
        console.error("Error status", err.response?.status);
      } else {
        setError("An unexpected error occurred");
        console.error("Unexpected error:", err);
      }
    } finally {
      setIsSubmitting(false);
      window.location.reload()
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={event.title}
            onChange={handleInputChange}
            required
            placeholder="Enter event title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black focus:border-black"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            id="description"
            value={event.description}
            onChange={handleInputChange}
            rows={2}
            placeholder="Add event description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black focus:border-black"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="start" className="block text-sm font-medium text-gray-700">Start</label>
            <div className="relative">
              <CalendarIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="datetime-local"
                name="start"
                id="start"
                value={event.start}
                onChange={handleInputChange}
                required
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>
          </div>

          <div>
            <label htmlFor="end" className="block text-sm font-medium text-gray-700">End</label>
            <div className="relative">
              <ClockIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="datetime-local"
                name="end"
                id="end"
                value={event.end}
                onChange={handleInputChange}
                required
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
            <div className="relative">
              <TagIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="color"
                name="color"
                id="color"
                value={event.color}
                onChange={handleInputChange}
                className="w-full h-9 pl-8 pr-3 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <div className="relative">
              <CheckCircleIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                name="status"
                id="status"
                value={event.status}
                onChange={handleInputChange}
                required
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black focus:border-black"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors duration-200"
          >
            Close
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? 'Adding Event...' : 'Add Event'}
          </button>
        </div>
      </form>
    </div>
  );
}