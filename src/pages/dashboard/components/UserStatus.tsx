import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Crown, Loader2 } from 'lucide-react';
import { USER_ROLE_NAMES } from '@/lib/constants';
import { createCheckoutSession } from '@/lib/stripe/client';
import { STRIPE_CONFIG } from '@/lib/stripe/config';
import { logger } from '@/lib/logger';

export function UserStatus() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  
  if (!user) return null;

  const handleUpgrade = async () => {
    if (!user.id) {
      logger.error('No user ID found');
      return;
    }

    try {
      setLoading(true);
      const priceId = user.role === 'freemium' 
        ? STRIPE_CONFIG.prices.premium 
        : STRIPE_CONFIG.prices.or;
      
      const url = await createCheckoutSession(priceId, user.id);
      window.location.href = url;
    } catch (error) {
      logger.error('Upgrade error:', error);
      setLoading(false);
    }
  };

  const getUpgradeButton = () => {
    if (user.role === 'or') return null;

    const targetTier = user.role === 'freemium' ? 'Premium' : 'Gold';
    
    return (
      <Button 
        onClick={handleUpgrade}
        className="ml-4"
        variant="outline"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to {targetTier}
          </>
        )}
      </Button>
    );
  };

  const getRoleColor = () => {
    switch (user.role) {
      case 'or':
        return 'bg-yellow-100 text-yellow-800';
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor()}`}>
          {USER_ROLE_NAMES[user.role]}
        </span>
        <span className="text-sm text-gray-600">
          {user.role === 'freemium' 
            ? 'Upgrade to Premium for more storage and features' 
            : user.role === 'premium' 
              ? 'Upgrade to Gold for unlimited access'
              : 'You have full access to all features'}
        </span>
      </div>
      {getUpgradeButton()}
    </div>
  );
}