import type { LogLevel } from './types';

export const LOG_CONFIG = {
  level: (import.meta.env.DEV ? 'debug' : 'info') as LogLevel,
  enabled: true,
  persistLogs: import.meta.env.PROD
};