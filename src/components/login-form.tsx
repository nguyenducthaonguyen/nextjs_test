'use client';

import type { LoginFormData } from '@/validations/login-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '@/actions/auth-action';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/helpers';
import { createLoginFormSchema } from '@/validations/login-validation';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [serverMessage, setServerMessage] = useState<{ success: boolean; message: string } | undefined>();

  const LoginFormSchema = createLoginFormSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerMessage(undefined);

    startTransition(async () => {
      const result = await login(data);
      setServerMessage(result);
    });
  };

  const isLoading = isSubmitting || isPending;

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('login.title')}</CardTitle>
          <CardDescription>
            {t('login.sub_title')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  {t('login.login_with_apple')}
                </Button>
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  {t('login.login_with_google')}
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  {t('login.continue_with')}
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">{t('login.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('login.email_placeholder')}
                    className={cn({ 'border-red-500 focus-visible:ring-red-500': errors.email })}
                    disabled={isLoading}
                    {...register('email')}
                  />
                  {errors.email && (
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                      <span>{errors.email.message}</span>
                    </div>
                  )}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">{t('login.password')}</Label>
                    <Link
                      href="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      {t('login.forgot_password')}
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    className={cn({ 'border-red-500 focus-visible:ring-red-500': errors.password })}
                    disabled={isLoading}
                    {...register('password')}
                  />
                  {errors.password && (
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                      <span>{errors.password.message}</span>
                    </div>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      )
                    : (
                        <>{t('login.sign_in')}</>
                      )}
                </Button>
              </div>
              {serverMessage && (
                <div
                  className={`flex items-center gap-2 text-sm p-3 rounded-md ${
                    serverMessage.success
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{serverMessage.message}</span>
                </div>
              )}
              <div className="text-center text-sm">
                {t('login.no_account')}
                {' '}
                <Link href="/sign-up" className="underline underline-offset-4">
                  {t('login.sign_up')}
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
