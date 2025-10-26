import { useEffect, useState } from 'react';
import { DatabaseService } from '@/lib/database';
import { EmergencyRequest, Resource } from '@/types';
import toast from 'react-hot-toast';

export default function ResourceMatcher() {
    const [requests, setRequests] = useState<EmergencyRequest[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [requestsData, resourcesData] = await Promise.all([
                DatabaseService.listRequests(),
                DatabaseService.listResources()
            ]);
            setRequests(requestsData);
            setResources(resourcesData);
        } catch (error) {
            toast.error('Failed to load data');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMatch = async (request: EmergencyRequest, resource: Resource) => {
        try {
            await DatabaseService.createMatch(request.id, resource.id);
            toast.success('Successfully matched request with resource!');
            loadData(); // Reload the data
        } catch (error) {
            toast.error('Failed to create match');
            console.error(error);
        }
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        // Simple distance calculation (you might want to use a more sophisticated formula)
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    const findMatchingResources = (request: EmergencyRequest) => {
        return resources.filter(resource => 
            resource.type === request.type &&
            resource.availability &&
            calculateDistance(
                request.location.lat,
                request.location.lng,
                resource.location.lat,
                resource.location.lng
            ) <= 10 // Within 10km radius
        );
    };

    if (isLoading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Emergency Requests</h2>
            {requests.map(request => (
                <div key={request.id} className="p-4 border rounded-lg shadow">
                    <h3 className="font-bold">{request.type} - {request.priority} Priority</h3>
                    <p>{request.description}</p>
                    <p className="text-sm text-gray-500">{request.location.address}</p>
                    
                    <div className="mt-4">
                        <h4 className="font-semibold">Matching Resources:</h4>
                        <div className="space-y-2">
                            {findMatchingResources(request).map(resource => (
                                <div key={resource.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <div>
                                        <p>{resource.description}</p>
                                        <p className="text-sm text-gray-500">{resource.location.address}</p>
                                    </div>
                                    <button
                                        onClick={() => handleMatch(request, resource)}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Match
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}