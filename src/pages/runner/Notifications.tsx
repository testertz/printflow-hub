import { motion } from 'framer-motion';
import { Bell, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const mockNotifications = [
  { id: '1', title: 'New Pickup Task', message: '5 documents ready for pickup from stationary', date: '2024-01-15', read: false },
  { id: '2', title: 'Delivery Reminder', message: '3 documents pending delivery to class leaders', date: '2024-01-14', read: false },
  { id: '3', title: 'Task Completed', message: 'All deliveries for CS-2024-A completed', date: '2024-01-13', read: true },
  { id: '4', title: 'System Update', message: 'New delivery tracking feature available', date: '2024-01-12', read: true },
];

export default function RunnerNotifications() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground mt-2">Stay updated with your tasks</p>
      </div>

      <div className="space-y-4">
        {mockNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={notification.read ? 'opacity-60' : ''}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.read ? 'bg-muted' : 'bg-primary/10'}`}>
                    <Bell className={`h-5 w-5 ${notification.read ? 'text-muted-foreground' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      {!notification.read && (
                        <Button variant="ghost" size="sm" className="flex-shrink-0">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
