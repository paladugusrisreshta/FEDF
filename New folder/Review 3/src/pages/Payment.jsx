// Payment.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import { 
  CreditCard, ShieldCheck, Download, Calendar, DollarSign, 
  MapPin, ShoppingBag, Send, ArrowLeft, CheckCircle2 
} from 'lucide-react';
import './Payment.css';

export default function Payment() {
  const navigate = useNavigate();
  const { customization, calculateCosts, saveBooking, resetCustomization } = useApp();
  const { currentUser } = useAuth();

  const tempBooking = customization.tempBooking;

  // State management
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  
  const [validationError, setValidationError] = useState('');

  // Fallback if no active checkout booking
  if (!tempBooking) {
    return (
      <div className="payment-page page-fade-in text-center">
        <div className="payment-empty-container glass-card">
          <Calendar size={48} className="gold-icon mb-16 animate-bounce" />
          <h2>No Reservations Pending</h2>
          <p>Please select a room suite or banquet hall from our options to initialize payment checkout.</p>
          <button className="luxury-btn luxury-btn-primary mt-16" onClick={() => navigate('/rooms')}>
            Browse Rooms
          </button>
        </div>
      </div>
    );
  }

  // Calculate costs based on the temp booking structure
  const costs = calculateCosts(tempBooking);

  const handlePay = async (e) => {
    e.preventDefault();
    setValidationError('');
    setIsProcessing(true);

    // Validations
    if (paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') {
      if (cardNumber.replace(/\s+/g, '').length !== 16) {
        setValidationError('Invalid card number. Must be 16 digits.');
        setIsProcessing(false);
        return;
      }
      if (!expiry || cvv.length !== 3) {
        setValidationError('Invalid expiry or CVV.');
        setIsProcessing(false);
        return;
      }
    } else if (['UPI', 'Google Pay', 'PhonePe', 'Paytm'].includes(paymentMethod)) {
      if (!upiId.includes('@')) {
        setValidationError('Invalid UPI handle. Must contain "@".');
        setIsProcessing(false);
        return;
      }
    }

    const txId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const finalBooking = {
      ...tempBooking,
      guestEmail: currentUser?.email || 'guest@luxury.com',
      guestName: currentUser?.name || 'Valued Guest',
      customisation: { ...customization, tempBooking: null }, // Attach all customized parameters
      payment: {
        method: paymentMethod,
        transactionId: txId,
        status: paymentMethod === 'Cash At Hotel' ? 'Pending' : 'Paid'
      }
    };

    try {
      const res = await saveBooking(finalBooking);
      if (res.success) {
        setConfirmedBooking(res.booking);
        setIsPaid(true);

        // Run Confetti celebration!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });

        // Reset wizard customization
        resetCustomization();
      }
    } catch (err) {
      setValidationError('Failed to sync payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate jsPDF Invoice PDF
  const downloadInvoicePDF = () => {
    if (!confirmedBooking) return;

    const doc = new jsPDF();
    const goldColor = [197, 168, 128];

    // Background Frame
    doc.setDrawColor(230, 220, 205);
    doc.rect(5, 5, 200, 287);

    // Hotel Header
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text('GRAND STERLING HOTEL', 20, 30);

    doc.setFontSize(8);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('742 Premium Avenue, Belgravia, London, SW1X 8NY | +44 (20) 7946 0921', 20, 36);

    // Divider
    doc.setDrawColor(197, 168, 128);
    doc.line(20, 42, 190, 42);

    // Bill metadata
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('INVOICE / BOOKING CONFIRMATION', 20, 52);

    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Booking ID: ${confirmedBooking.id}`, 20, 62);
    doc.text(`Date of Issue: ${new Date(confirmedBooking.date).toLocaleDateString()}`, 20, 68);
    doc.text(`Guest Name: ${confirmedBooking.guestName}`, 20, 74);
    doc.text(`Email: ${confirmedBooking.guestEmail}`, 20, 80);

    // Booking specifications
    doc.setFont('Helvetica', 'bold');
    doc.text('RESERVATION DETAILS:', 20, 92);
    doc.setFont('Helvetica', 'normal');

    if (confirmedBooking.type === 'Room') {
      doc.text(`Sanctuary: ${confirmedBooking.roomTypeName} (${confirmedBooking.numRooms} Room/s)`, 20, 100);
      doc.text(`Stay Duration: ${confirmedBooking.days} Days / ${confirmedBooking.nights} Nights`, 20, 106);
      doc.text(`Check-In Date: ${confirmedBooking.checkIn} [Slot: ${confirmedBooking.checkInSlot}]`, 20, 112);
      doc.text(`Check-Out Date: ${confirmedBooking.checkOut} [Slot: ${confirmedBooking.checkOutSlot}]`, 20, 118);
      
      // Customisations details
      doc.setFont('Helvetica', 'bold');
      doc.text('SUITE CUSTOMISATIONS:', 20, 130);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Pillow Type: ${confirmedBooking.customisation.pillowType}`, 20, 138);
      doc.text(`Acoustics Soundscape: ${confirmedBooking.customisation.musicMood}`, 20, 144);
      doc.text(`Ambient Theme: ${confirmedBooking.customisation.roomThemeName}`, 20, 150);
      doc.text(`Balcony Setup: ${confirmedBooking.customisation.balconyType} (${confirmedBooking.customisation.balconySeating})`, 20, 156);
      doc.text(`Dining Arrangements: ${confirmedBooking.customisation.balconyDining}`, 20, 162);
      doc.text(`Pre-stocked Minibar: ${confirmedBooking.customisation.minibarItems.join(', ') || 'None'}`, 20, 168);
    } else {
      doc.text(`Hall Rental: ${confirmedBooking.hallTypeName}`, 20, 100);
      doc.text(`Occasion Name: ${confirmedBooking.eventName}`, 20, 106);
      doc.text(`Booking Date: ${confirmedBooking.eventDate}`, 20, 112);
      doc.text(`Add-ons: ${[
        confirmedBooking.cateringRequired && 'Catering',
        confirmedBooking.decorationRequired && 'Decoration',
        confirmedBooking.soundSystemRequired && 'Audio sound'
      ].filter(Boolean).join(', ') || 'None'}`, 20, 118);
    }

    // Payment details
    doc.setFont('Helvetica', 'bold');
    doc.text('PAYMENT RECEIPT:', 20, 184);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Method of Payment: ${confirmedBooking.payment.method}`, 20, 192);
    doc.text(`Transaction Reference: ${confirmedBooking.payment.transactionId}`, 20, 198);
    doc.text(`Receipt Status: ${confirmedBooking.payment.status}`, 20, 204);

    // Bill Calculations
    doc.line(20, 214, 190, 214);

    doc.setFontSize(11);
    if (confirmedBooking.type === 'Room') {
      doc.text(`Suite Rental Cost Subtotal:`, 20, 224);
      doc.text(`₹${confirmedBooking.costs.roomSubtotal.toFixed(2)}`, 150, 224);
      doc.text(`Suite Customisation Subtotal:`, 20, 230);
      doc.text(`₹${confirmedBooking.costs.customSubtotal.toFixed(2)}`, 150, 230);
    } else {
      doc.text(`Banquet Hall Rental Cost Subtotal:`, 20, 224);
      doc.text(`₹${confirmedBooking.costs.banquetSubtotal.toFixed(2)}`, 150, 224);
    }

    doc.text(`Taxation Levy (18% GST):`, 20, 240);
    doc.text(`₹${confirmedBooking.costs.gst.toFixed(2)}`, 150, 240);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(`Grand Total Invoiced Amount:`, 20, 252);
    doc.text(`₹${confirmedBooking.costs.grandTotal.toFixed(2)}`, 150, 252);

    doc.setFontSize(10);
    doc.setFont('Helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for choosing Grand Sterling Hotel Group. Enjoy your sanctuary.', 20, 275);

    // Save File
    doc.save(`invoice-${confirmedBooking.id}.pdf`);
  };

  if (isPaid && confirmedBooking) {
    return (
      <div className="payment-page page-fade-in text-center">
        <div className="payment-success-card glass-card">
          <CheckCircle2 className="success-heavy-icon text-success animate-pulse mb-16" size={64} />
          <h1 className="success-title font-serif">Sanctuary Reserved</h1>
          <span className="success-subtitle">Booking Ref: {confirmedBooking.id}</span>
          <p className="success-desc">
            Your payment was processed successfully. A booking confirmation voucher and details have been registered.
          </p>

          <div className="success-details-box text-left">
            <div className="success-row"><span>Transaction ID:</span> <strong>{confirmedBooking.payment.transactionId}</strong></div>
            <div className="success-row"><span>Payment Method:</span> <strong>{confirmedBooking.payment.method}</strong></div>
            <div className="success-row"><span>Grand Total Paid:</span> <strong>₹{confirmedBooking.costs.grandTotal}</strong></div>
          </div>

          <div className="success-actions mt-24">
            <button className="luxury-btn luxury-btn-primary w-full download-btn" onClick={downloadInvoicePDF}>
              <Download size={16} /> Download Invoice Receipt (PDF)
            </button>
            <button className="luxury-btn luxury-btn-secondary w-full mt-10" onClick={() => navigate('/dashboard')}>
              Go to Guest Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page page-fade-in">
      <div className="payment-container">
        
        {/* Header */}
        <div className="payment-header text-center">
          <span className="section-subtitle">SECURE GATEWAY</span>
          <h1 className="section-title">Reservations Settlement</h1>
          <div className="section-divider"></div>
        </div>

        <div className="payment-layout-grid">
          
          {/* Left Column: Settlement checkout billing details breakdown */}
          <div className="glass-card billing-summary-panel">
            <h2 className="panel-title mb-20">Billing Breakdown</h2>
            
            <div className="billing-summary-list">
              {tempBooking.type === 'Room' ? (
                <>
                  <div className="billing-item-row">
                    <div>
                      <span>{tempBooking.roomTypeName} Rental</span>
                      <small>₹{calculateCosts(tempBooking).roomSubtotal / tempBooking.nights / tempBooking.numRooms} × {tempBooking.nights} nights × {tempBooking.numRooms} room(s)</small>
                    </div>
                    <strong>₹{costs.roomSubtotal}</strong>
                  </div>

                  <div className="billing-item-row">
                    <div>
                      <span>Suite Customisations</span>
                      <small>Balconies, lights, and food details subtotal</small>
                    </div>
                    <strong>₹{costs.customSubtotal}</strong>
                  </div>
                </>
              ) : (
                <div className="billing-item-row">
                  <div>
                    <span>{tempBooking.hallTypeName} Banquet Hall Rental</span>
                    <small>Event Date: {tempBooking.eventDate}</small>
                  </div>
                  <strong>₹{costs.banquetSubtotal}</strong>
                </div>
              )}

              <div className="billing-item-row gst-row">
                <span>Taxation (18% GST)</span>
                <strong>₹{costs.gst}</strong>
              </div>

              <div className="billing-item-row grand-total-row">
                <span>Grand Total Settled</span>
                <span className="grand-price">₹{costs.grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Details Input */}
          <div className="glass-card payment-form-panel">
            <h2 className="panel-title mb-24">Select Payment Method</h2>

            {validationError && (
              <div className="payment-error-banner mb-24">
                <ShieldCheck size={16} className="text-danger" /> <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handlePay} className="payment-gateway-form">
              
              <div className="payment-methods-selector mb-20">
                {['Credit Card', 'Debit Card', 'UPI', 'Google Pay', 'PhonePe', 'Paytm', 'Net Banking', 'Cash At Hotel'].map(method => (
                  <button 
                    key={method}
                    type="button"
                    className={`pay-method-btn ${paymentMethod === method ? 'active' : ''}`}
                    onClick={() => { setPaymentMethod(method); setValidationError(''); }}
                  >
                    <span>{method}</span>
                  </button>
                ))}
              </div>

              {/* Card Inputs */}
              {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
                <div className="card-payment-fields animate-fade">
                  <div className="form-group mb-16">
                    <label className="form-label" htmlFor="cardNum">Card Number</label>
                    <div className="input-wrapper-decor">
                      <CreditCard size={16} className="input-icon-decor" />
                      <input 
                        type="text" 
                        id="cardNum"
                        maxLength="19"
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 '))}
                        className="luxury-input field-input-decor"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="expiry">Expiry Date</label>
                      <input 
                        type="text" 
                        id="expiry"
                        maxLength="5"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value.replace(/[^\d/]/g, ''))}
                        className="luxury-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="cvv">CVV</label>
                      <input 
                        type="password" 
                        id="cvv"
                        maxLength="3"
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        className="luxury-input"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI and Mobile Wallets Inputs */}
              {['UPI', 'Google Pay', 'PhonePe', 'Paytm'].includes(paymentMethod) && (
                <div className="upi-payment-fields animate-fade">
                  <div className="form-group">
                    <label className="form-label" htmlFor="upiId">Enter UPI ID / VPA / Mobile Handle</label>
                    <input 
                      type="text" 
                      id="upiId"
                      placeholder="e.g. guestname@okaxis or mobile@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="luxury-input"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Net Banking Inputs */}
              {paymentMethod === 'Net Banking' && (
                <div className="net-banking-fields animate-fade mb-16">
                  <div className="form-group">
                    <label className="form-label" htmlFor="bankSelect">Select Bank</label>
                    <select id="bankSelect" className="luxury-input">
                      <option>Grand Sterling Private Wealth</option>
                      <option>Imperial London Bank</option>
                      <option>Barclays Wealth & Investment</option>
                      <option>HSBC Private Banking</option>
                      <option>National Westminster Bank (NatWest)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Cash At Hotel info */}
              {paymentMethod === 'Cash At Hotel' && (
                <div className="cash-payment-info-box animate-fade">
                  <ShieldCheck size={18} className="text-gold" />
                  <p>Settlement details will be transferred to your room invoice. Please settle outstanding bill at concierge desk during check-out.</p>
                </div>
              )}

              <button type="submit" className="luxury-btn luxury-btn-primary w-full pay-submit-btn" disabled={isProcessing}>
                {isProcessing ? 'Authorizing Transact...' : `Settle & Pay ₹${costs.grandTotal}`}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
