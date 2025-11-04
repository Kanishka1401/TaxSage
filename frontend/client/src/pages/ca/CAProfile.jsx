import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.jsx';

const CAProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    icaiNumber: user?.icaiNumber || '',
    phone: '',
    experience: '',
    specialization: [],
    firmName: ''
  });

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#293241] font-sans">
      <header className="bg-white shadow-sm border-b border-[#98c1d9]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/ca/dashboard')}
                className="flex items-center text-[#3d5a80] hover:text-[#293241] transition-colors font-medium"
              >
                ← Back to Dashboard
              </button>
              <div>
                <h1 className="text-xl font-semibold text-[#293241]">CA Profile</h1>
                <p className="text-[#3d5a80] text-sm">Manage your professional profile</p>
              </div>
            </div>
            <button 
              onClick={handleSignOut}
              className="text-[#ee6c4d] hover:text-[#d45a3d] transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-[#98c1d9] p-8">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 bg-[#3d5a80] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {user?.name?.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[#293241]">{user?.name}</h2>
              <p className="text-[#3d5a80]">ICAI Number: {user?.icaiNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d5a80] mb-2">Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg bg-[#e0fbfc] focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3d5a80] mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg bg-[#f8fafc]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3d5a80] mb-2">ICAI Number</label>
              <input
                type="text"
                value={profileData.icaiNumber}
                disabled
                className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg bg-[#f8fafc]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3d5a80] mb-2">Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg bg-[#e0fbfc] focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
              />
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="bg-[#3d5a80] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2d4566] transition-colors">
                  Save Changes
                </button>
                <button onClick={() => setIsEditing(false)} className="border border-[#98c1d9] text-[#3d5a80] px-6 py-3 rounded-lg font-medium hover:bg-[#e0fbfc] transition-colors">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="bg-[#3d5a80] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2d4566] transition-colors">
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CAProfile;