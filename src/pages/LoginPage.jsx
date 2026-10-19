import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  User,
  Mail,
  Lock,
  RotateCcw,
  Eye,
  EyeOff,
  ArrowRight,
  LayoutDashboard,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../components/Toast';
import ThemeToggle from '../components/ThemeToggle';
import Button from '../components/Button';
import Input from '../components/Input';

// Esquema de validación Zod para Registro
const registerSchema = z
  .object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Ingresa una dirección de correo válida'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(8, 'Confirma tu contraseña'),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'Debes aceptar los términos y condiciones' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

// Esquema de validación Zod para Login
const loginSchema = z.object({
  email: z.string().email('Ingresa una dirección de correo válida'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const navigate = useNavigate();
  const { success, info } = useToast();

  const currentSchema = isRegister ? registerSchema : loginSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(currentSchema),
  });

  // Cálculo visual de fortaleza de contraseña
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(passwordValue);

  const onSubmit = async (data) => {
    // Simular latencia de autenticación
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Guardar sesión en localStorage
    localStorage.setItem('kanban_token', 'demo_jwt_token_' + Date.now());
    localStorage.setItem(
      'kanban_user',
      JSON.stringify({
        name: data.name || data.email.split('@')[0],
        email: data.email,
      })
    );

    success(
      isRegister
        ? '¡Cuenta creada con éxito! Bienvenido a KanbanFlow.'
        : '¡Bienvenido de nuevo!'
    );

    // Navegación programática estricta según AGENTS.md
    navigate('/boards');
  };

  const handleSSOLogin = (provider) => {
    localStorage.setItem('kanban_token', `sso_${provider}_token_${Date.now()}`);
    localStorage.setItem(
      'kanban_user',
      JSON.stringify({
        name: `Usuario ${provider}`,
        email: `usuario@${provider.toLowerCase()}.com`,
      })
    );
    success(`Autenticado con ${provider}`);
    navigate('/boards');
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setPasswordValue('');
    reset();
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-main flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative overflow-hidden select-none">
      {/* Resplandores decorativos ambientales (según code.html y screen.png) */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-br from-accent-cyan/20 to-accent-purple/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-tl from-accent-purple/20 via-accent-cyan/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Tarjeta Principal */}
      <div className="w-full max-w-[500px] bg-bg-card rounded-2xl shadow-card border border-border-subtle p-6 sm:p-8 flex flex-col relative transition-all duration-300">
        {/* Top Bar: Logo Branding + Theme Mode Toggle */}
        <div className="flex items-center justify-between w-full mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center text-white shadow-sm shadow-accent-cyan/20">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-headline font-bold text-lg text-text-main tracking-tight">
                KanbanFlow
              </span>
              <span className="bg-bg-surface text-accent-cyan font-bold text-[10px] px-2 py-0.5 rounded-full uppercase border border-border-subtle tracking-wider">
                SaaS
              </span>
            </div>
          </div>

          <ThemeToggle />
        </div>

        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="font-headline font-bold text-2xl text-text-main tracking-tight">
            {isRegister ? 'Crear una cuenta' : 'Iniciar sesión'}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {isRegister
              ? 'Comienza a gestionar tus tableros y proyectos ágiles en segundos.'
              : 'Accede a tus proyectos y espacios de trabajo colaborativos.'}
          </p>
        </div>

        {/* Botones SSO */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Google */}
          <button
            type="button"
            onClick={() => handleSSOLogin('Google')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-bg-surface hover:bg-surface-hover text-text-main font-semibold text-xs border border-border-subtle transition-all active:scale-[0.98]"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Google</span>
          </button>

          {/* GitHub */}
          <button
            type="button"
            onClick={() => handleSSOLogin('GitHub')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-bg-surface hover:bg-surface-hover text-text-main font-semibold text-xs border border-border-subtle transition-all active:scale-[0.98]"
          >
            <svg
              className="w-4 h-4 flex-shrink-0 fill-current text-text-main"
              viewBox="0 0 24 24"
            >
              <path
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                fillRule="evenodd"
              />
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        {/* Separador */}
        <div className="relative flex items-center justify-center my-3">
          <div className="w-full h-px bg-border-subtle" />
          <span className="absolute bg-bg-card px-3 text-[10px] font-bold text-text-muted tracking-widest uppercase">
            O con tu correo corporativo
          </span>
        </div>

        {/* Formulario React Hook Form + Zod */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          {/* Nombre completo (solo en registro) */}
          {isRegister && (
            <Input
              label="Nombre completo"
              placeholder="ej. Alex García"
              icon={User}
              error={errors.name?.message}
              {...register('name')}
            />
          )}

          {/* Correo Corporativo */}
          <Input
            label="Correo corporativo"
            badge="Requerido"
            type="email"
            placeholder="alex.garcia@empresa.com"
            icon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />

          {/* Contraseña */}
          <div>
            <Input
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              icon={Lock}
              error={errors.password?.message}
              {...register('password', {
                onChange: (e) => setPasswordValue(e.target.value),
              })}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-muted hover:text-text-main p-1 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* Barra indicadora de fortaleza (solo en registro) */}
            {isRegister && passwordValue && (
              <div className="mt-2 flex flex-col gap-1">
                <div className="flex gap-1.5 w-full h-1.5 rounded-full overflow-hidden bg-bg-surface">
                  <div
                    className={`h-full w-1/4 rounded-full transition-colors duration-300 ${
                      strengthScore >= 1
                        ? strengthScore === 1
                          ? 'bg-status-danger'
                          : strengthScore === 2
                          ? 'bg-status-warning'
                          : 'bg-status-success'
                        : 'bg-border-subtle'
                    }`}
                  />
                  <div
                    className={`h-full w-1/4 rounded-full transition-colors duration-300 ${
                      strengthScore >= 2
                        ? strengthScore === 2
                          ? 'bg-status-warning'
                          : 'bg-status-success'
                        : 'bg-border-subtle'
                    }`}
                  />
                  <div
                    className={`h-full w-1/4 rounded-full transition-colors duration-300 ${
                      strengthScore >= 3 ? 'bg-status-success' : 'bg-border-subtle'
                    }`}
                  />
                  <div
                    className={`h-full w-1/4 rounded-full transition-colors duration-300 ${
                      strengthScore >= 4 ? 'bg-status-success' : 'bg-border-subtle'
                    }`}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-text-muted">
                  <span>Mínimo 8 caracteres, números y símbolos</span>
                  <span
                    className={`font-semibold ${
                      strengthScore <= 1
                        ? 'text-status-danger'
                        : strengthScore <= 2
                        ? 'text-status-warning'
                        : 'text-status-success'
                    }`}
                  >
                    {strengthScore === 1
                      ? 'Débil'
                      : strengthScore === 2
                      ? 'Media'
                      : strengthScore >= 3
                      ? 'Fuerte'
                      : ''}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirmar Contraseña (solo en registro) */}
          {isRegister && (
            <Input
              label="Confirmar contraseña"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repite la contraseña"
              icon={RotateCcw}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-text-muted hover:text-text-main p-1 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          )}

          {/* Términos y condiciones (solo en registro) */}
          {isRegister && (
            <div className="flex flex-col gap-1 pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded accent-accent-cyan cursor-pointer"
                  {...register('terms')}
                />
                <span className="text-xs text-text-muted leading-relaxed">
                  Acepto los{' '}
                  <span className="text-accent-cyan font-semibold hover:underline">
                    Términos de Servicio
                  </span>{' '}
                  y la{' '}
                  <span className="text-accent-cyan font-semibold hover:underline">
                    Política de Privacidad
                  </span>{' '}
                  de KanbanFlow.
                </span>
              </label>
              {errors.terms && (
                <span className="text-xs text-status-danger font-medium">
                  {errors.terms.message}
                </span>
              )}
            </div>
          )}

          {/* Botón CTA Submit */}
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            isLoading={isSubmitting}
            className="w-full mt-2"
          >
            <span className="flex items-center gap-2">
              {isRegister ? 'Crear cuenta gratuita' : 'Ingresar al sistema'}
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
        </form>

        {/* Footer: Alternador entre Iniciar Sesión / Registrarse */}
        <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-center gap-1.5 text-xs text-text-muted">
          <span>
            {isRegister ? '¿Ya tienes una cuenta?' : '¿Aún no tienes una cuenta?'}
          </span>
          <button
            type="button"
            onClick={toggleMode}
            className="font-semibold text-accent-purple hover:text-accent-cyan transition-colors"
          >
            {isRegister ? 'Iniciar Sesión' : 'Regístrate aquí'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
