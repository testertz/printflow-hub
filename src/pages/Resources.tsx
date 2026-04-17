import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download, FileText, Users, Printer } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface CoverTemplate {
  id: string;
  title: string;
  description: string;
  file: string;
  category: 'individual' | 'group';
  accent: string;
}

const templates: CoverTemplate[] = [
  {
    id: 'individual-assignment-blue',
    title: 'Individual Assignment — Classic Blue',
    description: 'Clean, formal cover page for individual assignments.',
    file: '/covers/individual-assignment-blue.pdf',
    category: 'individual',
    accent: 'from-blue-600 to-blue-800',
  },
  {
    id: 'individual-assignment-emerald',
    title: 'Individual Assignment — Emerald',
    description: 'Modern emerald-toned cover for individual submissions.',
    file: '/covers/individual-assignment-emerald.pdf',
    category: 'individual',
    accent: 'from-emerald-600 to-emerald-800',
  },
  {
    id: 'individual-report',
    title: 'Individual Report Cover',
    description: 'Professional cover for reports and case studies.',
    file: '/covers/individual-report.pdf',
    category: 'individual',
    accent: 'from-orange-700 to-red-800',
  },
  {
    id: 'group-assignment-blue',
    title: 'Group Assignment — Classic Blue',
    description: 'Cover with member list section for group submissions.',
    file: '/covers/group-assignment-blue.pdf',
    category: 'group',
    accent: 'from-blue-600 to-indigo-800',
  },
  {
    id: 'group-assignment-purple',
    title: 'Group Assignment — Royal Purple',
    description: 'Stylish purple cover with group members section.',
    file: '/covers/group-assignment-purple.pdf',
    category: 'group',
    accent: 'from-purple-600 to-purple-900',
  },
  {
    id: 'group-project',
    title: 'Group Project Cover',
    description: 'Detailed cover for group projects and final reports.',
    file: '/covers/group-project.pdf',
    category: 'group',
    accent: 'from-amber-600 to-orange-800',
  },
];

const Resources = () => {
  const handleDownload = (file: string, title: string) => {
    const link = document.createElement('a');
    link.href = file;
    link.download = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSection = (
    title: string,
    icon: React.ElementType,
    category: 'individual' | 'group'
  ) => {
    const Icon = icon;
    const items = templates.filter((t) => t.category === category);
    return (
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="overflow-hidden h-full flex flex-col group hover:shadow-xl transition-shadow">
                <div
                  className={`h-40 bg-gradient-to-br ${t.accent} relative flex items-center justify-center`}
                >
                  <FileText className="h-16 w-16 text-white/90" />
                  <div className="absolute bottom-2 right-2 text-[10px] font-semibold bg-white/20 backdrop-blur px-2 py-0.5 rounded text-white uppercase tracking-wider">
                    PDF
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-semibold mb-2">{t.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">
                    {t.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(t.file, '_blank')}
                    >
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDownload(t.file, t.title)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Printer className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                PrintHub
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <FileText className="h-4 w-4" />
            Free Resources
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Cover Page <span className="bg-gradient-primary bg-clip-text text-transparent">Templates</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Download free, professional cover pages for your individual and group assignments.
            Edit the fields, print them with PrintHub, and submit with confidence.
          </p>
        </motion.div>

        {renderSection('Individual Assignments', FileText, 'individual')}
        {renderSection('Group Assignments', Users, 'group')}

        <div className="mt-8 p-8 rounded-2xl bg-gradient-primary text-primary-foreground text-center">
          <h2 className="text-2xl font-bold mb-2">Need it printed?</h2>
          <p className="opacity-90 mb-4">
            Upload your assignment with the cover page and we'll print and deliver it to you.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </div>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 PrintHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Resources;
