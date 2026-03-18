/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg' {
    import React from 'react';
    const SVGComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    export default SVGComponent;
}

declare module '*.svg?react' {
    import React from 'react';
    const SVGComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    export default SVGComponent;
}

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_LOCAL_AUTH_PORT: string;
    readonly VITE_LOCAL_MEMBER_PORT: string;
    readonly VITE_LOCAL_CORPORATION_PORT: string;
    readonly VITE_LOCAL_ROLE_PORT: string;
    readonly VITE_LOCAL_AFFILIATION_PORT: string;
    readonly VITE_LOCAL_DISCOUNT_PORT: string;
    readonly VITE_LOCAL_USER_PORT: string;
    readonly VITE_LOCAL_MEDALLION_PORT: string;
    readonly VITE_LOCAL_MEDIA_PORT: string;
    readonly VITE_LOCAL_VEHICLE_PORT: string;
    readonly VITE_LOCAL_COLLISION_RATE_PORT: string;
    readonly VITE_LOCAL_PACE_PROGRAM_PORT: string;
    readonly VITE_LOCAL_INSURANCE_PORT: string;
    readonly VITE_LOCAL_INSURANCE_PAYMENT_PORT: string;
    readonly VITE_LOCAL_TRANSPONDER_PORT: string;
    readonly VITE_LOCAL_DASHBOARD_PORT: string;
    readonly VITE_LOCAL_TAX_RATE_PORT: string;
    readonly VITE_LOCAL_TICKET_PORT: string;
    readonly VITE_LOCAL_NOTIFICATION_PORT: string;
    readonly VITE_PDFJS_WORKER_URL: string;
    readonly VITE_PRIMARY_COLOR: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
