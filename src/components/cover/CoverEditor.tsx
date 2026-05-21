import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RotateCcw, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { CoverData, CoverTemplate, defaultCoverData } from './types';
import CoverPreview from './CoverPreview';
import DynamicMembersField from './DynamicMembersField';
import ExportActions from './ExportActions';

interface Props {
  template: CoverTemplate | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSaved?: (data: CoverData) => void;
}

const THEMES = [
  { name: 'Royal Blue', value: '#1e3a8a' },
  { name: 'Emerald', value: '#047857' },
  { name: 'Crimson', value: '#9f1239' },
  { name: 'Royal Purple', value: '#6b21a8' },
  { name: 'Amber', value: '#b45309' },
  { name: 'Slate', value: '#334155' },
];

const storageKey = (id: string) => `cover-draft:${id}`;

const CoverEditor = ({ template, open, onOpenChange, onSaved }: Props) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<CoverData | null>(null);

  // Initialize / load draft when template changes
  useEffect(() => {
    if (!template) return;
    const saved = localStorage.getItem(storageKey(template.id));
    if (saved) {
      try {
        setData(JSON.parse(saved));
        return;
      } catch {
        /* ignore */
      }
    }
    setData(
      defaultCoverData(template.id, template.category, template.themeColor || '#1e3a8a'),
    );
  }, [template]);

  // Auto-save
  useEffect(() => {
    if (!data || !template) return;
    const t = setTimeout(() => {
      const payload = { ...data, updatedAt: Date.now() };
      localStorage.setItem(storageKey(template.id), JSON.stringify(payload));
      // Update history
      const histRaw = localStorage.getItem('cover-history') || '[]';
      try {
        const hist = JSON.parse(histRaw) as Array<{
          templateId: string;
          title: string;
          updatedAt: number;
        }>;
        const filtered = hist.filter((h) => h.templateId !== template.id);
        filtered.unshift({
          templateId: template.id,
          title: data.assignmentTitle || template.title,
          updatedAt: payload.updatedAt!,
        });
        localStorage.setItem('cover-history', JSON.stringify(filtered.slice(0, 8)));
        onSaved?.(payload);
      } catch {
        /* ignore */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [data, template, onSaved]);

  const update = <K extends keyof CoverData>(key: K, value: CoverData[K]) =>
    setData((d) => (d ? { ...d, [key]: value } : d));

  const handleLogo = (file?: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update('logo', reader.result as string);
    reader.readAsDataURL(file);
  };

  const reset = () => {
    if (!template) return;
    localStorage.removeItem(storageKey(template.id));
    setData(defaultCoverData(template.id, template.category, template.themeColor || '#1e3a8a'));
    toast.success('Form reset');
  };

  const fileName = useMemo(
    () => data?.assignmentTitle || template?.title || 'cover',
    [data, template],
  );

  if (!template || !data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] xl:max-w-[1280px] h-[92vh] p-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center justify-between gap-4">
            <span className="truncate">Customize · {template.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[420px_1fr] overflow-hidden">
          {/* Form panel */}
          <ScrollArea className="border-r">
            <div className="p-6 space-y-5">
              {/* Style controls */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Layout</Label>
                  <Select
                    value={data.layout}
                    onValueChange={(v) => update('layout', v as CoverData['layout'])}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Theme Color</Label>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {THEMES.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        title={t.name}
                        onClick={() => update('themeColor', t.value)}
                        className={`w-6 h-6 rounded-full border-2 transition ${
                          data.themeColor === t.value
                            ? 'border-foreground scale-110'
                            : 'border-transparent'
                        }`}
                        style={{ background: t.value }}
                      />
                    ))}
                    <input
                      type="color"
                      value={data.themeColor}
                      onChange={(e) => update('themeColor', e.target.value)}
                      className="w-6 h-6 rounded-full border-0 p-0 cursor-pointer bg-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs">
                  Font Size · {Math.round(data.fontScale * 100)}%
                </Label>
                <Slider
                  value={[data.fontScale * 100]}
                  min={85}
                  max={120}
                  step={1}
                  onValueChange={([v]) => update('fontScale', v / 100)}
                  className="mt-2"
                />
              </div>

              <div className="h-px bg-border" />

              {/* Common fields */}
              <Field label="University Name" value={data.university} onChange={(v) => update('university', v)} />
              <Field label="Faculty / Department" value={data.faculty} onChange={(v) => update('faculty', v)} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Course Code" value={data.courseCode} onChange={(v) => update('courseCode', v)} />
                <Field label="Course Name" value={data.courseName} onChange={(v) => update('courseName', v)} />
              </div>
              <Field
                label="Assignment Title"
                value={data.assignmentTitle}
                onChange={(v) => update('assignmentTitle', v)}
              />

              {data.category === 'individual' ? (
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Student Name"
                    value={data.studentName || ''}
                    onChange={(v) => update('studentName', v)}
                  />
                  <Field
                    label="Reg. Number"
                    value={data.registrationNumber || ''}
                    onChange={(v) => update('registrationNumber', v)}
                  />
                </div>
              ) : (
                <>
                  <Field
                    label="Group Name"
                    value={data.groupName || ''}
                    onChange={(v) => update('groupName', v)}
                  />
                  <DynamicMembersField
                    members={data.members || []}
                    onChange={(m) => update('members', m)}
                  />
                </>
              )}

              <Field label="Lecturer Name" value={data.lecturerName} onChange={(v) => update('lecturerName', v)} />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Submission Date"
                  type="date"
                  value={data.submissionDate}
                  onChange={(v) => update('submissionDate', v)}
                />
                <Field
                  label="Academic Year"
                  placeholder="2024/2025"
                  value={data.academicYear}
                  onChange={(v) => update('academicYear', v)}
                />
              </div>

              <div>
                <Label className="text-xs">Logo (optional)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('logo-upload-input')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-1" /> Upload
                  </Button>
                  {data.logo && (
                    <>
                      <img src={data.logo} alt="logo" className="h-8 w-8 object-contain rounded border" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => update('logo', null)}
                      >
                        Remove
                      </Button>
                    </>
                  )}
                  <input
                    id="logo-upload-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleLogo(e.target.files?.[0])}
                  />
                </div>
              </div>

              <div className="h-px bg-border" />

              <Button variant="ghost" size="sm" onClick={reset} className="w-full">
                <RotateCcw className="h-4 w-4 mr-1" /> Reset Form
              </Button>
            </div>
          </ScrollArea>

          {/* Preview panel */}
          <div className="flex flex-col bg-muted/30 overflow-hidden">
            <div className="px-6 py-3 border-b bg-background/50 flex items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">Live Preview · A4</div>
              <ExportActions previewRef={previewRef} fileName={fileName} />
            </div>
            <ScrollArea className="flex-1">
              <div className="p-6 flex justify-center">
                <div
                  className="shadow-2xl rounded-sm overflow-hidden"
                  style={{
                    transform: 'scale(var(--cover-scale, 0.6))',
                    transformOrigin: 'top center',
                  }}
                >
                  <CoverPreview ref={previewRef} data={data} />
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div>
    <Label className="text-xs">{label}</Label>
    <Input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1"
    />
  </div>
);

export default CoverEditor;
