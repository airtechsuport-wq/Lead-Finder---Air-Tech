import React from 'react';
import { SavedProfile } from '../types';
import SpinnerIcon from './SpinnerIcon';

interface ProfileDashboardProps {
  profiles: SavedProfile[];
  selectedProfileIds: string[];
  onProfileSelectionChange: (id: string, isSelected: boolean) => void;
  onCreateNewProfile: () => void;
  onFindLeads: () => void;
  isSearching: boolean;
}

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({
  profiles,
  selectedProfileIds,
  onProfileSelectionChange,
  onCreateNewProfile,
  onFindLeads,
  isSearching,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Your Saved Profiles</h2>
        <button
          onClick={onCreateNewProfile}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Create New Profile</span>
        </button>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-12 px-6 bg-gray-900 border border-dashed border-gray-700 rounded-lg">
          <h3 className="text-xl font-semibold text-white">No profiles found.</h3>
          <p className="text-gray-400 mt-2">Get started by creating your first company profile.</p>
          <button onClick={onCreateNewProfile} className="mt-4 text-blue-400 font-semibold hover:underline">
            Create one now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {profiles.map((p) => (
            <div
              key={p.id}
              className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex items-center space-x-4 transition-colors hover:border-blue-600"
            >
              <input
                type="checkbox"
                id={`profile-${p.id}`}
                className="h-5 w-5 rounded bg-gray-800 border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                checked={selectedProfileIds.includes(p.id)}
                onChange={(e) => onProfileSelectionChange(p.id, e.target.checked)}
              />
              <label htmlFor={`profile-${p.id}`} className="flex-grow cursor-pointer">
                <h4 className="font-semibold text-white">{p.name}</h4>
                <p className="text-sm text-gray-400 truncate">
                  {p.profile.icp} ({p.profile.country || 'País não especificado'})
                </p>
              </label>
            </div>
          ))}
        </div>
      )}

      {profiles.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onFindLeads}
            disabled={selectedProfileIds.length === 0 || isSearching}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 transform hover:scale-105 flex items-center justify-center min-w-[300px]"
          >
            {isSearching ? (
                <>
                    <SpinnerIcon className="w-5 h-5 mr-3" />
                    Searching...
                </>
            ) : (
                `Find Leads for Selected Profiles (${selectedProfileIds.length})`
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDashboard;
