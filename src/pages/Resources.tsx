import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download, FileText, Users, Printer, Sparkles, Clock } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import CoverEditor from '@/components/cover/CoverEditor';
import { CoverTemplate } from '@/components/cover/types';

const templates: CoverTemplate[] = [
  {
    id: 'individual-assignment-blue',
    title: 'Individual Assignment — Classic Blue',
    description: 'Clean, formal cover page for individual assignments.',
    file: '/covers/individual-assignment-blue.pdf',
    category: 'individual',
    accent: 'from-blue-600 to-blue-800',
    themeColor: '#1e3a8a',
  },
  {
    id: 'individual-assignment-emerald',
    title: 'Individual Assignment — Emerald',
    description: 'Modern emerald-toned cover for individual submissions.',
    file: '/covers/individual-assignment-emerald.pdf',
    category: 'individual',
    accent: 'from-emerald-600 to-emerald-800',
    themeColor: '#047857',
  },
  {
    id: 'individual-report',
    title: 'Individual Report Cover',
    description: 'Professional cover for reports and case studies.',
    file: '/covers/individual-report.pdf',
    category: 'individual',
    accent: 'from-orange-700 to-red-800',
    themeColor: '#9f1239',
  },
  {
    id: 'group-assignment-blue',
    title: 'Group Assignment — Classic Blue',
    description: 'Cover with member list section for group submissions.',
    file: '/covers/group-assignment-blue.pdf',
    category: 'group',
    accent: 'from-blue-600 to-indigo-800',
    themeColor: '#1e3a8a',
  },
  {
    id: 'group-assignment-purple',
    title: 'Group Assignment — Royal Purple',
    description: 'Stylish purple cover with group members section.',
    file: '/covers/group-assignment-purple.pdf',
    category: 'group',
    accent: 'from-purple-600 to-purple-900',
    themeColor: '#6b21a8',
  },
  {
    id: 'group-project',
    title: 'Group Project Cover',
    description: 'Detailed cover for group projects and final reports.',
    file: '/covers/group-project.pdf',
    category: 'group',
    accent: 'from-amber-600 to-orange-800',
    themeColor: '#b45309',
  },
];

interface HistoryItem {
  templateId: string;
  title: string;
  updatedAt: number;
}

const Resources = () => {
  const [activeTemplate, setActiveTemplate] = useState<CoverTemplate | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const loadHistory = () => {
    try {
      const raw = localStorage.getItem('cover-history') || '[]';
      setHistory(JSON.parse(raw));
    } catch {
      setHistory([]);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDownload = (file: string, title: string) => {
    const link = document.createElement('a');
    link.href = file;
    link.download = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openEditor = (t: CoverTemplate) => {
    setActiveTemplate(t);
    setEditorOpen(true);
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
                <button
                  type="button"
                  onClick={() => openEditor(t)}
                  className={`h-40 bg-gradient-to-br ${t.accent} relative flex items-center justify-center cursor-pointer overflow-hidden`}
                  aria-label={`Customize ${t.title}`}
                >
                  <FileText className="h-16 w-16 text-white/90 transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium flex items-center gap-1.5 text-sm">
                      <Sparkles className="h-4 w-4" /> Click to Customize
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 text-[10px] font-semibold bg-white/20 backdrop-blur px-2 py-0.5 rounded text-white uppercase tracking-wider">
                    PDF
                  </div>
                </button>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-semibold mb-2">{t.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">
                    {t.description}
                  </p>
                  <Button
                    size="sm"
                    className="w-full mb-2"
                    onClick={() => openEditor(t)}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Customize
                  </Button>
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
                      variant="outline"
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
            <Sparkles className="h-4 w-4" />
            Free · Editable · Print-ready
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Cover Page{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Generator
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Pick a template, fill in your details, and download a polished
            university-style cover page as PDF or PNG — ready to print.
          </p>
        </motion.div>

        {history.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Recently Edited</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {history.map((h) => {
                const t = templates.find((x) => x.id === h.templateId);
                if (!t) return null;
                return (
                  <button
                    key={h.templateId}
                    onClick={() => openEditor(t)}
                    className="text-left p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div
                      className="h-2 w-12 rounded-full mb-2"
                      style={{ background: t.themeColor }}
                    />
                    <div className="font-medium text-sm truncate">{h.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(h.updatedAt).toLocaleString()}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.section>
        )}

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

      <CoverEditor
        template={activeTemplate}
        open={editorOpen}
        onOpenChange={(o) => {
          setEditorOpen(o);
          if (!o) loadHistory();
        }}
        onSaved={loadHistory}
      />
    </div>
  );
};

export default Resources;
