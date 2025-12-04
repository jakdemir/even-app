/**
 * Logger utility for debugging on mobile and production
 * Logs are visible in:
 * - Browser console (desktop)
 * - Eruda console (mobile World App)
 * - Vercel logs (server-side)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
    [key: string]: any;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';
    private isVerbose = process.env.NEXT_PUBLIC_VERBOSE_LOGGING === 'true';

    private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
        const timestamp = new Date().toISOString();
        const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
    }

    debug(message: string, context?: LogContext) {
        if (this.isDevelopment || this.isVerbose) {
            console.log(this.formatMessage('debug', message, context));
        }
    }

    info(message: string, context?: LogContext) {
        if (this.isDevelopment || this.isVerbose) {
            console.info(this.formatMessage('info', message, context));
        }
    }

    warn(message: string, context?: LogContext) {
        console.warn(this.formatMessage('warn', message, context));
    }

    error(message: string, error?: Error | any, context?: LogContext) {
        const errorContext = {
            ...context,
            error: error?.message || error,
            stack: error?.stack,
        };
        console.error(this.formatMessage('error', message, errorContext));
    }

    // Special methods for tracking user flows
    userAction(action: string, details?: LogContext) {
        this.info(`🎯 User Action: ${action}`, details);
    }

    apiCall(endpoint: string, method: string, details?: LogContext) {
        this.debug(`🌐 API Call: ${method} ${endpoint}`, details);
    }

    apiResponse(endpoint: string, status: number, details?: LogContext) {
        this.debug(`✅ API Response: ${endpoint} (${status})`, details);
    }

    dbQuery(operation: string, table: string, details?: LogContext) {
        this.debug(`💾 DB Query: ${operation} on ${table}`, details);
    }

    navigation(from: string, to: string) {
        this.info(`🧭 Navigation: ${from} → ${to}`);
    }
}

export const logger = new Logger();
