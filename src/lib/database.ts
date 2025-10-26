import { databases, ID } from '@/lib/appwrite';
import { EmergencyRequest, Resource, UserProfile } from '@/types';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

export const Collections = {
    Requests: 'requests',
    Resources: 'resources',
    Users: 'users',
    Matches: 'matches'
};

export const DatabaseService = {
    // Emergency Requests
    async createRequest(request: Omit<EmergencyRequest, 'id' | 'createdAt' | 'updatedAt'>) {
        return await databases.createDocument(
            DATABASE_ID,
            Collections.Requests,
            ID.unique(),
            {
                ...request,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        );
    },

    async listRequests() {
        const response = await databases.listDocuments(
            DATABASE_ID,
            Collections.Requests
        );
        return response.documents.map(doc => ({
            ...doc,
            id: doc.$id,
        })) as unknown as EmergencyRequest[];
    },

    // Resources
    async createResource(resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) {
        return await databases.createDocument(
            DATABASE_ID,
            Collections.Resources,
            ID.unique(),
            {
                ...resource,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        );
    },

    async listResources() {
        const response = await databases.listDocuments(
            DATABASE_ID,
            Collections.Resources
        );
        return response.documents.map(doc => ({
            ...doc,
            id: doc.$id,
        })) as unknown as Resource[];
    },

    // User Profiles
    async createUserProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) {
        return await databases.createDocument(
            DATABASE_ID,
            Collections.Users,
            ID.unique(),
            {
                ...profile,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        );
    },

    async getUserProfile(userId: string) {
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                Collections.Users,
                userId
            );
            return {
                ...response,
                id: response.$id,
            } as unknown as UserProfile;
        } catch {
            return null;
        }
    },

    // Matching System
    async createMatch(requestId: string, resourceId: string) {
        return await databases.createDocument(
            DATABASE_ID,
            Collections.Matches,
            ID.unique(),
            {
                requestId,
                resourceId,
                status: 'PENDING',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        );
    }
};