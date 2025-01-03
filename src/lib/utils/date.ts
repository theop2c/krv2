import { logger } from '../logger';

export function formatDate(date: Date | string | number): string {
  try {
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  } catch (error) {
    logger.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

export function formatRelativeTime(date: Date | string | number): string {
  try {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return formatDate(date);
  } catch (error) {
    logger.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
}