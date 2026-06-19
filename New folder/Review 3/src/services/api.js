// api.js
import axios from 'axios';
import { getLocal, setLocal } from './storage';

// Simulated latency (ms)
const LATENCY = 800;

// Setup a mock base URL (won't be hit directly, but structured for scalability)
const apiClient = axios.create({
  baseURL: 'https://api.luxury-stay-portal.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer mock-jwt-token-luxury-stay-2026'
  }
});

// Helper to simulate API response
const simulateApiResponse = (data, success = true) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve({ data, status: 200, statusText: 'OK' });
      } else {
        reject({
          response: {
            data: { message: 'Failed to communicate with hotel server' },
            status: 500
          }
        });
      }
    }, LATENCY);
  });
};

export const apiService = {
  // Sync preferences to hotel central management system
  syncPreferences: async (preference) => {
    console.log('[API] Syncing room preferences...', preference);
    // Mimic actual axios post
    // return apiClient.post('/room-customisations', preference);
    
    // Fallback simulated call
    const submissions = getLocal('guest-portal-submissions', []);
    const updatedSubmissions = [preference, ...submissions];
    setLocal('guest-portal-submissions', updatedSubmissions);
    
    return simulateApiResponse({
      success: true,
      message: 'Room customization synchronized successfully.',
      syncId: `SYNC-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString()
    });
  },

  // Fetch hotel notifications
  getNotifications: async () => {
    console.log('[API] Fetching notifications...');
    const notifications = getLocal('guest-portal-notifications', [
      {
        id: '1',
        message: 'Welcome to Luxury Stay Portal! Customize your room experience before arrival.',
        date: new Date(Date.now() - 86400000).toISOString(),
        read: false,
        type: 'info'
      },
      {
        id: '2',
        message: 'Your room temperature has been pre-set to 21°C as requested.',
        date: new Date(Date.now() - 3600000).toISOString(),
        read: true,
        type: 'success'
      }
    ]);
    return simulateApiResponse(notifications);
  },

  // Fetch Admin analytics dashboard
  getAdminAnalytics: async () => {
    console.log('[API] Fetching admin dashboard analytics...');
    const submissions = getLocal('guest-portal-submissions', []);
    
    // Analyze pillow preferences
    const pillowCounts = { 'Soft': 0, 'Medium': 0, 'Firm': 0, 'Memory Foam': 0 };
    // Analyze music preferences
    const musicCounts = { 'Classical': 0, 'Jazz': 0, 'Ambient': 0, 'Nature Sounds': 0, 'No Music': 0 };
    // Analyze theme choices
    const themeCounts = {};

    submissions.forEach(sub => {
      // Map pillow display names
      const pType = sub.pillowType.replace(' Pillow', '');
      if (pillowCounts[pType] !== undefined) pillowCounts[pType]++;
      else pillowCounts[pType] = 1;

      // Map music
      const mMood = sub.musicMood === 'Nature' ? 'Nature Sounds' : sub.musicMood;
      if (musicCounts[mMood] !== undefined) musicCounts[mMood]++;
      else musicCounts[mMood] = 1;

      // Map themes
      if (themeCounts[sub.roomThemeName]) {
        themeCounts[sub.roomThemeName]++;
      } else {
        themeCounts[sub.roomThemeName] = 1;
      }
    });

    // Populate with fallback mock counts if empty to look beautiful
    if (submissions.length === 0) {
      pillowCounts['Soft'] = 14;
      pillowCounts['Medium'] = 28;
      pillowCounts['Firm'] = 10;
      pillowCounts['Memory Foam'] = 19;

      musicCounts['Classical'] = 22;
      musicCounts['Jazz'] = 15;
      musicCounts['Ambient'] = 25;
      musicCounts['Nature Sounds'] = 18;
      musicCounts['No Music'] = 4;

      themeCounts['Forest Nature'] = 12;
      themeCounts['Luxury Gold Suite'] = 18;
      themeCounts['Minimal White'] = 9;
      themeCounts['Cyberpunk Neon'] = 14;
      themeCounts['Spa Relaxation'] = 16;
    }

    const totalSubmissions = submissions.length + 71; // 71 simulated historic submissions
    
    return simulateApiResponse({
      totalUsers: totalSubmissions + 12,
      totalSubmissions: totalSubmissions,
      activeSessions: Math.floor(8 + Math.random() * 7),
      syncStatus: 'Optimal',
      charts: {
        pillows: Object.keys(pillowCounts).map(k => ({ name: k, count: pillowCounts[k] })),
        music: Object.keys(musicCounts).map(k => ({ name: k, count: musicCounts[k] })),
        themes: Object.keys(themeCounts).map(k => ({ name: k, count: themeCounts[k] })).sort((a,b) => b.count - a.count).slice(0, 5)
      }
    });
  }
};
