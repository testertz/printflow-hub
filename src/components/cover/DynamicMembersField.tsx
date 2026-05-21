import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { GroupMember } from './types';

interface Props {
  members: GroupMember[];
  onChange: (members: GroupMember[]) => void;
}

const DynamicMembersField = ({ members, onChange }: Props) => {
  const add = () =>
    onChange([...members, { id: crypto.randomUUID(), name: '', regNumber: '' }]);
  const remove = (id: string) =>
    onChange(members.filter((m) => m.id !== id));
  const update = (id: string, field: 'name' | 'regNumber', value: string) =>
    onChange(members.map((m) => (m.id === id ? { ...m, [field]: value } : m)));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Group Members</Label>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="h-4 w-4 mr-1" /> Add Member
        </Button>
      </div>
      <div className="space-y-2">
        {members.map((m, i) => (
          <div key={m.id} className="flex gap-2 items-center">
            <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
            <Input
              placeholder="Full name"
              value={m.name}
              onChange={(e) => update(m.id, 'name', e.target.value)}
            />
            <Input
              placeholder="Reg. number"
              value={m.regNumber}
              onChange={(e) => update(m.id, 'regNumber', e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(m.id)}
              disabled={members.length <= 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicMembersField;
