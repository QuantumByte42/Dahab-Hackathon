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
            router.refresh()
        }
    }, [state])

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
            <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
            <form action={action} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        className="w-full"
                        disabled={pending}
                        required
                    />
                    {state?.errors?.email && <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        className="w-full"
                        disabled={pending}
                        required
                    />
                </div>
                <Button 
                    type="submit" 
                    className="w-full py-2"
                    disabled={pending}
                >
                    {pending ? "Logging in..." : "Login"}
                </Button>
            </form>
        </div>
    );
};

export default LoginPage;
