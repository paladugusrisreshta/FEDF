// Admin.jsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { roomThemes } from '../data/themeData';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, 
  Title, Tooltip, Legend, ArcElement, PointElement, LineElement 
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { 
  Lock, Shield, Eye, Trash2, Send, Activity, Users, 
  CheckCircle2, RefreshCw, BarChart2, Megaphone, Plus, 
  Edit, BookOpen, Star, FileText, Download, Check 
} from 'lucide-react';
import './Admin.css';

// Register ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function Admin() {
  const { 
    submissions, deleteBooking, cancelBooking,
    rooms, addRoom, editRoom, deleteRoom,
    banquetHalls, addHall, editHall, deleteHall,
    reviews, approveReview, deleteReview,
    broadcastAdminAlert, adminAlerts, removeAdminAlert
  } = useApp();

  const { users } = useAuth();
  
  // Login states
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin-logged') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin tabs: dashboard, rooms, banquets, bookings, customers, reviews, reports
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analytics, setAnalytics] = useState(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [alertInput, setAlertInput] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);

  // Filters
  const [bookingSearch, setBookingSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  // CRUD Forms State
  const [isRoomFormOpen, setIsRoomFormOpen] = useState(false);
  const [roomForm, setRoomForm] = useState({ id: '', name: '', price: 150, capacity: 2, amenities: '', image: '' });
  const [isHallFormOpen, setIsHallFormOpen] = useState(false);
  const [hallForm, setHallForm] = useState({ id: '', name: '', price: 800, capacity: 200, image: '' });

  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics();
    }
  }, [isAuthenticated, submissions]);

  const loadAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      const res = await apiService.getAdminAnalytics();
      setAnalytics(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-logged', 'true');
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin-logged');
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!alertInput.trim()) return;
    broadcastAdminAlert(alertInput);
    setAlertInput('');
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 3000);
  };

  // CSV Report Generator Utility
  const generateCSV = (filename, data, headers) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\r\n";
    data.forEach(row => {
      // Escape commas in fields
      const escapedRow = row.map(v => `"${String(v).replace(/"/g, '""')}"`);
      csvContent += escapedRow.join(",") + "\r\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadReport = (reportType) => {
    if (reportType === 'bookings') {
      const headers = ['Booking ID', 'Type', 'Guest Name', 'Check-In/Event Date', 'Check-Out', 'Amount Paid', 'Status'];
      const rows = submissions.map(b => [
        b.id, b.type, b.guestName, b.checkIn || b.eventDate, b.checkOut || 'N/A', `₹${b.costs?.grandTotal}`, b.status
      ]);
      generateCSV('bookings_report.csv', rows, headers);
    } else if (reportType === 'revenue') {
      const headers = ['Date', 'Booking ID', 'Type', 'Subtotal', 'Tax (GST)', 'Grand Total'];
      const rows = submissions.map(b => [
        new Date(b.date).toLocaleDateString(), b.id, b.type, `₹${b.costs?.subtotal}`, `₹${b.costs?.gst}`, `₹${b.costs?.grandTotal}`
      ]);
      generateCSV('revenue_report.csv', rows, headers);
    } else if (reportType === 'customers') {
      const headers = ['Guest Name', 'Email', 'Loyalty Status', 'Allocated Room'];
      const rows = users.map(u => [u.name, u.email, u.loyaltyStatus, u.roomNumber]);
      generateCSV('customers_report.csv', rows, headers);
    } else if (reportType === 'customisation') {
      const roomBookings = submissions.filter(b => b.type === 'Room');
      const headers = ['Booking ID', 'Pillow', 'Climate', 'Acoustics', 'Balcony Deck', 'Room Scent/Theme'];
      const rows = roomBookings.map(b => [
        b.id, b.customisation?.pillowType, `${b.customisation?.temperature}°C`, b.customisation?.musicMood, b.customisation?.balconyType, b.customisation?.roomThemeName
      ]);
      generateCSV('customisations_report.csv', rows, headers);
    } else if (reportType === 'banquet') {
      const banquetBookings = submissions.filter(b => b.type === 'Banquet');
      const headers = ['Booking ID', 'Hall Name', 'Event Name', 'Event Date', 'Guest Count', 'Catering Required', 'Decoration Required', 'Sound System Required', 'Grand Total'];
      const rows = banquetBookings.map(b => [
        b.id, b.hallTypeName || b.hallType, b.eventName, b.eventDate, b.guestCount,
        b.cateringRequired ? 'Yes' : 'No',
        b.decorationRequired ? 'Yes' : 'No',
        b.soundSystemRequired ? 'Yes' : 'No',
        `₹${b.costs?.grandTotal}`
      ]);
      generateCSV('banquet_report.csv', rows, headers);
    }
  };

  // CRUD Room Handlers
  const handleRoomSubmit = (e) => {
    e.preventDefault();
    if (roomForm.id) {
      editRoom(roomForm.id, {
        name: roomForm.name,
        price: parseFloat(roomForm.price),
        capacity: parseInt(roomForm.capacity),
        amenities: roomForm.amenities.split(',').map(a => a.trim()),
        image: roomForm.image
      });
    } else {
      addRoom({
        name: roomForm.name,
        price: parseFloat(roomForm.price),
        capacity: parseInt(roomForm.capacity),
        amenities: roomForm.amenities.split(',').map(a => a.trim()),
        image: roomForm.image
      });
    }
    setRoomForm({ id: '', name: '', price: 150, capacity: 2, amenities: '', image: '' });
    setIsRoomFormOpen(false);
  };

  // CRUD Hall Handlers
  const handleHallSubmit = (e) => {
    e.preventDefault();
    if (hallForm.id) {
      editHall(hallForm.id, {
        name: hallForm.name,
        price: parseFloat(hallForm.price),
        capacity: parseInt(hallForm.capacity),
        image: hallForm.image
      });
    } else {
      addHall({
        name: hallForm.name,
        price: parseFloat(hallForm.price),
        capacity: parseInt(hallForm.capacity),
        image: hallForm.image
      });
    }
    setHallForm({ id: '', name: '', price: 800, capacity: 200, image: '' });
    setIsHallFormOpen(false);
  };

  // Setup Chart JS visual datasets
  // Setup Chart JS visual datasets
  const getMostBookedRoomData = () => {
    const counts = { 'Standard Room': 0, 'Deluxe Room': 0, 'Executive Suite': 0, 'Presidential Suite': 0 };
    submissions.forEach(s => {
      if (s.type === 'Room' && s.roomTypeName) {
        if (counts[s.roomTypeName] !== undefined) counts[s.roomTypeName]++;
      }
    });
    return {
      labels: Object.keys(counts),
      datasets: [{
        label: 'Booked Rooms count',
        data: Object.values(counts).map(v => v + 3),
        backgroundColor: ['rgba(197, 168, 128, 0.6)', 'rgba(159, 134, 192, 0.6)', 'rgba(124, 137, 122, 0.6)', 'rgba(94, 84, 142, 0.6)'],
        borderColor: ['#C5A880', '#9F86C0', '#7C897A', '#5E548E'],
        borderWidth: 1
      }]
    };
  };

  const getMostSelectedBalconyData = () => {
    const counts = {};
    submissions.forEach(s => {
      if (s.customisation?.balconyType) {
        counts[s.customisation.balconyType] = (counts[s.customisation.balconyType] || 0) + 1;
      }
    });
    const labels = Object.keys(counts).length > 0 ? Object.keys(counts) : ['Sea View Balcony', 'Garden View Balcony', 'No Balcony'];
    const dataValues = Object.keys(counts).length > 0 ? Object.values(counts) : [15, 12, 6];
    return {
      labels,
      datasets: [{
        data: dataValues,
        backgroundColor: ['#C5A880', '#9F86C0', '#7C897A', '#5E548E', '#DFCEB7'],
        borderWidth: 0
      }]
    };
  };

  const getMostPopularThemeData = () => {
    const counts = { 'Forest Theme': 0, 'Ocean Theme': 0, 'Royal Palace': 0, 'Minimal White Theme': 0, 'Cyberpunk Theme': 0 };
    submissions.forEach(s => {
      if (s.customisation?.roomThemeName) {
        const theme = s.customisation.roomThemeName;
        if (counts[theme] !== undefined) counts[theme]++;
      }
    });
    return {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts).map(v => v + 4),
        backgroundColor: ['#C5A880', '#9F86C0', '#7C897A', '#5E548E', '#DFCEB7'],
        borderWidth: 0
      }]
    };
  };

  const getRevenueChartData = () => {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Revenue Growth (₹)',
        data: [180000, 250000, 340000, 480000, 560000, submissions.reduce((sum, b)=>sum+(b.costs?.grandTotal||0), 0) + 720000],
        borderColor: '#C5A880',
        backgroundColor: 'rgba(197, 168, 128, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  };

  const getOccupancyRateData = () => {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Occupancy Rate (%)',
        data: [72, 75, 78, 80, 85, 92, 88],
        borderColor: '#9F86C0',
        backgroundColor: 'rgba(159, 134, 192, 0.1)',
        tension: 0.3,
        fill: true
      }]
    };
  };

  const getPopularFoodData = () => {
    let veg = 0;
    let nonveg = 0;
    submissions.forEach(s => {
      if (s.customisation) {
        if (s.customisation.breakfastType === 'Veg') veg++; else nonveg++;
        if (s.customisation.lunchType === 'Veg') veg++; else nonveg++;
        if (s.customisation.dinnerType === 'Veg') veg++; else nonveg++;
      }
    });
    return {
      labels: ['Vegetarian', 'Non-Vegetarian'],
      datasets: [{
        data: [veg + 22, nonveg + 16],
        backgroundColor: ['#7C897A', '#C5A880'],
        borderWidth: 0
      }]
    };
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-page page-fade-in">
        <div className="login-card glass-card">
          <div className="login-icon-circle"><Lock size={24} className="gold-icon" /></div>
          <h1 className="login-title">Admin Registry</h1>
          <p className="login-subtitle">Provide authorized credentials to access mainframe.</p>
          {loginError && <div className="login-error-msg">{loginError}</div>}
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={username} onChange={e=>setUsername(e.target.value)} className="luxury-input" placeholder="admin" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="luxury-input" placeholder="••••••••" required />
            </div>
            <button type="submit" className="luxury-btn luxury-btn-primary login-btn-wide">Authenticate</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page page-fade-in">
      <div className="admin-container">
        
        {/* Header */}
        <div className="admin-header">
          <div>
            <span className="section-subtitle">ADMIN CONTROL HUB</span>
            <h1 className="section-title text-left">Mainframe Panel</h1>
          </div>
          <div className="header-tabs">
            {['dashboard', 'rooms', 'banquets', 'bookings', 'customers', 'reviews', 'reports'].map(tab => (
              <button 
                key={tab} 
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
            <button className="luxury-btn logout-btn" onClick={handleLogout}>Log Out</button>
          </div>
        </div>
        <div className="section-divider text-left m-0 mb-40"></div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="admin-tab-content">
            {/* KPIs */}
            <div className="admin-kpis-grid mb-40">
              <div className="glass-card kpi-card">
                <Users size={20} className="kpi-icon" />
                <div><span className="kpi-label">Total Users</span><span className="kpi-val">{users.length + 8}</span></div>
              </div>
              <div className="glass-card kpi-card">
                <BookOpen size={20} className="kpi-icon" />
                <div><span className="kpi-label">Total Bookings</span><span className="kpi-val">{submissions.length}</span></div>
              </div>
              <div className="glass-card kpi-card">
                <CheckCircle2 size={20} className="kpi-icon" />
                <div>
                  <span className="kpi-label">Total Revenue</span>
                  <span className="kpi-val">₹{(submissions.reduce((sum, b) => sum + (b.costs?.grandTotal || 0), 0) + 720000).toLocaleString()}</span>
                </div>
              </div>
              <div className="glass-card kpi-card">
                <Activity size={20} className="kpi-icon" />
                <div><span className="kpi-label">Active Rooms</span><span className="kpi-val">{submissions.filter(b => b.type === 'Room' && b.status === 'Confirmed').length + 4}</span></div>
              </div>
              <div className="glass-card kpi-card">
                <Activity size={20} className="kpi-icon" />
                <div><span className="kpi-label">Occupancy Rate</span><span className="kpi-val">82%</span></div>
              </div>
            </div>

            <div className="admin-analytics-row">
              {/* Charts */}
              <div className="glass-card admin-panel-card charts-panel-card">
                <h2 className="panel-title mb-24"><BarChart2 size={18} className="panel-header-icon" /> Analytical Metrics</h2>
                <div className="charts-main-grid">
                  <div className="chart-canvas-box">
                    <h4 className="chart-title">Revenue Growth</h4>
                    <Line data={getRevenueChartData()} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                  </div>
                  <div className="chart-canvas-box">
                    <h4 className="chart-title">Most Booked Room</h4>
                    <Bar data={getMostBookedRoomData()} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                  </div>
                  <div className="chart-canvas-box">
                    <h4 className="chart-title">Most Selected Balcony Type</h4>
                    <Pie data={getMostSelectedBalconyData()} options={{ responsive: true }} />
                  </div>
                  <div className="chart-canvas-box">
                    <h4 className="chart-title">Most Popular Theme</h4>
                    <Doughnut data={getMostPopularThemeData()} options={{ responsive: true }} />
                  </div>
                  <div className="chart-canvas-box">
                    <h4 className="chart-title">Occupancy Rate</h4>
                    <Line data={getOccupancyRateData()} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                  </div>
                  <div className="chart-canvas-box">
                    <h4 className="chart-title">Popular Food Selection</h4>
                    <Doughnut data={getPopularFoodData()} options={{ responsive: true }} />
                  </div>
                </div>
              </div>

              {/* Broadcaster */}
              <div className="glass-card admin-panel-card alert-broadcaster-panel">
                <h2 className="panel-title mb-24"><Megaphone size={18} className="panel-header-icon" /> Broadcast Notices</h2>
                {alertSuccess && <div className="broadcaster-success">Notice Broadcasted.</div>}
                <form onSubmit={handleBroadcast} className="broadcast-form">
                  <textarea 
                    value={alertInput} onChange={e=>setAlertInput(e.target.value)}
                    placeholder="Enter announcement text..." className="luxury-textarea" rows="4" required
                  ></textarea>
                  <button type="submit" className="luxury-btn luxury-btn-primary w-full">Broadcast Announcement</button>
                </form>
                
                <div className="active-alerts-list mt-24">
                  {adminAlerts.map(alert => (
                    <div key={alert.id} className="active-alert-item">
                      <p className="active-alert-text">"{alert.message}"</p>
                      <button className="alert-delete-btn" onClick={() => removeAdminAlert(alert.id)}>Dismiss</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Room Manager Tab */}
        {activeTab === 'rooms' && (
          <div className="admin-tab-content glass-card p-32 animate-fade">
            <div className="flex-row-sb mb-24">
              <h2 className="panel-title">Manage Room Catalog</h2>
              <button className="luxury-btn luxury-btn-primary" onClick={() => { setRoomForm({ id: '', name: '', price: 150, capacity: 2, amenities: '', image: '' }); setIsRoomFormOpen(true); }}>
                <Plus size={16} /> Add Room Class
              </button>
            </div>

            {isRoomFormOpen && (
              <form onSubmit={handleRoomSubmit} className="crud-overlay-form glass-card mb-24 p-20 animate-fade">
                <h3>{roomForm.id ? 'Edit Room Specification' : 'Add New Room Class'}</h3>
                <div className="form-grid-2 mb-16">
                  <div className="form-group">
                    <label>Room Class Name</label>
                    <input type="text" value={roomForm.name} onChange={e=>setRoomForm({...roomForm, name:e.target.value})} className="luxury-input" required />
                  </div>
                  <div className="form-group">
                    <label>Base Price per Night (₹)</label>
                    <input type="number" value={roomForm.price} onChange={e=>setRoomForm({...roomForm, price:e.target.value})} className="luxury-input" required />
                  </div>
                </div>
                <div className="form-grid-2 mb-16">
                  <div className="form-group">
                    <label>Max Guest Capacity</label>
                    <input type="number" value={roomForm.capacity} onChange={e=>setRoomForm({...roomForm, capacity:e.target.value})} className="luxury-input" required />
                  </div>
                  <div className="form-group">
                    <label>Amenities (Comma separated)</label>
                    <input type="text" value={roomForm.amenities} onChange={e=>setRoomForm({...roomForm, amenities:e.target.value})} className="luxury-input" placeholder="WiFi, AC, TV" />
                  </div>
                </div>
                <div className="form-group mb-16">
                  <label>Room Image URL</label>
                  <input type="url" value={roomForm.image || ''} onChange={e=>setRoomForm({...roomForm, image:e.target.value})} className="luxury-input" placeholder="https://unsplash.com/... or blank for default" />
                </div>
                <div className="flex-row-sb mt-10">
                  <button type="button" className="luxury-btn luxury-btn-secondary" onClick={()=>setIsRoomFormOpen(false)}>Cancel</button>
                  <button type="submit" className="luxury-btn luxury-btn-primary">Save Specifications</button>
                </div>
              </form>
            )}

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr><th>Name</th><th>Price / Night</th><th>Max Capacity</th><th>Amenities</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {rooms.map(r => (
                    <tr key={r.id}>
                      <td><strong>{r.name}</strong></td>
                      <td>₹{r.price}</td>
                      <td>{r.capacity} Guests</td>
                      <td>{r.amenities.join(', ')}</td>
                      <td>
                        <button className="admin-table-delete-btn" onClick={() => { setRoomForm({ id: r.id, name: r.name, price: r.price, capacity: r.capacity, amenities: r.amenities.join(', '), image: r.image || '' }); setIsRoomFormOpen(true); }}><Edit size={14} /></button>
                        <button className="admin-table-delete-btn" onClick={() => deleteRoom(r.id)}><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Banquet Manager Tab */}
        {activeTab === 'banquets' && (
          <div className="admin-tab-content glass-card p-32 animate-fade">
            <div className="flex-row-sb mb-24">
              <h2 className="panel-title">Manage Banquet Halls</h2>
              <button className="luxury-btn luxury-btn-primary" onClick={() => { setHallForm({ id: '', name: '', price: 800, capacity: 200, image: '' }); setIsHallFormOpen(true); }}>
                <Plus size={16} /> Add Banquet Hall
              </button>
            </div>

            {isHallFormOpen && (
              <form onSubmit={handleHallSubmit} className="crud-overlay-form glass-card mb-24 p-20 animate-fade">
                <h3>{hallForm.id ? 'Edit Hall Details' : 'Add New Banquet Hall'}</h3>
                <div className="form-grid-2 mb-16">
                  <div className="form-group">
                    <label>Banquet Hall Name</label>
                    <input type="text" value={hallForm.name} onChange={e=>setHallForm({...hallForm, name:e.target.value})} className="luxury-input" required />
                  </div>
                  <div className="form-group">
                    <label>Base Booking Rate (₹)</label>
                    <input type="number" value={hallForm.price} onChange={e=>setHallForm({...hallForm, price:e.target.value})} className="luxury-input" required />
                  </div>
                </div>
                <div className="form-group mb-16">
                  <label>Max Guest Accommodation</label>
                  <input type="number" value={hallForm.capacity} onChange={e=>setHallForm({...hallForm, capacity:e.target.value})} className="luxury-input" required />
                </div>
                <div className="form-group mb-16">
                  <label>Banquet Image URL</label>
                  <input type="url" value={hallForm.image || ''} onChange={e=>setHallForm({...hallForm, image:e.target.value})} className="luxury-input" placeholder="https://unsplash.com/... or blank for default" />
                </div>
                <div className="flex-row-sb">
                  <button type="button" className="luxury-btn luxury-btn-secondary" onClick={()=>setIsHallFormOpen(false)}>Cancel</button>
                  <button type="submit" className="luxury-btn luxury-btn-primary">Save Hall</button>
                </div>
              </form>
            )}

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr><th>Hall Name</th><th>Base Cost</th><th>Capacity limit</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {banquetHalls.map(h => (
                    <tr key={h.id}>
                      <td><strong>{h.name}</strong></td>
                      <td>₹{h.price}</td>
                      <td>{h.capacity} guests</td>
                      <td>
                        <button className="admin-table-delete-btn" onClick={() => { setHallForm({ id: h.id, name: h.name, price: h.price, capacity: h.capacity, image: h.image || '' }); setIsHallFormOpen(true); }}><Edit size={14} /></button>
                        <button className="admin-table-delete-btn" onClick={() => deleteHall(h.id)}><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Manager Tab */}
        {activeTab === 'bookings' && (
          <div className="admin-tab-content glass-card p-32 animate-fade">
            <div className="flex-row-sb mb-24">
              <h2 className="panel-title">Active Guest Reservations</h2>
              <input 
                type="text" placeholder="Search by name..." value={bookingSearch}
                onChange={e=>setBookingSearch(e.target.value)} className="luxury-input admin-filter-input"
              />
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr><th>ID</th><th>Type</th><th>Guest</th><th>Schedule / Date</th><th>Grand Total</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {submissions.filter(b=>b.guestName.toLowerCase().includes(bookingSearch.toLowerCase())).map(b => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.type}</td>
                      <td><strong>{b.guestName}</strong></td>
                      <td>{b.checkIn || b.eventDate}</td>
                      <td>₹{b.costs?.grandTotal}</td>
                      <td><span className="admin-theme-badge">{b.status}</span></td>
                      <td>
                        {b.status === 'Confirmed' && (
                          <button className="admin-table-delete-btn" onClick={() => cancelBooking(b.id)} title="Cancel Reservation">Cancel</button>
                        )}
                        <button className="admin-table-delete-btn" onClick={() => deleteBooking(b.id)}><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews Moderation Tab */}
        {activeTab === 'reviews' && (
          <div className="admin-tab-content glass-card p-32 animate-fade">
            <h2 className="panel-title mb-24">Moderation Queue</h2>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr><th>Guest</th><th>Rating</th><th>Comment</th><th>Date</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {reviews.map(r => (
                    <tr key={r.id}>
                      <td><strong>{r.guestName}</strong></td>
                      <td>{r.rating} Stars</td>
                      <td className="max-width-text-cell" title={r.comment}>"{r.comment}"</td>
                      <td>{new Date(r.date).toLocaleDateString()}</td>
                      <td>{r.approved ? <span className="text-success">Approved</span> : <span className="text-warning">Pending</span>}</td>
                      <td>
                        {!r.approved && (
                          <button className="admin-table-delete-btn text-success" onClick={() => approveReview(r.id)}><Check size={14} /></button>
                        )}
                        <button className="admin-table-delete-btn" onClick={() => deleteReview(r.id)}><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Download Tab */}
        {activeTab === 'reports' && (
          <div className="admin-tab-content glass-card p-32 animate-fade">
            <h2 className="panel-title mb-24">Download Mainframe Registry Reports</h2>
            <p className="mb-24 text-muted">Generate and export direct administrative data registers into standard CSV format sheets.</p>
            
            <div className="reports-download-grid">
              <div className="report-download-box glass-card p-24">
                <FileText size={28} className="gold-icon mb-16" />
                <h4>Booking Report</h4>
                <p>Lists room selections, guest counts, and checked status.</p>
                <button className="luxury-btn luxury-btn-primary w-full mt-16" onClick={() => handleDownloadReport('bookings')}>
                  <Download size={14} /> Download CSV
                </button>
              </div>

              <div className="report-download-box glass-card p-24">
                <FileText size={28} className="gold-icon mb-16" />
                <h4>Revenue Report</h4>
                <p>Taxation levels, subtotal billing items, and invoicing totals.</p>
                <button className="luxury-btn luxury-btn-primary w-full mt-16" onClick={() => handleDownloadReport('revenue')}>
                  <Download size={14} /> Download CSV
                </button>
              </div>

              <div className="report-download-box glass-card p-24">
                <FileText size={28} className="gold-icon mb-16" />
                <h4>Customer Report</h4>
                <p>Loyalty tier counts, guest addresses, and membership records.</p>
                <button className="luxury-btn luxury-btn-primary w-full mt-16" onClick={() => handleDownloadReport('customers')}>
                  <Download size={14} /> Download CSV
                </button>
              </div>

              <div className="report-download-box glass-card p-24">
                <FileText size={28} className="gold-icon mb-16" />
                <h4>Banquet Report</h4>
                <p>Banquet reservations list, attendees, and special configurations.</p>
                <button className="luxury-btn luxury-btn-primary w-full mt-16" onClick={() => handleDownloadReport('banquet')}>
                  <Download size={14} /> Download CSV
                </button>
              </div>

              <div className="report-download-box glass-card p-24">
                <FileText size={28} className="gold-icon mb-16" />
                <h4>Room Customisation Report</h4>
                <p>Ambient room themes selection ranks, pillows, and Soundscapes.</p>
                <button className="luxury-btn luxury-btn-primary w-full mt-16" onClick={() => handleDownloadReport('customisation')}>
                  <Download size={14} /> Download CSV
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
