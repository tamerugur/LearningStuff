import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterData } from '@shared/schemas/user';
import { useEffect, useMemo, useState } from 'react';
import './UserRegister.css';

export function UserRegister() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    criteriaMode: 'all',
  });

  const rawPassword = watch('password') || '';
  const [password, setPassword] = useState('');
  const [showChecklist, setShowChecklist] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPassword(rawPassword);
      setShowChecklist(!!rawPassword);
    }, 500);

    return () => clearTimeout(timeout);
  }, [rawPassword]);

  const passwordChecklist = useMemo(() => [
    {
      label: 'At least 6 characters',
      passed: password.length >= 6,
    },
    {
      label: 'Contains an uppercase letter',
      passed: /[A-Z]/.test(password),
    },
    {
      label: 'Contains a special character',
      passed: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
    {
      label: 'Contains a digit',
      passed: /\d/.test(password),
    },
  ], [password]);

  const allPassed = passwordChecklist.every(item => item.passed);
  const shouldShow = showChecklist && !allPassed;

  const onSubmit = (data: RegisterData) => {
    console.log('✅ Registered:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 400 }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>Email:</label>
        <input {...register('email')} type="text" />
        {errors.email && (
          <p style={{ color: 'red' }}>{errors.email.message}</p>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Password:</label>
        <input {...register('password')} type="password" />
        <ul className={`checklist ${shouldShow ? 'visible' : 'hidden'}`}>
          {passwordChecklist.map((item, i) => (
            <li key={i} className={`check-item ${item.passed ? 'passed' : ''}`}>
              <span className="icon">{item.passed ? '✅' : '❌'}</span>
              {item.label}
            </li>
          ))}
        </ul>
        {errors.password && (
          <p style={{ color: 'red', marginTop: '0.5rem' }}>
            {errors.password.message}
          </p>
        )}
      </div>

      <button type="submit">Register</button>
    </form>
  );
}
