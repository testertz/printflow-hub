import { motion } from 'framer-motion';
import { Users, Printer, DollarSign, Truck, TrendingUp, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { ChartCard } from '@/components/ChartCard';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockDocuments, mockUsers } from '@/services/api';

const revenueData = [
  { name: 'Mon', revenue: 2400 },
  { name: 'Tue', revenue: 1398 },
  { name: 'Wed', revenue: 9800 },
  { name: 'Thu', revenue: 3908 },
  { name: 'Fri', revenue: 4800 },
  { name: 'Sat', revenue: 3800 },
  { name: 'Sun', revenue: 4300 },
];

const printVolumeData = [
  { name: 'Week 1', bw: 120, color: 40 },
  { name: 'Week 2', bw: 98, color: 55 },
  { name: 'Week 3', bw: 150, color: 60 },
  { name: 'Week 4', bw: 130, color: 45 },
];

const classActivityData = [
  { name: 'CS101', value: 400 },
  { name: 'EE201', value: 300 },
  { name: 'ME301', value: 200 },
  { name: 'CE401', value: 278 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--info))'];

export default function AdminDashboard() {
  const totalStudents = mockUsers.filter(u => u.role === 'student').length;
  const totalJobs = mockDocuments.length;
  const todayRevenue = 12450;
  const activeRunners = mockUsers.filter(u => u.role === 'runner' && u.status === 'active').length;
  const pendingJobs = mockDocuments.filter(d => !['completed', 'delivered'].includes(d.printStatus)).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">System overview and analytics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {[
          { title: 'Total Students', value: totalStudents, icon: Users, color: 'text-primary', delay: 0.1 },
          { title: 'Print Jobs', value: totalJobs, icon: Printer, color: 'text-info', delay: 0.2 },
          { title: 'Revenue Today', value: todayRevenue, icon: DollarSign, color: 'text-success', prefix: '₹', delay: 0.3 },
          { title: 'Active Runners', value: activeRunners, icon: Truck, color: 'text-warning', delay: 0.4 },
          { title: 'Pending Jobs', value: pendingJobs, icon: FileText, color: 'text-destructive', delay: 0.5 },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stat.prefix && stat.prefix}
                  <AnimatedCounter value={stat.value} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +12% from last week
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ChartCard title="Weekly Revenue" description="Revenue generated this week">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--success))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <ChartCard title="Print Volume" description="B/W vs Color prints this month">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={printVolumeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="bw" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="B/W" />
                <Bar dataKey="color" fill="hsl(var(--info))" radius={[8, 8, 0, 0]} name="Color" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <ChartCard title="Class Activity" description="Print jobs by class">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={classActivityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {classActivityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>
    </div>
  );
}
