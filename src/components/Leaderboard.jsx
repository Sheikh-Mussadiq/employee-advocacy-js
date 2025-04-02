import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { User, Calendar, ArrowDown } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

const MOCK_USERS = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  points: Math.floor(Math.random() * 1000),
  avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
  isMe: i === 42,
})).sort((a, b) => b.points - a.points);

const PRESET_RANGES = [
  {
    label: 'This Week',
    getValue: () => {
      const now = new Date();
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      return [start, now];
    },
  },
  {
    label: 'This Month',
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return [start, now];
    },
  },
  {
    label: 'Last 30 Days',
    getValue: () => {
      const now = new Date();
      const start = new Date(now);
      start.setDate(now.getDate() - 30);
      return [start, now];
    },
  },
  {
    label: 'Last 90 Days',
    getValue: () => {
      const now = new Date();
      const start = new Date(now);
      start.setDate(now.getDate() - 90);
      return [start, now];
    },
  },
  {
    label: 'This Year',
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      return [start, now];
    },
  },
];

export default function Leaderboard() {
  const [dateRange, setDateRange] = useState([
    new Date(new Date().setDate(1)),
    new Date(),
  ]);
  const [startDate, endDate] = dateRange;
  const [isCustomDate, setIsCustomDate] = useState(false);
  const myPositionRef = useRef(null);

  const handlePresetRange = (getValue) => {
    setDateRange(getValue());
    setIsCustomDate(false);
  };

  const handleCustomDateChange = (update) => {
    setDateRange(update);
    setIsCustomDate(true);
  };

  const scrollToMyPosition = () => {
    myPositionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const myPosition = MOCK_USERS.findIndex(user => user.isMe) + 1;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
        <p className="text-gray-600 mt-1">Top 100 contributors this month</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESET_RANGES.map(({ label, getValue }) => (
            <button
              key={label}
              onClick={() => handlePresetRange(getValue)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !isCustomDate && dateRange[0]?.getTime() === getValue()[0].getTime()
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={handleCustomDateChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholderText="Custom date range"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Your Position</h3>
            <p className="text-2xl font-bold text-blue-600">#{myPosition}</p>
          </div>
          <button
            onClick={scrollToMyPosition}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <ArrowDown className="w-4 h-4" />
            <span>View Position</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_USERS.map((user) => (
          <div
            key={user.id}
            ref={user.isMe ? myPositionRef : null}
            className={`flex items-center p-4 bg-white rounded-lg shadow-sm ${
              user.isMe ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {user.isMe && (
                <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                  <User className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-medium text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.points} points</p>
            </div>
            <div className="text-2xl font-bold text-gray-900">#{user.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}