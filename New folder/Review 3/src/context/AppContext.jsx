// AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLocal, setLocal } from '../services/storage';
import { apiService } from '../services/api';

const AppContext = createContext();

const DEFAULT_ROOMS = [
  { id: 'standard', name: 'Standard Room', price: 4500, capacity: 2, image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80', amenities: ['Free WiFi', 'Flat TV', 'Air Climate', 'Standard Mini-bar'] },
  { id: 'deluxe', name: 'Deluxe Room', price: 9000, capacity: 2, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80', amenities: ['Free WiFi', 'Smart TV', 'Air Climate', 'Premium Mini-bar', 'Garden Balcony', 'Espresso Machine'] },
  { id: 'executive', name: 'Executive Suite', price: 18000, capacity: 3, image: '/images/executive_suite.png', amenities: ['Free WiFi', '8K Smart TV', 'Climate Zone', 'Ultra Mini-bar', 'Living Lounge', 'Private Office desk'] },
  { id: 'presidential', name: 'Presidential Suite', price: 35000, capacity: 4, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80', amenities: ['Free WiFi', 'Private Jacuzzi', 'Climate Zones', 'Butler Pantry', 'Grand Dining Room', 'Private Balcony Terrace'] }
];

const DEFAULT_BANQUET_HALLS = [
  { id: 'wedding', name: 'Grand Wedding Hall', price: 90000, capacity: 500, image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80' },
  { id: 'reception', name: 'Imperial Reception Hall', price: 50000, capacity: 400, image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=600&q=80' },
  { id: 'birthday', name: 'Celebration Birthday Hall', price: 15000, capacity: 150, image: 'https://images.unsplash.com/photo-1530103047019-74a2a5a4b3c4?auto=format&fit=crop&w=600&q=80' },
  { id: 'conference', name: 'Royal Conference Hall', price: 25000, capacity: 200, image: 'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=600&q=80' },
  { id: 'corporate', name: 'Elite Corporate Hall', price: 35000, capacity: 250, image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80' }
];

const DEFAULT_REVIEWS = [
  { id: 'rev-1', guestName: 'Lady Genevieve Sterling', rating: 5, comment: 'Simply stunning! The presidential suite themes are breathtaking. The personalized ambient systems made my check-in unforgettable.', date: new Date(Date.now() - 400000000).toISOString(), approved: true },
  { id: 'rev-2', guestName: 'Arthur Pendelton', rating: 5, comment: 'The Grand Wedding Hall was perfect for our anniversary reception. Exemplary catering and lighting systems!', date: new Date(Date.now() - 800000000).toISOString(), approved: true }
];

const DEFAULT_NOTIFICATIONS = [
  { id: 'notif-1', message: 'Welcome to Luxury Stay Portal! Book rooms, banquet halls, and customize your experience.', date: new Date(Date.now() - 172800000).toISOString(), read: true, type: 'info' }
];

const DEFAULT_CUSTOMIZATION = {
  // Room customization wizard temporary data
  pillowType: 'Soft Pillow',
  temperature: 21,
  musicMood: 'Ambient',
  minibarItems: [],
  roomTheme: 'maharaja-palace',
  roomThemeName: 'Maharaja Theme',
  specialRequests: '',
  // Balcony details
  balconyType: 'No Balcony',
  balconySeating: 'Single Chair',
  balconyDecoration: 'Fresh Flowers',
  balconyLighting: 'Warm Lights',
  balconyDining: 'No Dining Setup',
  balconyTheme: 'Nature Green Theme',
  // Furniture details
  sofaType: 'No Sofa',
  roomLighting: 'Warm Lighting',
  wallColor: 'White',
  // Food Preferences
  breakfastType: 'Veg',
  lunchType: 'Veg',
  dinnerType: 'Veg',
  specialDiet: 'None'
};

const DEFAULT_BOOKINGS = [
  {
    id: 'LSH-8291',
    type: 'Room',
    guestName: 'Lady Genevieve Sterling',
    guestEmail: 'guest@luxury.com',
    roomType: 'executive',
    roomTypeName: 'Executive Suite',
    checkIn: '2026-06-10',
    checkOut: '2026-06-13',
    checkInSlot: 'Afternoon (12 PM – 4 PM)',
    checkOutSlot: 'Morning',
    numGuests: 2,
    numRooms: 1,
    date: new Date(Date.now() - 259200000).toISOString(),
    // Customisations
    customisation: {
      pillowType: 'Memory Foam Pillow',
      temperature: 20,
      musicMood: 'Ambient',
      minibarItems: ['Water', 'Chocolate', 'Wine'],
      roomTheme: 'maharaja-palace',
      roomThemeName: 'Maharaja Theme',
      specialRequests: 'Please place some fresh lavender stems next to the dresser.',
      balconyType: 'Garden View Balcony',
      balconySeating: 'Luxury Sofa Seating',
      balconyDecoration: 'Fresh Flowers',
      balconyLighting: 'Smart RGB Lights',
      balconyDining: 'Evening Tea Setup',
      balconyTheme: 'Nature Green Theme',
      sofaType: 'Double Sofa',
      roomLighting: 'Romantic Lighting',
      wallColor: 'Sage Green',
      breakfastType: 'Veg',
      lunchType: 'Veg',
      dinnerType: 'Non-Veg',
      specialDiet: 'None'
    },
    payment: {
      method: 'Credit Card',
      transactionId: 'TXN-9028310',
      status: 'Paid'
    },
    costs: {
      roomSubtotal: 54000, // 18000 * 3 nights
      customSubtotal: 4000, 
      subtotal: 58000,
      gst: 10440,
      grandTotal: 68440
    },
    status: 'Confirmed'
  }
];

export const AppProvider = ({ children }) => {
  // Catalogues
  const [rooms, setRooms] = useState(() => getLocal('guest-portal-rooms-catalog', DEFAULT_ROOMS));
  const [banquetHalls, setBanquetHalls] = useState(() => getLocal('guest-portal-halls-catalog', DEFAULT_BANQUET_HALLS));

  // Reviews
  const [reviews, setReviews] = useState(() => getLocal('guest-portal-reviews', DEFAULT_REVIEWS));

  // Bookings (unified submissions table)
  const [submissions, setSubmissions] = useState(() => getLocal('guest-portal-bookings', DEFAULT_BOOKINGS));

  // Temporary wizard customisation
  const [customization, setCustomization] = useState(() => getLocal('guest-portal-current-custom', DEFAULT_CUSTOMIZATION));

  // System alerts & notifications
  const [notifications, setNotifications] = useState(() => getLocal('guest-portal-notifications', DEFAULT_NOTIFICATIONS));
  const [adminAlerts, setAdminAlerts] = useState(() => getLocal('guest-portal-admin-alerts', []));
  const [syncStatus, setSyncStatus] = useState('synced');
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync state back to storage
  useEffect(() => { setLocal('guest-portal-rooms-catalog', rooms); }, [rooms]);
  useEffect(() => { setLocal('guest-portal-halls-catalog', banquetHalls); }, [banquetHalls]);
  useEffect(() => { setLocal('guest-portal-reviews', reviews); }, [reviews]);
  useEffect(() => { setLocal('guest-portal-bookings', submissions); }, [submissions]);
  useEffect(() => { setLocal('guest-portal-current-custom', customization); }, [customization]);
  useEffect(() => { setLocal('guest-portal-notifications', notifications); }, [notifications]);
  useEffect(() => { setLocal('guest-portal-admin-alerts', adminAlerts); }, [adminAlerts]);

  // Cost calculation function
  const calculateCosts = (bookingData) => {
    let roomSubtotal = 0;
    let customSubtotal = 0;
    let banquetSubtotal = 0;

    const nights = bookingData.nights || 1;
    const roomsCount = bookingData.numRooms || 1;

    if (bookingData.type === 'Room') {
      const room = rooms.find(r => r.id === bookingData.roomType);
      const roomPrice = room ? room.price : 150;
      roomSubtotal = roomPrice * nights * roomsCount;

      // Customisation subtotal
      const custom = bookingData.customisation || customization;

      // Balcony type costs
      const balconyCosts = {
        'No Balcony': 0,
        'Garden View Balcony': 1500,
        'Pool View Balcony': 2000,
        'City View Balcony': 1200,
        'Mountain View Balcony': 1800,
        'Sea View Balcony': 3500,
        'Luxury Private Balcony': 5000
      };
      const balconyCost = balconyCosts[custom.balconyType] || 0;
      customSubtotal += balconyCost * nights;

      // Balcony dining
      const diningCosts = {
        'No Dining Setup': 0,
        'Breakfast Setup': 800,
        'Evening Tea Setup': 600,
        'Candle Light Dinner': 4000,
        'Private Dining Experience': 6500
      };
      customSubtotal += (diningCosts[custom.balconyDining] || 0);

      // Balcony seating
      const seatingCosts = { 'Single Chair': 300, 'Double Chair': 500, 'Couple Seating': 800, 'Luxury Sofa Seating': 1500, 'Swing Chair': 1000 };
      customSubtotal += (seatingCosts[custom.balconySeating] || 0);

      // Balcony lighting
      const balconyLightCosts = { 'Warm Lights': 400, 'Fairy Lights': 300, 'Lantern Lights': 600, 'Smart RGB Lights': 1000 };
      customSubtotal += (balconyLightCosts[custom.balconyLighting] || 0);

      // Balcony decorations
      const decoCosts = { 'Fresh Flowers': 1000, 'Romantic Decoration': 2500, 'Birthday Decoration': 2000, 'Anniversary Decoration': 2300, 'Candle Light Setup': 1500, 'Premium Luxury Setup': 3500 };
      customSubtotal += (decoCosts[custom.balconyDecoration] || 0);

      // Sofa selections
      const sofaCosts = { 'No Sofa': 0, 'Single Sofa': 1000, 'Double Sofa': 1800, 'Luxury Sofa Set': 3500, 'Recliner Sofa': 2500 };
      customSubtotal += (sofaCosts[custom.sofaType] || 0);

      // Room lighting
      const roomLightCosts = { 'Warm Lighting': 500, 'Cool Lighting': 500, 'Romantic Lighting': 600, 'Party Lighting': 700, 'Smart RGB Lighting': 800 };
      customSubtotal += (roomLightCosts[custom.roomLighting] || 0);

      // Wall color
      const wallColorCosts = { 'White': 0, 'Beige': 0, 'Grey': 800, 'Lavender Purple': 800, 'Sky Blue': 800, 'Sage Green': 800, 'Luxury Gold': 2500 };
      customSubtotal += (wallColorCosts[custom.wallColor] || 0);

      // Food costs
      let foodDailyCost = 0;
      if (custom.breakfastType) foodDailyCost += (custom.breakfastType === 'Veg' ? 500 : 700);
      if (custom.lunchType) foodDailyCost += (custom.lunchType === 'Veg' ? 1200 : 1500);
      if (custom.dinnerType) foodDailyCost += (custom.dinnerType === 'Veg' ? 1500 : 2000);
      if (custom.specialDiet && custom.specialDiet !== 'None') foodDailyCost += 400;
      customSubtotal += foodDailyCost * nights;

    } else if (bookingData.type === 'Banquet') {
      const hall = banquetHalls.find(h => h.id === bookingData.hallType);
      const hallPrice = hall ? hall.price : 25000;
      banquetSubtotal += hallPrice;

      if (bookingData.cateringRequired) banquetSubtotal += (bookingData.guestCount || 10) * 1500; // ₹1500 per head
      if (bookingData.decorationRequired) banquetSubtotal += 15000;
      if (bookingData.soundSystemRequired) banquetSubtotal += 8000;
    }

    const subtotal = roomSubtotal + customSubtotal + banquetSubtotal;
    const gst = subtotal * 0.18;
    const grandTotal = subtotal + gst;

    return {
      roomSubtotal,
      customSubtotal,
      banquetSubtotal,
      subtotal,
      gst: parseFloat(gst.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2))
    };
  };

  // Rooms CRUD
  const addRoom = (room) => {
    const defaultRoomImg = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80';
    setRooms(prev => [...prev, { 
      ...room, 
      id: room.name.toLowerCase().replace(/\s+/g, '-'),
      image: room.image || defaultRoomImg 
    }]);
    addNotification(`Room class "${room.name}" added to registry.`, 'info');
  };

  const editRoom = (id, updatedRoom) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updatedRoom } : r));
    addNotification(`Room class "${updatedRoom.name}" updated.`, 'info');
  };

  const deleteRoom = (id) => {
    setRooms(prev => prev.filter(r => r.id !== id));
    addNotification('Room class removed from register.', 'warning');
  };

  // Banquet Halls CRUD
  const addHall = (hall) => {
    const defaultHallImg = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80';
    setBanquetHalls(prev => [...prev, { 
      ...hall, 
      id: hall.name.toLowerCase().replace(/\s+/g, '-'),
      image: hall.image || defaultHallImg
    }]);
    addNotification(`Banquet hall "${hall.name}" registered.`, 'info');
  };

  const editHall = (id, updatedHall) => {
    setBanquetHalls(prev => prev.map(h => h.id === id ? { ...h, ...updatedHall } : h));
    addNotification(`Banquet hall "${updatedHall.name}" updated.`, 'info');
  };

  const deleteHall = (id) => {
    setBanquetHalls(prev => prev.filter(h => h.id !== id));
    addNotification('Banquet hall removed from database.', 'warning');
  };

  // Reviews CRUD
  const submitReview = (guestName, rating, comment) => {
    const newReview = {
      id: `rev-${Date.now()}`,
      guestName,
      rating,
      comment,
      date: new Date().toISOString(),
      approved: false // Requires admin approval
    };
    setReviews(prev => [newReview, ...prev]);
    addNotification('Your review has been submitted for approval.', 'success');
  };

  const approveReview = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: true } : r));
    addNotification('Customer review approved and published.', 'success');
  };

  const deleteReview = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    addNotification('Review erased.', 'info');
  };

  // Booking submissions logic
  const saveBooking = async (bookingData) => {
    setIsSyncing(true);
    setSyncStatus('pending');

    const bookingId = `LSH-${Math.floor(1000 + Math.random() * 9000)}`;
    const calculated = calculateCosts(bookingData);
    
    const newBooking = {
      ...bookingData,
      id: bookingId,
      date: new Date().toISOString(),
      costs: calculated,
      status: 'Confirmed'
    };

    try {
      // Mock axios push to PHP/Node servers
      await apiService.syncPreferences(newBooking);
      setSubmissions(prev => [newBooking, ...prev]);
      setSyncStatus('synced');
      
      addNotification(`Booking ${bookingId} confirmed! Payment received.`, 'success');
      return { success: true, booking: newBooking };
    } catch (e) {
      console.error(e);
      setSubmissions(prev => [newBooking, ...prev]);
      setSyncStatus('error');
      addNotification(`Booking saved offline. Sync pending reconnect.`, 'warning');
      return { success: true, booking: newBooking, offline: true };
    } finally {
      setIsSyncing(false);
    }
  };

  const cancelBooking = (id) => {
    setSubmissions(prev =>
      prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b)
    );
    addNotification(`Booking ${id} has been cancelled. Refund initialized.`, 'warning');
  };

  const deleteBooking = (id) => {
    setSubmissions(prev => prev.filter(b => b.id !== id));
    addNotification(`Booking record ${id} removed from system.`, 'info');
  };

  const deleteSubmission = deleteBooking;

  const clearAllHistory = () => {
    setSubmissions([]);
    addNotification('All booking records cleared.', 'warning');
  };

  const updateCustomization = (fields) => {
    setCustomization(prev => ({
      ...prev,
      ...fields
    }));
  };

  const resetCustomization = () => {
    setCustomization(DEFAULT_CUSTOMIZATION);
  };

  // Notification utilities
  const addNotification = (message, type = 'info') => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      message,
      date: new Date().toISOString(),
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Admin announcement broadcasters
  const broadcastAdminAlert = (message) => {
    const newAlert = {
      id: `alert-${Date.now()}`,
      message,
      date: new Date().toISOString(),
      active: true
    };
    setAdminAlerts(prev => [newAlert, ...prev]);
    addNotification(`Global Announcement: ${message}`, 'warning');
  };

  const removeAdminAlert = (id) => {
    setAdminAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AppContext.Provider value={{
      rooms,
      addRoom,
      editRoom,
      deleteRoom,
      banquetHalls,
      addHall,
      editHall,
      deleteHall,
      reviews,
      submitReview,
      approveReview,
      deleteReview,
      submissions,
      saveBooking,
      cancelBooking,
      deleteBooking,
      deleteSubmission,
      clearAllHistory,
      customization,
      updateCustomization,
      resetCustomization,
      notifications,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      clearAllNotifications,
      adminAlerts,
      broadcastAdminAlert,
      removeAdminAlert,
      calculateCosts,
      syncStatus,
      isSyncing
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
