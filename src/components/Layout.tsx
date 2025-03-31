
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Bell, Clipboard, Heart, Clock, Settings, LogOut } from 'lucide-react';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6" />
          <h1 className="text-xl font-bold">TraumaLinker</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-5 w-5 cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium">
            EM
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        <aside className="w-16 bg-gray-100 flex flex-col items-center py-6 space-y-6">
          <Link to="/" className="p-2 rounded-lg bg-primary/10 text-primary">
            <Clipboard className="h-6 w-6" />
          </Link>
          <Link to="/" className="p-2 rounded-lg text-gray-500 hover:bg-gray-200">
            <Clock className="h-6 w-6" />
          </Link>
          <Link to="/" className="p-2 rounded-lg text-gray-500 hover:bg-gray-200">
            <Settings className="h-6 w-6" />
          </Link>
          <div className="flex-1"></div>
          <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-200">
            <LogOut className="h-6 w-6" />
          </button>
        </aside>
        
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
