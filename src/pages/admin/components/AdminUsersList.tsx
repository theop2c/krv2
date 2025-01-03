import { useState } from 'react';
import { useAdminStore } from '@/store/admin';
import { useFilesStore } from '@/store/files'; // Add files store
import { formatBytes } from '@/lib/utils';
import { RoleSelect } from '@/components/admin/RoleSelect';
import type { Utilisateur } from '@/types';

export function AdminUsersList() {
  const { users, loading, error, updateUserRole } = useAdminStore();
  const { files } = useFilesStore(); // Get files from store
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: Utilisateur['role']) => {
    try {
      setUpdateError(null);
      await updateUserRole(userId, newRole);
    } catch (error) {
      setUpdateError('Failed to update user role');
      console.error('Role update error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error || updateError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">{error || updateError}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Storage Used</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Files</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => {
            // Get files count for this user
            const userFiles = files.filter(f => f.utilisateurId === user.id);
            const filesCount = userFiles.length;

            return (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RoleSelect
                    currentRole={user.role}
                    onRoleChange={(role) => handleRoleChange(user.id, role)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatBytes(user.stockageUtilise)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {filesCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.derniereMiseAJour).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}