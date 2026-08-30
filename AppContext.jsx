import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { WORKERS, CUSTOMERS, BOOKINGS, COOPERATIVES, SERVICES, COMPLAINTS, PAYMENTS, PLATFORM_STATS } from '../data/mockData';

const AppContext = createContext(null);

const initialState = {
  workers: [...WORKERS],
  customers: [...CUSTOMERS],
  bookings: [...BOOKINGS],
  cooperatives: [...COOPERATIVES],
  services: [...SERVICES],
  complaints: [...COMPLAINTS],
  payments: [...PAYMENTS],
  platformStats: { ...PLATFORM_STATS },
  currentUser: { ...CUSTOMERS[0], role: 'customer' },
  currentWorker: { ...WORKERS[0] },
  language: 'en',
  notifications: [
    { id: 'notif-1', title: 'Welcome to SAHAYAK', message: 'Explore certified cooperative services near you.', time: '10m ago' }
  ],
  activeBooking: BOOKINGS[0],
};

function generateBookingId() {
  const num = 10483 + Math.floor(Math.random() * 1000);
  return `SHY-2026-${num}`;
}

function generatePaymentId() {
  return `PAY-${String(Math.floor(Math.random() * 10000)).padStart(3, '0')}`;
}

function generateWorkerId(workers) {
  return `w${workers.length + 1}`;
}

function appReducer(state, action) {
  switch (action.type) {
    case 'CREATE_BOOKING': {
      const newBooking = {
        id: action.payload.id || generateBookingId(),
        customerId: action.payload.customerId || state.currentUser?.id || 'c1',
        customerName: action.payload.customerName || state.currentUser?.name || 'Ankit Joshi',
        customerPhone: action.payload.customerPhone || state.currentUser?.phone || '9988776655',
        workerId: action.payload.workerId || 'w1',
        workerName: action.payload.workerName || 'Ramesh Kumar',
        serviceId: action.payload.serviceId || 's1',
        serviceName: action.payload.serviceName || 'Electrician',
        problem: action.payload.problem || 'Standard Service Requirement',
        location: action.payload.location || { lat: 22.7196, lng: 75.8577, address: 'B-42, Vijay Nagar, Indore, MP 452010' },
        scheduledTime: action.payload.scheduledTime || new Date().toISOString(),
        isEmergency: action.payload.isEmergency || false,
        status: action.payload.status || 'confirmed',
        estimatedCost: action.payload.estimatedCost || { min: 350, max: 500 },
        finalCost: null,
        labourCharge: null,
        materialCharge: null,
        welfareContribution: 20,
        platformFee: 10,
        paymentStatus: 'pending',
        paymentMethod: null,
        rating: null,
        review: null,
        createdAt: new Date().toISOString(),
        aiMatchScore: action.payload.aiMatchScore || 96,
        ...action.payload,
      };

      return {
        ...state,
        bookings: [newBooking, ...state.bookings],
        activeBooking: newBooking,
        platformStats: {
          ...state.platformStats,
          jobsToday: (state.platformStats.jobsToday || 0) + 1,
        },
      };
    }

    case 'REGISTER_WORKER': {
      const newWorkerId = action.payload.id || generateWorkerId(state.workers);
      const isAutoVerified = action.payload.verificationStatus === 'verified';
      
      const newWorker = {
        id: newWorkerId,
        name: action.payload.name || 'New Worker',
        phone: action.payload.phone || '9876543299',
        email: action.payload.email || `${action.payload.name?.toLowerCase().replace(/\s+/g, '.') || 'worker'}@sahayak.coop`,
        photo: action.payload.photo || null,
        gender: action.payload.gender || 'male',
        age: parseInt(action.payload.age) || 28,
        cooperativeId: action.payload.cooperativeId || 'coop1',
        cooperativeName: action.payload.cooperativeName || 'Indore Labour Cooperative Society',
        skills: action.payload.skills || [action.payload.primarySkill || 'Electrician'],
        primarySkill: action.payload.primarySkill || action.payload.skills?.[0] || 'Electrician',
        serviceId: action.payload.serviceId || 's1',
        certifications: action.payload.certifications || ['Cooperative Member Certification'],
        experience: parseInt(action.payload.experience) || 3,
        languages: action.payload.languages || ['Hindi'],
        rating: 5.0,
        totalJobs: 0,
        completedJobs: 0,
        cancelledJobs: 0,
        availability: 'available',
        serviceRadius: parseInt(action.payload.serviceRadius) || 10,
        verificationStatus: action.payload.verificationStatus || 'pending',
        isVerified: isAutoVerified,
        identityVerified: isAutoVerified,
        skillVerified: isAutoVerified,
        certificateVerified: isAutoVerified,
        backgroundVerified: isAutoVerified,
        welfare: {
          status: 'active',
          insurance: true,
          pension: true,
          healthSupport: true,
          emergencyAssistance: true,
          skillDevelopment: true,
          ...action.payload.welfare,
        },
        insurance: {
          coverage: 500000,
          status: 'active',
          policyExpiry: '2026-12-31',
          provider: 'LIC of India',
          ...action.payload.insurance,
        },
        location: action.payload.location || { lat: 22.7196, lng: 75.8577, area: action.payload.area || 'Vijay Nagar, Indore' },
        earnings: { today: 0, week: 0, month: 0, total: 0 },
        joinedDate: new Date().toISOString().split('T')[0],
        bankAccount: action.payload.bankAccount || '',
        aadhaar: action.payload.aadhaar || '',
        ...action.payload,
      };

      const updatedWorkers = [newWorker, ...state.workers];

      return {
        ...state,
        workers: updatedWorkers,
        currentWorker: action.payload.setAsCurrent ? newWorker : state.currentWorker,
        platformStats: {
          ...state.platformStats,
          totalWorkers: (state.platformStats.totalWorkers || 0) + 1,
          verifiedWorkers: isAutoVerified ? (state.platformStats.verifiedWorkers || 0) + 1 : state.platformStats.verifiedWorkers,
        },
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: 'New Worker Registered',
            message: `${newWorker.name} (${newWorker.primarySkill}) registered with ${newWorker.cooperativeName}.`,
            time: 'Just now',
          },
          ...state.notifications,
        ],
      };
    }

    case 'VERIFY_WORKER': {
      const updatedWorkers = state.workers.map(w =>
        w.id === action.payload.workerId
          ? {
              ...w,
              verificationStatus: 'verified',
              isVerified: true,
              identityVerified: true,
              skillVerified: true,
              certificateVerified: true,
              backgroundVerified: true,
            }
          : w
      );

      const updatedCurrentWorker = state.currentWorker?.id === action.payload.workerId
        ? {
            ...state.currentWorker,
            verificationStatus: 'verified',
            isVerified: true,
            identityVerified: true,
            skillVerified: true,
            certificateVerified: true,
            backgroundVerified: true,
          }
        : state.currentWorker;

      return {
        ...state,
        workers: updatedWorkers,
        currentWorker: updatedCurrentWorker,
        platformStats: {
          ...state.platformStats,
          verifiedWorkers: (state.platformStats.verifiedWorkers || 0) + 1,
        },
      };
    }

    case 'SET_CURRENT_WORKER': {
      const worker = typeof action.payload === 'string'
        ? state.workers.find(w => w.id === action.payload)
        : action.payload;
      return { ...state, currentWorker: worker || state.currentWorker };
    }

    case 'UPDATE_BOOKING_STATUS': {
      const updatedBookings = state.bookings.map(b =>
        b.id === action.payload.bookingId
          ? { ...b, status: action.payload.status }
          : b
      );
      const updatedActive = state.activeBooking?.id === action.payload.bookingId
        ? { ...state.activeBooking, status: action.payload.status }
        : state.activeBooking;
      return { ...state, bookings: updatedBookings, activeBooking: updatedActive };
    }

    case 'COMPLETE_BOOKING': {
      const { bookingId, labourCharge = 400, materialCharge = 80 } = action.payload;
      const welfareContribution = 20;
      const platformFee = 10;
      const finalCost = labourCharge + materialCharge + welfareContribution + platformFee;

      const updatedBookings = state.bookings.map(b =>
        b.id === bookingId
          ? { ...b, status: 'completed', finalCost, labourCharge, materialCharge, welfareContribution, platformFee }
          : b
      );
      const updatedActive = state.activeBooking?.id === bookingId
        ? { ...state.activeBooking, status: 'completed', finalCost, labourCharge, materialCharge, welfareContribution, platformFee }
        : state.activeBooking;
      return { ...state, bookings: updatedBookings, activeBooking: updatedActive };
    }

    case 'MAKE_PAYMENT': {
      const { bookingId, method = 'UPI' } = action.payload;
      const booking = state.bookings.find(b => b.id === bookingId);
      const amount = booking?.finalCost || 510;

      const payment = {
        id: generatePaymentId(),
        bookingId,
        amount,
        method,
        status: 'completed',
        invoiceId: `INV-${(bookingId || '2026').replace('SHY-', '')}`,
        createdAt: new Date().toISOString(),
      };

      const updatedBookings = state.bookings.map(b =>
        b.id === bookingId ? { ...b, paymentStatus: 'paid', paymentMethod: method } : b
      );
      const updatedActive = state.activeBooking?.id === bookingId
        ? { ...state.activeBooking, paymentStatus: 'paid', paymentMethod: method }
        : state.activeBooking;

      // Update worker earnings
      const workerId = booking?.workerId || 'w1';
      const updatedWorkers = state.workers.map(w =>
        w.id === workerId
          ? {
              ...w,
              earnings: {
                ...w.earnings,
                today: (w.earnings?.today || 0) + (booking?.labourCharge || 400),
                month: (w.earnings?.month || 0) + (booking?.labourCharge || 400),
              },
            }
          : w
      );

      return {
        ...state,
        bookings: updatedBookings,
        activeBooking: updatedActive,
        payments: [payment, ...state.payments],
        workers: updatedWorkers,
        platformStats: {
          ...state.platformStats,
          monthlyRevenue: (state.platformStats.monthlyRevenue || 0) + (booking?.platformFee || 10),
          workerEarnings: (state.platformStats.workerEarnings || 0) + (booking?.labourCharge || 400),
        },
      };
    }

    case 'RATE_BOOKING': {
      const { bookingId, rating, review } = action.payload;
      const updatedBookings = state.bookings.map(b =>
        b.id === bookingId ? { ...b, rating, review } : b
      );

      const booking = state.bookings.find(b => b.id === bookingId);
      let updatedWorkers = state.workers;
      if (booking) {
        updatedWorkers = state.workers.map(w => {
          if (w.id === booking.workerId) {
            const ratedBookings = state.bookings.filter(b => b.workerId === w.id && b.rating);
            const totalRated = ratedBookings.length;
            const newRating = totalRated > 0
              ? ((w.rating * totalRated + rating) / (totalRated + 1)).toFixed(1)
              : rating;
            return {
              ...w,
              rating: parseFloat(newRating),
              completedJobs: (w.completedJobs || 0) + 1,
              totalJobs: (w.totalJobs || 0) + 1,
            };
          }
          return w;
        });
      }

      return { ...state, bookings: updatedBookings, workers: updatedWorkers };
    }

    case 'ACCEPT_JOB': {
      const updatedBookings = state.bookings.map(b =>
        b.id === action.payload.bookingId ? { ...b, status: 'worker_assigned' } : b
      );
      const updatedActive = state.activeBooking?.id === action.payload.bookingId
        ? { ...state.activeBooking, status: 'worker_assigned' }
        : state.activeBooking;
      return { ...state, bookings: updatedBookings, activeBooking: updatedActive };
    }

    case 'REJECT_JOB': {
      const updatedBookings = state.bookings.map(b =>
        b.id === action.payload.bookingId ? { ...b, status: 'cancelled', workerId: null, workerName: null } : b
      );
      return { ...state, bookings: updatedBookings };
    }

    case 'RAISE_COMPLAINT': {
      const newComplaint = {
        id: `CMP-${String(state.complaints.length + 1).padStart(3, '0')}`,
        customerId: state.currentUser?.id || 'c1',
        customerName: state.currentUser?.name || 'Ankit Joshi',
        status: 'submitted',
        createdAt: new Date().toISOString(),
        ...action.payload,
      };
      return { ...state, complaints: [newComplaint, ...state.complaints] };
    }

    case 'UPDATE_COMPLAINT_STATUS': {
      const updatedComplaints = state.complaints.map(c =>
        c.id === action.payload.complaintId ? { ...c, status: action.payload.status } : c
      );
      return { ...state, complaints: updatedComplaints };
    }

    case 'SET_ACTIVE_BOOKING':
      return { ...state, activeBooking: action.payload };

    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };

    case 'UPDATE_WORKER_AVAILABILITY': {
      const updatedWorkers = state.workers.map(w =>
        w.id === action.payload.workerId ? { ...w, availability: action.payload.availability } : w
      );
      const updatedCurrentWorker = state.currentWorker?.id === action.payload.workerId
        ? { ...state.currentWorker, availability: action.payload.availability }
        : state.currentWorker;
      return { ...state, workers: updatedWorkers, currentWorker: updatedCurrentWorker };
    }

    case 'ADD_NOTIFICATION': {
      return { ...state, notifications: [action.payload, ...state.notifications] };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const createBooking = useCallback((bookingData) => {
    const bookingId = bookingData.id || generateBookingId();
    dispatch({ type: 'CREATE_BOOKING', payload: { ...bookingData, id: bookingId } });
    return bookingId;
  }, []);

  const registerWorker = useCallback((workerData) => {
    const workerId = workerData.id || generateWorkerId(state.workers);
    dispatch({ type: 'REGISTER_WORKER', payload: { ...workerData, id: workerId } });
    return workerId;
  }, [state.workers]);

  const verifyWorker = useCallback((workerId) => {
    dispatch({ type: 'VERIFY_WORKER', payload: { workerId } });
  }, []);

  const setCurrentWorker = useCallback((workerOrId) => {
    dispatch({ type: 'SET_CURRENT_WORKER', payload: workerOrId });
  }, []);

  const updateBookingStatus = useCallback((bookingId, status) => {
    dispatch({ type: 'UPDATE_BOOKING_STATUS', payload: { bookingId, status } });
  }, []);

  const completeBooking = useCallback((bookingId, labourCharge = 400, materialCharge = 80) => {
    dispatch({ type: 'COMPLETE_BOOKING', payload: { bookingId, labourCharge, materialCharge } });
  }, []);

  const makePayment = useCallback((bookingId, method = 'UPI') => {
    dispatch({ type: 'MAKE_PAYMENT', payload: { bookingId, method } });
  }, []);

  const rateBooking = useCallback((bookingId, rating, review) => {
    dispatch({ type: 'RATE_BOOKING', payload: { bookingId, rating, review } });
  }, []);

  const acceptJob = useCallback((bookingId) => {
    dispatch({ type: 'ACCEPT_JOB', payload: { bookingId } });
  }, []);

  const rejectJob = useCallback((bookingId) => {
    dispatch({ type: 'REJECT_JOB', payload: { bookingId } });
  }, []);

  const raiseComplaint = useCallback((complaintData) => {
    dispatch({ type: 'RAISE_COMPLAINT', payload: complaintData });
  }, []);

  const updateComplaintStatus = useCallback((complaintId, status) => {
    dispatch({ type: 'UPDATE_COMPLAINT_STATUS', payload: { complaintId, status } });
  }, []);

  const setActiveBooking = useCallback((booking) => {
    dispatch({ type: 'SET_ACTIVE_BOOKING', payload: booking });
  }, []);

  const setLanguage = useCallback((lang) => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
  }, []);

  const updateWorkerAvailability = useCallback((workerId, availability) => {
    dispatch({ type: 'UPDATE_WORKER_AVAILABILITY', payload: { workerId, availability } });
  }, []);

  const addNotification = useCallback((notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  }, []);

  const action = {
    createBooking,
    registerWorker,
    verifyWorker,
    setCurrentWorker,
    updateBookingStatus,
    completeBooking,
    makePayment,
    rateBooking,
    acceptJob,
    rejectJob,
    raiseComplaint,
    updateComplaintStatus,
    setActiveBooking,
    setLanguage,
    updateWorkerAvailability,
    addNotification,
  };

  const value = {
    ...state,
    state,
    action,
    actions: action,
    dispatch,
    createBooking,
    registerWorker,
    verifyWorker,
    setCurrentWorker,
    updateBookingStatus,
    completeBooking,
    makePayment,
    rateBooking,
    acceptJob,
    rejectJob,
    raiseComplaint,
    updateComplaintStatus,
    setActiveBooking,
    setLanguage,
    updateWorkerAvailability,
    addNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export default AppContext;
