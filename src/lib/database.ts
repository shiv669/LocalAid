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
                location: typeof request.location === 'string' 
                    ? request.location 
                    : JSON.stringify(request.location), // Convert object to string
                // Don't set createdAt/updatedAt - Appwrite handles this automatically
            }
        );
    },

    async listRequests() {
        const response = await databases.listDocuments(
            DATABASE_ID,
            Collections.Requests
        );
        // Parse location strings back to objects and map $id to id
        return response.documents.map(doc => ({
            ...doc,
            id: doc.$id,
            location: typeof doc.location === 'string' ? JSON.parse(doc.location) : doc.location,
            createdAt: doc.$createdAt,
            updatedAt: doc.$updatedAt
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
                location: typeof resource.location === 'string'
                    ? resource.location
                    : JSON.stringify(resource.location), // Convert object to string
                // Appwrite auto-generates timestamps
            }
        );
    },

    async listResources() {
        const response = await databases.listDocuments(
            DATABASE_ID,
            Collections.Resources
        );
        // Parse location strings back to objects and map $id to id
        return response.documents.map(doc => ({
            ...doc,
            id: doc.$id,
            location: typeof doc.location === 'string' ? JSON.parse(doc.location) : doc.location,
            createdAt: doc.$createdAt,
            updatedAt: doc.$updatedAt
        })) as unknown as Resource[];
    },

    // User Profiles
    async createUserProfile(userId: string, profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) {
        return await databases.createDocument(
            DATABASE_ID,
            Collections.Users,
            userId, // Use the auth user's ID as the document ID
            {
                ...profile,
                // Appwrite auto-generates timestamps
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
            // Map Appwrite fields to our type
            return {
                ...response,
                id: response.$id,
                createdAt: response.$createdAt,
                updatedAt: response.$updatedAt
            } as unknown as UserProfile;
        } catch {
            return null;
        }
    },

    // Matching System
    async createMatch(requestId: string, resourceId: string) {
        // Create the match document
        const match = await databases.createDocument(
            DATABASE_ID,
            Collections.Matches,
            ID.unique(),
            {
                requestId,
                resourceId,
                status: 'PENDING',
                // Appwrite auto-generates timestamps
            }
        );

        // Update the request status to MATCHED
        await databases.updateDocument(
            DATABASE_ID,
            Collections.Requests,
            requestId,
            {
                status: 'MATCHED'
            }
        );

        return match;
    },

    async updateRequestStatus(requestId: string, status: 'PENDING' | 'MATCHED' | 'COMPLETED') {
        return await databases.updateDocument(
            DATABASE_ID,
            Collections.Requests,
            requestId,
            {
                status
            }
        );
    }
};