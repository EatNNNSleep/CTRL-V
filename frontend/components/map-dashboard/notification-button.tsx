"use client";

import { useState } from "react";
import { Bell, X, AlertTriangle, Leaf, Droplets, Sun, ChevronRight } from "lucide-react";

interface Notification {
  id: string;
  type: "alert" | "info" | "weather";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Disease Alert",
    message: "Leaf Rust detected 5km away from your tomato field",
    time: "10 min ago",
    isRead: false,
  },
  {
    id: "2",
    type: "weather",
    title: "Weather Warning",
    message: "Heavy rain expected tomorrow. Consider covering crops.",
    time: "1 hour ago",
    isRead: false,
  },
  {
    id: "3",
    type: "info",
    title: "Harvest Ready",
    message: "Your wheat in Field B is ready for harvest",
    time: "3 hours ago",
    isRead: true,
  },
  {
    id: "4",
    type: "alert",
    title: "Pest Detection",
    message: "Aphids spotted in nearby farms. Monitor your crops.",
    time: "Yesterday",
    isRead: true,
  },
  {
    id: "5",
    type: "info",
    title: "Growth Update",
    message: "Tomatoes have reached 68% maturity",
    time: "2 days ago",
    isRead: true,
  },
];

export function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "weather":
        return <Sun className="w-4 h-4 text-amber-500" />;
      case "info":
        return <Leaf className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-red-50";
      case "weather":
        return "bg-amber-50";
      case "info":
        return "bg-green-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex-shrink-0 glass-card w-11 h-11 rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
      >
        <Bell className="w-5 h-5 text-[#4caf50]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">{unreadCount}</span>
          </span>
        )}
      </button>

      {/* Notification Panel Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

          {/* Notification Panel */}
          <div className="fixed inset-x-0 top-0 z-50 p-4 animate-in slide-in-from-top duration-300">
            <div className="glass-card rounded-3xl shadow-2xl overflow-hidden max-h-[80vh]">
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
                  <p className="text-xs text-gray-500">{unreadCount} unread alerts</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Notification List */}
              <div className="overflow-y-auto max-h-[60vh]">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-5 py-4 border-b border-gray-50 flex items-start gap-3 ${
                      !notification.isRead ? "bg-green-50/50" : ""
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${getBgColor(notification.type)} flex items-center justify-center flex-shrink-0`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-gray-800">{notification.title}</h3>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{notification.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-[#4caf50] rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-gray-100">
                <button className="w-full text-center text-sm font-medium text-[#4caf50] flex items-center justify-center gap-1">
                  <span>View All Notifications</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
