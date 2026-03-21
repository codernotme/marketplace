import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center py-12 px-4 bg-[--c-bg]">
      <LoginForm />
    </div>
  );
}
