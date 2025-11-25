import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Layouts
import { StudentLayout } from "./layouts/StudentLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { RunnerLayout } from "./layouts/RunnerLayout";
import { StationaryLayout } from "./layouts/StationaryLayout";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import UploadDocument from "./pages/student/UploadDocument";
import MyDocuments from "./pages/student/MyDocuments";
import Tracking from "./pages/student/Tracking";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import PrintJobs from "./pages/admin/PrintJobs";
import Payments from "./pages/admin/Payments";
import Deliveries from "./pages/admin/Deliveries";
import Settings from "./pages/admin/Settings";
import AdminNotifications from "./pages/admin/Notifications";
import AddUser from "./pages/admin/AddUser";

// Runner Pages
import RunnerDashboard from "./pages/runner/Dashboard";
import PickupTasks from "./pages/runner/PickupTasks";
import DeliverTasks from "./pages/runner/DeliverTasks";

// Stationary Pages
import StationaryDashboard from "./pages/stationary/Dashboard";
import StationaryPrintJobs from "./pages/stationary/PrintJobs";
import InventoryList from "./pages/stationary/InventoryList";
import AddItem from "./pages/stationary/AddItem";
import StockUpdate from "./pages/stationary/StockUpdate";
import Alerts from "./pages/stationary/Alerts";

// Shared Pages
import Profile from "./pages/Profile";
import StudentNotifications from "./pages/student/Notifications";
import RunnerNotifications from "./pages/runner/Notifications";
import StationaryNotifications from "./pages/stationary/Notifications";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Student Routes */}
            <Route path="/student" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="upload" element={<UploadDocument />} />
              <Route path="documents" element={<MyDocuments />} />
              <Route path="tracking" element={<Tracking />} />
              <Route path="notifications" element={<StudentNotifications />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="print-jobs" element={<PrintJobs />} />
              <Route path="payments" element={<Payments />} />
              <Route path="deliveries" element={<Deliveries />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="add-user" element={<AddUser />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Runner Routes */}
            <Route path="/runner" element={
              <ProtectedRoute allowedRoles={['runner']}>
                <RunnerLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/runner/dashboard" replace />} />
              <Route path="dashboard" element={<RunnerDashboard />} />
              <Route path="pickup" element={<PickupTasks />} />
              <Route path="deliver" element={<DeliverTasks />} />
              <Route path="notifications" element={<RunnerNotifications />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Stationary Routes */}
            <Route path="/stationary" element={
              <ProtectedRoute allowedRoles={['stationary']}>
                <StationaryLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/stationary/dashboard" replace />} />
              <Route path="dashboard" element={<StationaryDashboard />} />
              <Route path="print-jobs" element={<StationaryPrintJobs />} />
              <Route path="inventory" element={<InventoryList />} />
              <Route path="add-item" element={<AddItem />} />
              <Route path="stock-update" element={<StockUpdate />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="notifications" element={<StationaryNotifications />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
