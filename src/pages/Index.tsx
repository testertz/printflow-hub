import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Printer, Upload, Truck, Users, Package, FileText, CreditCard,
  ArrowRight, HelpCircle, Sparkles, Shield, Clock, Star,
  CheckCircle2, Zap, GraduationCap,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(`/${user.role}/dashboard`);
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Printer className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                PrintHub
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link to="/resources">
                  <FileText className="h-4 w-4" />
                  Cover Pages
                </Link>
              </Button>
              <ThemeToggle />
              <Button variant="ghost" onClick={() => navigate('/login')} className="hidden sm:inline-flex">
                Sign In
              </Button>
              <Button onClick={() => navigate('/register')} className="shadow-md">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-40" />
        <div className="absolute inset-0 -z-10 bg-radial-fade" />
        <div className="absolute top-20 -left-20 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute top-40 -right-20 -z-10 h-72 w-72 rounded-full bg-info/20 blur-3xl animate-blob" style={{ animationDelay: '4s' }} />

        <div className="container mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6 shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Trusted by 500+ students across campus
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
              Print, Pay & Receive
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Without Leaving Class
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              The smartest way for college students to print documents.
              Upload from anywhere, pay in seconds, and get it delivered to your hand.
            </p>

            <div className="flex flex-wrap gap-3 justify-center mb-10">
              <Button size="lg" onClick={() => navigate('/register')} className="shadow-lg shadow-primary/30 group">
                Start Printing Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/resources">
                  <FileText className="h-4 w-4" />
                  Free Cover Pages
                </Link>
              </Button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success" />
                No setup fees
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Pay per page
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Delivered in &lt;1hr
              </div>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { value: 500, suffix: '+', label: 'Active Students' },
              { value: 12000, suffix: '+', label: 'Pages Printed' },
              { value: 98, suffix: '%', label: 'On-Time Delivery' },
              { value: 30, suffix: 'min', label: 'Average Wait' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="text-center p-4 rounded-xl bg-card/60 backdrop-blur border border-border/50"
              >
                <div className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  <AnimatedCounter end={stat.value} />{stat.suffix}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="py-16"
        >
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Zap className="h-4 w-4" />
              Why PrintHub
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Built for busy students</h2>
            <p className="text-muted-foreground text-lg">
              Skip the queues. Skip the cash. Get back to studying.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Upload, title: 'Easy Upload', description: 'Drop any PDF, DOCX, or PPTX — pages counted instantly.', color: 'primary' },
              { icon: Shield, title: 'Secure Payments', description: 'Pay safely via M-Pesa, HaloPesa, or card. Instant receipts.', color: 'success' },
              { icon: Truck, title: 'Live Tracking', description: 'Watch your job move from print queue to your classroom.', color: 'warning' },
              { icon: Clock, title: 'Lightning Fast', description: 'Most prints ready in 15 minutes, delivered within the hour.', color: 'info' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all"
              >
                <div className={`h-12 w-12 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="py-16"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <ArrowRight className="h-4 w-4" />
              How It Works
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">From upload to delivery in 4 steps</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A seamless flow designed for the campus rhythm.
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-7 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {[
                { step: 1, icon: FileText, title: 'Upload Document', description: 'Upload your PDF, DOCX, or PPTX. Pages counted automatically.' },
                { step: 2, icon: CreditCard, title: 'Pay & Confirm', description: 'See exact cost, pay securely with mobile money or card.' },
                { step: 3, icon: Printer, title: 'Printing Begins', description: 'The stationary shop prints your job and marks it ready.' },
                { step: 4, icon: Truck, title: 'Delivered to You', description: 'A runner brings it to your class. Track in real time.' },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center mb-5 shadow-lg shadow-primary/30">
                    <item.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-1 left-[calc(50%+14px)] w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center border-2 border-background z-20">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px]">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="py-16"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Star className="h-4 w-4 fill-current" />
              Loved by Students
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What our users say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { name: 'Amina J.', role: 'Engineering, Year 3', quote: 'I uploaded my 80-page project at midnight and got it on my desk by 9am. Game changer for assignment week!', initials: 'AJ' },
              { name: 'Daniel M.', role: 'Business, Year 2', quote: 'No more queueing at the stationary. I paid via M-Pesa and tracked the runner like a delivery app. Smooth.', initials: 'DM' },
              { name: 'Faith L.', role: 'Education, Year 4', quote: 'The free cover pages saved me hours. Professional look without designing anything myself.', initials: 'FL' },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-border/50 bg-card hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground/90 mb-6 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Roles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="py-16"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <GraduationCap className="h-4 w-4" />
              Built for Everyone
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">One platform, three roles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Users, role: 'Students', description: 'Upload, pay, and track deliveries from your dashboard.' },
              { icon: Package, role: 'Stationary Shops', description: 'Receive jobs, manage inventory, mark prints ready.' },
              { icon: Truck, role: 'Runners', description: 'Pickup ready prints and deliver them across campus.' },
            ].map((item, index) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-colors"
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

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="py-16 max-w-3xl mx-auto"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about printing, pricing, and delivery.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full bg-card rounded-2xl border border-border/50 px-6 shadow-sm">
            <AccordionItem value="q1">
              <AccordionTrigger className="text-left">What file formats can I upload for printing?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                You can upload <strong>PDF, DOCX, PPTX, XLSX, TXT, and RTF</strong> files. Our system automatically reads the document and counts the exact number of pages — no estimation, no surprises.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="text-left">How is the printing cost calculated?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Cost is based on the <strong>actual page count</strong>, your chosen options (black & white or color, single or double-sided), and the number of copies. Total is shown clearly before you pay.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="text-left">What payment methods are supported?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We support <strong>M-Pesa, HaloPesa, debit/credit cards, and bank transfers</strong>. You'll get an instant receipt after payment.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger className="text-left">How long does printing and delivery take?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Most jobs are printed within <strong>15–30 minutes</strong> of payment. A runner then delivers your documents to your class, usually within an hour during peak hours.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger className="text-left">Can I track my document in real time?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes. From your dashboard you can see live status: <strong>Uploaded → Paid → Printing → Ready → Out for Delivery → Delivered</strong>.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger className="text-left">Where can I get free cover pages?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Visit our <Link to="/resources" className="text-primary underline font-medium">Cover Pages</Link> resource page to download free templates for both <strong>individual and group assignments</strong>.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q7">
              <AccordionTrigger className="text-left">What if my document doesn't arrive or has issues?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Contact support directly from your dashboard. If a print is incorrect or undelivered, we will <strong>reprint or refund</strong> at no extra cost.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q8">
              <AccordionTrigger className="text-left">Is my uploaded content private and secure?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Absolutely. Documents are <strong>encrypted in transit</strong>, only accessible to authorized stationary staff, and removed from our queue after delivery.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="my-20 relative overflow-hidden rounded-3xl bg-gradient-primary text-primary-foreground"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="relative p-10 md:p-14 text-center max-w-3xl mx-auto">
            <Sparkles className="h-10 w-10 mx-auto mb-4 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to skip the print queue?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join hundreds of students already saving time with PrintHub. Free to sign up.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button size="lg" variant="secondary" onClick={() => navigate('/register')} className="shadow-lg group">
                Create Free Account
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Sign In
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card/30">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Printer className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold bg-gradient-primary bg-clip-text text-transparent">PrintHub</span>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>© 2024 PrintHub. College Printing Management System.</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/resources" className="text-muted-foreground hover:text-foreground transition-colors">Cover Pages</Link>
              <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
