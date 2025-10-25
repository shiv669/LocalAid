'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { account } from '@/lib/appwrite';
import toast from 'react-hot-toast';

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

    useEffect(() => {
        verifyEmail();
    }, []);

    const verifyEmail = async () => {
        const userId = searchParams.get('userId');
        const secret = searchParams.get('secret');

        if (!userId || !secret) {
            setStatus('error');
            toast.error('Invalid verification link');
            return;
        }

        try {
            await account.updateVerification(userId, secret);
            setStatus('success');
            toast.success('Email verified successfully!');

            // Redirect to home after 3 seconds
            setTimeout(() => {
                router.push('/');
            }, 3000);
        } catch (error: any) {
            setStatus('error');
            toast.error(error.message || 'Verification failed');
            console.error('Verification error:', error);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
            <div className='bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center'>
                {status === 'verifying' && (
                    <>
                        <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4'></div>   
                        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Verifying Email...</h1>
                        <p className='text-gray-600'>Please wait while we verify your email address.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className='text-green-500 text-6xl mb-4'></div>
                        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Email Verified!</h1>
                        <p className='text-gray-600 mb-4'>Your email has been successfully verified.</p>
                        <p className='text-sm text-gray-500'>Redirecting to home page...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className='text-red-500 text-6xl mb-4'></div>
                        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Verification Failed</h1>
                        <p className='text-gray-600 mb-4'>Unable to verify your email. The link may be invalid or expired.</p>
                        <button
                            onClick={() => router.push('/')}
                            className='px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
                        >
                            Go to Home
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
                <div className='bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center'>
                    <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4'></div>
                    <h1 className='text-2xl font-bold text-gray-800 mb-2'>Loading...</h1>
                </div>
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
