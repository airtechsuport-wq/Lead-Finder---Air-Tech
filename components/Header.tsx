import React from 'react';

interface HeaderProps {
    isProfileSet: boolean;
    onEditProfile: () => void;
    isLoggedIn: boolean;
    currentUserEmail: string | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isProfileSet, onEditProfile, isLoggedIn, currentUserEmail, onLogout }) => {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 relative">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Lead Finder <span className="text-blue-400">AirTech</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-400">
            AI-Powered B2B Prospecting Automation
        </p>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-6 lg:right-8 flex items-center space-x-4">
        {isProfileSet && (
            <button 
                onClick={onEditProfile}
                className="text-sm text-blue-400 hover:text-white border border-blue-600 hover:bg-blue-600 rounded-lg px-3 py-1.5 transition-all duration-200"
            >
                Back to Dashboard
            </button>
        )}
        {isLoggedIn && currentUserEmail && (
            <>
                <span className="text-sm text-gray-300 hidden md:inline">{currentUserEmail}</span>
                <button 
                    onClick={onLogout} 
                    className="text-sm text-red-400 hover:text-white border border-red-600 hover:bg-red-600 rounded-lg px-3 py-1.5 transition-all duration-200"
                >
                    Logout
                </button>
            </>
        )}
      </div>
    </header>
  );
};

export default Header;