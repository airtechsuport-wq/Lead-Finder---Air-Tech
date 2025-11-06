import React, { useState, useCallback, useEffect } from 'react';
import { Lead, CompanyProfile, SavedProfile } from './types';
import { findLeads } from './services/geminiService';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import LeadList from './components/LeadList';
import LeadDetailModal from './components/LeadDetailModal';
import CompanyProfileForm from './components/CompanyProfileForm';
import ExportButton from './components/ExportButton';
import LoginScreen from './components/LoginScreen';
import ProfileDashboard from './components/ProfileDashboard';

type View = 'dashboard' | 'form' | 'loading' | 'results' | 'error';

// Helper functions for localStorage
const loadProfilesFromStorage = (userEmail: string): SavedProfile[] => {
  try {
    const allData = JSON.parse(localStorage.getItem('airtech_user_data') || '{}');
    return allData[userEmail] || [];
  } catch (e) {
    console.error("Failed to parse user data from localStorage", e);
    return [];
  }
};

const saveProfilesToStorage = (userEmail: string, profiles: SavedProfile[]) => {
  try {
    const allData = JSON.parse(localStorage.getItem('airtech_user_data') || '{}');
    allData[userEmail] = profiles;
    localStorage.setItem('airtech_user_data', JSON.stringify(allData));
  } catch (e) {
    console.error("Failed to save user data to localStorage", e);
  }
};

const loadUsers = (): Record<string, { password: string }> => {
    try {
        return JSON.parse(localStorage.getItem('airtech_users') || '{}');
    } catch (e) {
        console.error("Failed to parse users from localStorage", e);
        return {};
    }
}

const saveUsers = (users: Record<string, { password: string }>) => {
    try {
        localStorage.setItem('airtech_users', JSON.stringify(users));
    } catch (e) {
        console.error("Failed to save users to localStorage", e);
    }
}


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [view, setView] = useState<View>('dashboard');
  
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Check for active session on initial load
  useEffect(() => {
    const activeUserEmail = sessionStorage.getItem('airtech_current_user');
    if (activeUserEmail) {
      logInUser(activeUserEmail);
    }
  }, []);

  const logInUser = (email: string) => {
    const userEmail = email.toLowerCase().trim();
    setCurrentUser(userEmail);
    const userProfiles = loadProfilesFromStorage(userEmail);
    setSavedProfiles(userProfiles);
    setIsLoggedIn(true);
    setView('dashboard');
  };

  const handleAuth = async (mode: 'login' | 'signup', email: string, password: string): Promise<boolean> => {
    const userEmail = email.toLowerCase().trim();
    const users = loadUsers();

    if (mode === 'signup') {
        if (users[userEmail]) {
            alert('An account with this email already exists. Please log in.');
            return false;
        }
        users[userEmail] = { password };
        saveUsers(users);
    }

    const user = users[userEmail];
    if (!user || user.password !== password) {
        if (mode === 'login') alert('Invalid email or password.');
        return false;
    }

    logInUser(userEmail);
    sessionStorage.setItem('airtech_current_user', userEmail);
    return true;
  };

  const handleLogout = () => {
    sessionStorage.removeItem('airtech_current_user');
    setCurrentUser(null);
    setIsLoggedIn(false);
    setSavedProfiles([]);
    setSelectedProfileIds([]);
    setLeads([]);
    setError(null);
  };

  const handleSaveProfile = (name: string, profile: CompanyProfile) => {
    if (!currentUser) return;

    setIsSavingProfile(true);
    setTimeout(() => {
        const newProfile: SavedProfile = {
          id: new Date().toISOString(),
          name,
          profile,
        };
        const updatedProfiles = [...savedProfiles, newProfile];
        setSavedProfiles(updatedProfiles);
        saveProfilesToStorage(currentUser, updatedProfiles);
        
        setView('dashboard');
        setIsSavingProfile(false);
    }, 500);
  };
  
  const handleProfileSelectionChange = (id: string, isSelected: boolean) => {
    setSelectedProfileIds(prev => {
      if (isSelected) {
        return [...prev, id];
      } else {
        return prev.filter(profileId => profileId !== id);
      }
    });
  };

  const handleSearch = useCallback(async () => {
    if (selectedProfileIds.length === 0) {
        alert("Please select at least one profile to search for leads.");
        return;
    }

    const profilesToSearch = savedProfiles.filter(p => selectedProfileIds.includes(p.id));

    setIsSearching(true);
    setView('loading');
    setError(null);
    setLeads([]);

    try {
      const leadPromises = profilesToSearch.map(p => findLeads(p.profile));
      const results = await Promise.all(leadPromises);
      const allLeads = results.flat(); // Combine all lead arrays into one
      setLeads(allLeads);
      setView('results');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      setView('error');
    } finally {
      setIsSearching(false);
    }
  }, [selectedProfileIds, savedProfiles]);

  const handleTryAgain = () => {
      setView('dashboard');
      setError(null);
  }

  const handleGoBackToDashboard = () => {
      setView('dashboard');
      setLeads([]);
      setError(null);
      setSelectedProfileIds([]);
  }

  const renderMainContent = () => {
    switch (view) {
        case 'loading':
            return <LoadingSpinner message="Searching for leads and generating reports..." />;
        
        case 'error':
            return (
                <div className="text-center text-red-400 bg-red-900/30 border border-red-500 p-6 rounded-lg max-w-md mx-auto">
                    <h3 className="text-xl font-bold mb-2">An Error Occurred</h3>
                    <p>{error}</p>
                    <button
                        onClick={handleTryAgain}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            );

        case 'results':
            return (
                <div className="w-full max-w-5xl mx-auto px-4 flex flex-col items-center">
                    <div className="w-full flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Prospecting Report Generated</h2>
                        <ExportButton leads={leads} />
                    </div>
                    <LeadList leads={leads} onSelectLead={setSelectedLead} />
                </div>
            );
        
        case 'form':
            return <CompanyProfileForm onSubmit={handleSaveProfile} onCancel={() => setView('dashboard')} isSaving={isSavingProfile} />;

        case 'dashboard':
        default:
            return (
                <ProfileDashboard
                    profiles={savedProfiles}
                    selectedProfileIds={selectedProfileIds}
                    onProfileSelectionChange={handleProfileSelectionChange}
                    onCreateNewProfile={() => setView('form')}
                    onFindLeads={handleSearch}
                    isSearching={isSearching}
                />
            );
    }
  };

  if (!isLoggedIn) {
      return <LoginScreen onAuth={handleAuth} />;
  }
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header 
        isProfileSet={view === 'results' || view === 'loading' || view === 'error'} 
        onEditProfile={handleGoBackToDashboard} 
        isLoggedIn={isLoggedIn}
        currentUserEmail={currentUser}
        onLogout={handleLogout}
      />
      <main className="flex-grow flex items-center justify-center p-4">
        {renderMainContent()}
      </main>
      <footer className="text-center p-4 text-xs text-gray-600">
        <p>Built with React, Tailwind CSS, and Gemini API.</p>
      </footer>
      <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </div>
  );
};

export default App;