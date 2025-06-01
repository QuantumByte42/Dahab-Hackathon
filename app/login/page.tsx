'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { login } from "../(auth)/admin/action/auth"
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LoginPage: React.FC = () => {
    const [state, action, pending] = useActionState(login, undefined)
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.push('/admin');
        }
    }, [state, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to your Gold Store POS account</p>
                    </div>
                    
                    <form action={action} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                disabled={pending}
                                required
                            />
                            {state?.errors?.email && (
                                <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                disabled={pending}
                                required
                            />
                        </div>
                        
                        <Button 
                            type="submit" 
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={pending}
                        >
                            {pending ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Gold Store Point of Sale System
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
