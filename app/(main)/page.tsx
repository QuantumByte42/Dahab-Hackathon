'use client';

import React, { useActionState, useEffect } from 'react';
import { login } from "../(auth)/admin/action/auth"
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Gem, Shield, TrendingUp } from 'lucide-react';

export default function HomePage() {
    const [state, action, pending] = useActionState(login, undefined)
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.push('/admin');
        }
    }, [state, router])

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Left side - Branding and features */}
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="max-w-md mx-auto lg:mx-0">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl shadow-lg">
                                <ShoppingCart className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Gold Store POS</h1>
                                <p className="text-amber-600 font-medium">Premium Point of Sale</p>
                            </div>
                        </div>
                        
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Manage Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">Gold Business</span> with Precision
                        </h2>
                        
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Complete solution for jewelry stores with inventory management, sales tracking, and customer management.
                        </p>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Gem className="h-5 w-5 text-amber-600" />
                                </div>
                                <span className="text-gray-700">Inventory & Stock Management</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-amber-600" />
                                </div>
                                <span className="text-gray-700">Sales Analytics & Reports</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Shield className="h-5 w-5 text-amber-600" />
                                </div>
                                <span className="text-gray-700">Secure Transaction Processing</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Login form */}
                <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100/50 backdrop-blur-lg">
                            <div className="text-center mb-8">
                                <div className="inline-flex p-3 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl mb-4 shadow-lg">
                                    <ShoppingCart className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h3>
                                <p className="text-gray-600">Sign in to your account to continue</p>
                            </div>
                            
                            <form action={action} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 bg-gray-50/50"
                                        disabled={pending}
                                        required
                                    />
                                    {state?.errors?.email && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                            <span className="w-4 h-4 text-red-500">⚠</span>
                                            {state.errors.email}
                                        </p>
                                    )}
                                </div>
                                
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 bg-gray-50/50"
                                        disabled={pending}
                                        required
                                    />
                                    {state?.errors?.password && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                            <span className="w-4 h-4 text-red-500">⚠</span>
                                            {state.errors.password}
                                        </p>
                                    )}
                                </div>
                                
                                <Button 
                                    type="submit" 
                                    className="w-full h-12 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    disabled={pending}
                                >
                                    {pending ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Signing in...
                                        </div>
                                    ) : (
                                        "Sign In to Dashboard"
                                    )}
                                </Button>
                            </form>
                            
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-500">
                                    Secure access to your gold store management system
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
