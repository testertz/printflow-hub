import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Printer, ArrowLeft, Mail, KeyRound, CheckCircle2, RefreshCw, Eye, EyeOff } from 'lucide-react';
import OtpInput from '@/components/OtpInput';

type Step = 'email' | 'otp' | 'newPassword' | 'success';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState<Step>('email');
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setResendCooldown(60);
      toast.success('Verification code sent to ' + email);
    }, 1500);
  };

  const handleOtpComplete = (_otp: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep('newPassword');
      toast.success('Code verified! Set your new password.');
    }, 1500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
      toast.success('Password updated successfully!');
      setTimeout(() => navigate('/login'), 2500);
    }, 1500);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(60);
    toast.success('New verification code sent to ' + email);
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const stepIcons: Record<Step, React.ReactNode> = {
    email: <Printer className="h-8 w-8 text-primary-foreground" />,
    otp: <Mail className="h-8 w-8 text-primary-foreground" />,
    newPassword: <KeyRound className="h-8 w-8 text-primary-foreground" />,
    success: <CheckCircle2 className="h-8 w-8 text-primary-foreground" />,
  };

  const stepTitles: Record<Step, string> = {
    email: 'Reset Password',
    otp: 'Verify Your Email',
    newPassword: 'Set New Password',
    success: 'Password Updated!',
  };

  const stepDescriptions: Record<Step, React.ReactNode> = {
    email: 'Enter your email to receive a verification code',
    otp: <>We sent a 6-digit code to <strong className="text-foreground">{email}</strong></>,
    newPassword: 'Choose a strong new password for your account',
    success: 'Your password has been changed successfully',
  };

  const steps: Step[] = ['email', 'otp', 'newPassword', 'success'];
  const currentIndex = steps.indexOf(step);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <motion.div
              key={step}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center"
            >
              {stepIcons[step]}
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold">{stepTitles[step]}</CardTitle>
              <CardDescription className="mt-2">{stepDescriptions[step]}</CardDescription>
            </div>
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {steps.map((s, i) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step ? 'w-8 bg-primary' :
                    currentIndex > i ? 'w-4 bg-primary/50' :
                    'w-4 bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {step === 'email' && (
                <motion.form
                  key="email"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onSubmit={handleEmailSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@college.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Sending code...' : 'Send Verification Code'}
                  </Button>
                </motion.form>
              )}

              {step === 'otp' && (
                <motion.div
                  key="otp"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <OtpInput onComplete={handleOtpComplete} disabled={isVerifying} />

                  {isVerifying && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Verifying...
                    </div>
                  )}

                  <div className="text-center space-y-3">
                    <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResend}
                      disabled={resendCooldown > 0 || isVerifying}
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setStep('email')}
                    disabled={isVerifying}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Change email
                  </Button>
                </motion.div>
              )}

              {step === 'newPassword' && (
                <motion.form
                  key="newPassword"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onSubmit={handlePasswordSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                </motion.form>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-center space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
                  </motion.div>
                  <p className="text-sm text-muted-foreground">
                    Redirecting you to login...
                  </p>
                  <Button onClick={() => navigate('/login')} className="w-full">
                    Go to Login
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 text-center">
              <a href="/login" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
