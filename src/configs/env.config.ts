/**
 * Environment configuration file
 * All environment-specific values should be accessed through this file
 */

// Check if the environment is localhost
const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.brta360.net';

// Local service ports configuration
const localPorts = {
    auth: import.meta.env.VITE_LOCAL_AUTH_PORT || '3100',
    member: import.meta.env.VITE_LOCAL_MEMBER_PORT || '3002',
    corporation: import.meta.env.VITE_LOCAL_CORPORATION_PORT || '3003',
    transponder: import.meta.env.VITE_LOCAL_TRANSPONDER_PORT || '3004',
    role: import.meta.env.VITE_LOCAL_ROLE_PORT || '3005',
    affiliation: import.meta.env.VITE_LOCAL_AFFILIATION_PORT || '3006',
    discount: import.meta.env.VITE_LOCAL_DISCOUNT_PORT || '3007',
    user: import.meta.env.VITE_LOCAL_USER_PORT || '3008',
    medallion: import.meta.env.VITE_LOCAL_MEDALLION_PORT || '3009',
    media: import.meta.env.VITE_LOCAL_MEDIA_PORT || '3010',
    vehicle: import.meta.env.VITE_LOCAL_VEHICLE_PORT || '3011',
    collisionRate: import.meta.env.VITE_LOCAL_COLLISION_RATE_PORT || '3012',
    paceProgram: import.meta.env.VITE_LOCAL_PACE_PROGRAM_PORT || '3013',
    insurance: import.meta.env.VITE_LOCAL_INSURANCE_PORT || '3014',
    insurancePayment: import.meta.env.VITE_LOCAL_INSURANCE_PAYMENT_PORT || '3015',
    dashboard: import.meta.env.VITE_LOCAL_DASHBOARD_PORT || '3016',
    taxRate: import.meta.env.VITE_LOCAL_TAX_RATE_PORT || '3017',
    ticket: import.meta.env.VITE_LOCAL_TICKET_PORT || '3018',
    notification: import.meta.env.VITE_LOCAL_NOTIFICATION_PORT || '3019',
    vendor: import.meta.env.VITE_LOCAL_VENDOR_PORT || '3021',
};

// Define local mappings with ports from environment
export const localPathMappings: Record<string, string> = {
    login: `http://localhost:${localPorts.auth}`,
    auth: `http://localhost:${localPorts.auth}`,
    members: `http://localhost:${localPorts.member}`,
    member: `http://localhost:${localPorts.member}`,
    roles: `http://localhost:${localPorts.role}`,
    role: `http://localhost:${localPorts.role}`,
    users: `http://localhost:${localPorts.user}`,
    user: `http://localhost:${localPorts.user}`,
    corporations: `http://localhost:${localPorts.corporation}`,
    corporation: `http://localhost:${localPorts.corporation}`,
    'corporation-types': `http://localhost:${localPorts.corporation}`,
    affiliation: `http://localhost:${localPorts.affiliation}`,
    affiliations: `http://localhost:${localPorts.affiliation}`,
    medallions: `http://localhost:${localPorts.medallion}`,
    medallion: `http://localhost:${localPorts.medallion}`,
    vehicles: `http://localhost:${localPorts.vehicle}`,
    vehicle: `http://localhost:${localPorts.vehicle}`,
    'collision-rates': `http://localhost:${localPorts.collisionRate}`,
    'collision-rate': `http://localhost:${localPorts.collisionRate}`,
    discounts: `http://localhost:${localPorts.discount}`,
    discount: `http://localhost:${localPorts.discount}`,
    'pace-program-rates': `http://localhost:${localPorts.paceProgram}`,
    'pace-program-rate': `http://localhost:${localPorts.paceProgram}`,
    insurances: `http://localhost:${localPorts.insurance}`,
    insurance: `http://localhost:${localPorts.insurance}`,
    media: `http://localhost:${localPorts.media}`,
    transponder: `http://localhost:${localPorts.transponder}`,
    transponders: `http://localhost:${localPorts.transponder}`,
    'insurances-payment': `http://localhost:${localPorts.insurancePayment}`,
    dashboard: `http://localhost:${localPorts.dashboard}`,
    'tax-rates': `http://localhost:${localPorts.taxRate}`,
    'tax-rate': `http://localhost:${localPorts.taxRate}`,
    tickets: `http://localhost:${localPorts.ticket}`,
    ticket: `http://localhost:${localPorts.ticket}`,
    'ticket-statuses': `http://localhost:${localPorts.ticket}`,
    vendor: `http://localhost:${localPorts.vendor}`,
};

// Helper to get base URL based on environment
export const getBaseUrl = (serviceKey?: string): string => {
    if (isLocalhost && serviceKey && localPathMappings[serviceKey]) {
        return localPathMappings[serviceKey];
    }
    return API_BASE_URL;
};

// Media service URL
export const getMediaBaseUrl = (): string => {
    return isLocalhost
        ? `http://localhost:${localPorts.media}`
        : API_BASE_URL;
};

// Notification WebSocket URL
export const getNotificationWsUrl = (): string => {
    return isLocalhost
        ? `http://localhost:${localPorts.notification}/notifications`
        : `${API_BASE_URL}/notifications`;
};

// PDF.js Worker URL
export const PDFJS_WORKER_URL = import.meta.env.VITE_PDFJS_WORKER_URL ||
    'https://unpkg.com/pdfjs-dist@5.3.31/build/pdf.worker.min.mjs';

// Application Theme
console.log(import.meta.env);
export const PRIMARY_COLOR = import.meta.env.VITE_PRIMARY_COLOR || '#0434b1';

// Export isLocalhost for use in other modules
export { isLocalhost };

// Legacy export for backward compatibility
export const BASE_URL = isLocalhost ? getBaseUrl('login') : API_BASE_URL;
