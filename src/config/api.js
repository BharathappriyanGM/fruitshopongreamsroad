const API_BASE = import.meta.env.VITE_API_URL || '';

export const API_ENDPOINTS = {
  outlets: `${API_BASE}/api/outlets`,
  menu: (outletId) => `${API_BASE}/api/menu${outletId ? `?outlet_id=${outletId}` : ''}`,
  pickupSlots: (outletId) => `${API_BASE}/api/pickup-slots?outlet_id=${outletId}`,
  orders: `${API_BASE}/api/orders`,
  orderStatus: `${API_BASE}/api/order-status`,
  franchiseEnquiry: `${API_BASE}/api/franchise/enquiry`,
  stallEnquiry: `${API_BASE}/api/stall/enquiry`,
};