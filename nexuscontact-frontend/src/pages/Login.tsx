import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { authApi } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginForm {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data);
      login(res.data.token, { email: res.data.email, fullName: res.data.fullName });
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email address"
            type="email"
            icon={<Mail size={18} />}
            error={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />
          <Input
            label="Password"
            type="password"
            icon={<Lock size={18} />}
            error={errors.password?.message}
            {...register('password', { required: 'Password is required' })}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};