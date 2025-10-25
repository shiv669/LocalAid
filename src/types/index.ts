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
    createdAt: string;  // Appwrite's $createdAt
    updatedAt: string;  // Appwrite's $updatedAt
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
    createdAt: string;  // Appwrite's $createdAt
    updatedAt: string;  // Appwrite's $updatedAt
};

export type UserProfile = {
    id: string;
    phone: string;  // Can store phone or a placeholder like "N/A" for email users
    name: string;
    isVerified: boolean;
    role: 'HELPER' | 'SEEKER' | 'ADMIN';
    createdAt: string;  // Appwrite's $createdAt
    updatedAt: string;  // Appwrite's $updatedAt
};