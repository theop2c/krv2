import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { FileUpload } from './components/FileUpload';
import { FileList } from './components/FileList';
import { DashboardStats } from './components/DashboardStats';
import { UserStatus } from './components/UserStatus';
import { UpgradeSuccess } from './components/UpgradeSuccess';

export function Dashboard() {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {isSuccess && <UpgradeSuccess />}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="mt-1 space-y-1">
              <p className="text-gray-600">Welcome, {user.email}</p>
              <p className="text-sm text-gray-500">ID: {user.id}</p>
            </div>
          </div>

          <UserStatus />
          <DashboardStats />
          <FileUpload />
          <FileList />
        </div>
      </div>
    </div>
  );
}