import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Printer, ArrowLeft, Mail, CheckCircle2, RefreshCw } from 'lucide-react';
import OtpInput from '@/components/OtpInput';

type Step = 'form' | 'otp' | 'success';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<Step>('form');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setResendCooldown(60);
      toast.success('Verification code sent to ' + email);
    }, 1500);
  };

  const handleOtpComplete = async (_otp: string) => {
    setIsVerifying(true);
    // Simulate OTP verification
    setTimeout(async () => {
      // Accept any 6-digit code for mock
      try {
        await register(email, password, name);
        setIsVerifying(false);
        setStep('success');
        toast.success('Email verified successfully!');
        // Auto redirect to login after 2s
        setTimeout(() => navigate('/login'), 2500);
      } catch {
        setIsVerifying(false);
        toast.error('Verification failed. Please try again.');
      }
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
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center"
            >
              {step === 'success' ? (
                <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
              ) : step === 'otp' ? (
                <Mail className="h-8 w-8 text-primary-foreground" />
              ) : (
                <Printer className="h-8 w-8 text-primary-foreground" />
              )}
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold">
                {step === 'form' && 'Create Account'}
                {step === 'otp' && 'Verify Your Email'}
                {step === 'success' && 'Email Verified!'}
              </CardTitle>
              <CardDescription className="mt-2">
                {step === 'form' && 'Register as a student to start printing'}
                {step === 'otp' && (
                  <>We sent a 6-digit code to <strong className="text-foreground">{email}</strong></>
                )}
                {step === 'success' && 'Your account has been created successfully'}
              </CardDescription>
            </div>
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {['form', 'otp', 'success'].map((s, i) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step ? 'w-8 bg-primary' :
                    ['form', 'otp', 'success'].indexOf(step) > i ? 'w-4 bg-primary/50' :
                    'w-4 bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {step === 'form' && (
                <motion.form
                  key="form"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">College Email</Label>
                    <Input id="email" type="email" placeholder="your.email@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Sending code...' : 'Create Account'}
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
                    <p className="text-sm text-muted-foreground">
                      Didn't receive the code?
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResend}
                      disabled={resendCooldown > 0 || isVerifying}
                    >
                      {resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : 'Resend Code'}
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setStep('form')}
                    disabled={isVerifying}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to registration
                  </Button>
                </motion.div>
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

            {step === 'form' && (
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <a href="/login" className="text-primary hover:underline font-medium">Sign in</a>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
