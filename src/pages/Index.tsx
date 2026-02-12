import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Upload, Truck, Users, Package, FileText, CreditCard, Bell, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect logged-in users to their dashboard
    if (user) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Printer className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                PrintHub
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mx-auto w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mb-8"
          >
            <Printer className="h-10 w-10 text-primary-foreground" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            College Printing
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A complete printing management system for colleges. Upload, pay, and track your documents seamlessly.
          </p>

          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/register')}>
              Start Printing
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
        >
          {[
            {
              icon: Upload,
              title: 'Easy Upload',
              description: 'Upload your documents and get instant cost calculation',
              color: 'text-primary',
            },
            {
              icon: Users,
              title: 'Multi-Role System',
              description: 'Students, admins, leaders, and runners all connected',
              color: 'text-success',
            },
            {
              icon: Truck,
              title: 'Real-time Tracking',
              description: 'Track your documents from upload to delivery',
              color: 'text-warning',
            },
            {
              icon: Package,
              title: 'Inventory Management',
              description: 'Complete inventory tracking for print materials',
              color: 'text-info',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="p-6 rounded-lg border border-border/50 bg-card hover:shadow-lg transition-shadow"
            >
              <div className={`h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From upload to delivery — your documents are handled with care in just a few simple steps.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden lg:block absolute top-7 left-[15%] right-[15%] h-0.5 bg-border" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {[
                {
                  step: 1,
                  icon: FileText,
                  title: 'Upload Document',
                  description: 'Drag & drop or browse to upload your PDF, DOCX, PPTX, or other documents. Pages are counted automatically.',
                },
                {
                  step: 2,
                  icon: CreditCard,
                  title: 'Pay & Confirm',
                  description: 'See the exact cost based on page count and print options. Pay securely through the integrated payment gateway.',
                },
                {
                  step: 3,
                  icon: Printer,
                  title: 'Printing Begins',
                  description: 'Your document is sent to the stationary shop queue. The shop prints it and marks it ready for pickup.',
                },
                {
                  step: 4,
                  icon: Truck,
                  title: 'Delivery to You',
                  description: 'A runner picks up your printed document and delivers it to your class or chosen location. Track it in real time.',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.15 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-5 shadow-lg">
                    <item.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-1 left-[calc(50%+14px)] w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center border-2 border-background z-20">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px]">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Role explanation */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                role: 'Students',
                description: 'Upload documents, choose print settings, pay online, and track delivery — all from your dashboard.',
              },
              {
                icon: Package,
                role: 'Stationary Shops',
                description: 'Receive print jobs, manage inventory, mark prints as ready, and keep your stock updated in real time.',
              },
              {
                icon: Truck,
                role: 'Runners',
                description: 'Get notified of ready pickups, collect printed documents, and deliver them to the right location on campus.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
                className="p-6 rounded-xl border border-border/50 bg-card"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{item.role}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-20 p-8 rounded-2xl bg-gradient-primary text-primary-foreground text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6 opacity-90">
            Join hundreds of students already using PrintHub for their printing needs
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/register')}>
            Create Free Account
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 PrintHub. All rights reserved.</p>
            <p className="mt-2">College Printing Management System</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
