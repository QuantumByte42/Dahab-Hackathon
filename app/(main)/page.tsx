'use client';

import React, { useActionState, useEffect } from 'react';
import { login } from "../(auth)/admin/action/auth";
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Gem, Shield, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const [state, action, pending] = useActionState(login, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push('/admin');
    }
  }, [state, router]);

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* الجانب الأيسر - العلامة التجارية والمميزات */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto lg:mx-0">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl shadow-lg">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">نظام نقاط البيع لمتجر الذهب</h1>
                <p className="text-amber-600 font-medium">نظام احترافي لإدارة المبيعات</p>
              </div>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              إدارة <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">عملك الذهبي</span> بدقة عالية
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Gem className="h-5 w-5 text-amber-600" />
                </div>
                <span className="text-gray-700">إدارة المخزون والمنتجات</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <span className="text-gray-700">تحليلات وتقارير المبيعات</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Shield className="h-5 w-5 text-amber-600" />
                </div>
                <span className="text-gray-700">معالجة معاملات آمنة</span>
              </div>
            </div>
          </div>
        </div>

        {/* الجانب الأيمن - نموذج تسجيل الدخول */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100/50 backdrop-blur-lg">
              <div className="text-center mb-8">
                <div className="inline-flex p-3 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl mb-4 shadow-lg">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">مرحباً بعودتك</h3>
                <p className="text-gray-600">سجل الدخول إلى حسابك للمتابعة</p>
              </div>

              <form action={action} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
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
                    كلمة المرور
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="أدخل كلمة المرور"
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
                      جاري تسجيل الدخول...
                    </div>
                  ) : (
                    "تسجيل الدخول إلى لوحة التحكم"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  دخول آمن لإدارة نظام متجرك الذهبي
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
