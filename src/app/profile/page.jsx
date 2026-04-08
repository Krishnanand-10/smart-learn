'use client';

import { useSession, signOut } from 'next-auth/react';
import { User, Mail, Camera, AlertTriangle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [localImage, setLocalImage] = useState(null);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'var(--text-main)' }}>
        Loading profile...
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  const user = session?.user;
  const displayImage = localImage || user?.image;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLocalImage(imageUrl);
      // In a real app with a DB, you would upload this file to S3/Cloudinary and save the URL to your database.
    }
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently erase all your data."
    );
    if (confirmDelete) {
      // Here you would typically call your backend API to delete the user record from your DB
      alert('Account deletion initiated. You will be signed out.');
      signOut({ callbackUrl: '/' });
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '4rem 2rem',
      color: 'var(--text-main)',
      fontFamily: "var(--font-family, 'Inter', sans-serif)"
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-highlight)', marginBottom: '2rem' }}>
        Profile Settings
      </h1>

      {/* Personal Information Section */}
      <section style={{
        backgroundColor: 'var(--bg-sidebar)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={20} color="var(--accent-color)" />
          Personal Information
        </h2>

        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          {/* Profile Image Column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '120px', height: '120px',
              borderRadius: '50%',
              border: '3px solid var(--border-color)',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#1f2937'
            }}>
              {displayImage ? (
                <img src={displayImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={60} color="#4b5563" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              )}
            </div>
            
            <label style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
              color: '#e2e8f0'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
            >
              <Camera size={16} />
              Change Image
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>JPG, GIF or PNG. Max 2MB.</span>
          </div>

          {/* Form Fields Column */}
          <div style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Full Name</label>
              <div style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <User size={16} color="#94a3b8" />
                {user?.name || "Not provided"}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Email Address</label>
              <div style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <Mail size={16} color="#94a3b8" />
                {user?.email || "Not provided"}
              </div>
              <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                Your email is synced with your Google account and cannot be changed here.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone Section */}
      <section style={{
        backgroundColor: 'var(--bg-sidebar)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '2rem'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} />
          Danger Zone
        </h2>
        
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.5rem', maxWidth: '600px' }}>
          Permanently erase your account and all associated data. This action cannot be reversed.
        </p>

        <button 
          onClick={handleDeleteAccount}
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#ef4444',
            padding: '0.65rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#ef4444';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#ef4444';
          }}
        >
          <Trash2 size={18} />
          Delete Account
        </button>
      </section>
    </div>
  );
}
