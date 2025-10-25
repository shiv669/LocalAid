export type EmergencyRequest = {
    id: string;
    userId: string;
    type: 'MEDICAL' | 'SHELTER' | 'FOOD' | 'TRANSPORT';
    description: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    status: 'PENDING' | 'MATCHED' | 'COMPLETED';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    createdAt: string;
    updatedAt: string;
};

export type Resource = {
    id: string;
    userId: string;
    type: 'MEDICAL' | 'SHELTER' | 'FOOD' | 'TRANSPORT';
    description: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    availability: boolean;
    createdAt: string;
    updatedAt: string;
};

export type UserProfile = {
    id: string;
    phone: string;
    name: string;
    isVerified: boolean;
    role: 'HELPER' | 'SEEKER' | 'ADMIN';
    createdAt: string;
    updatedAt: string;
};