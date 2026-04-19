import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { authApi } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface RegisterForm {
  fullName: string;
  email: string;
  password: string;
}

export const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterForm>({
    mode: 'onBlur',        // Validate when field loses focus (more user‑friendly)
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await authApi.register(data);
      login(res.data.token, { email: res.data.email, fullName: res.data.fullName });
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      reset(undefined, { keepValues: true }); // Keep form values on error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Full Name"
            type="text"
            icon={<User size={18} />}
            error={errors.fullName?.message}
            {...register('fullName', {
              required: 'Full name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
          />

          <Input
            label="Email address"
            type="email"
            icon={<Mail size={18} />}
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />

          <Input
            label="Password"
            type="password"
            icon={<Lock size={18} />}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};