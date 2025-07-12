import { ref, onMounted, onUnmounted } from "vue";
import { useSessionLogger, SessionEventType } from "@wearesage/vue";

export function useConsoleMonitor() {
  const sessionLogger = useSessionLogger();
  const isEnabled = ref(true);
  const errorCount = ref(0);
  const warningCount = ref(0);

  const originalConsole = {
    error: console.error,
    warn: console.warn,
    log: console.log,
    debug: console.debug,
    info: console.info
  };

  const throttleMap = new Map<string, number>();
  const THROTTLE_INTERVAL = 1000; // 1 second throttle

  function shouldThrottle(message: string): boolean {
    const now = Date.now();
    const lastLogged = throttleMap.get(message);
    
    if (!lastLogged || now - lastLogged > THROTTLE_INTERVAL) {
      throttleMap.set(message, now);
      return false;
    }
    
    return true;
  }

  function createLogData(level: string, args: any[]): Record<string, any> {
    const message = args.map(arg => {
      if (typeof arg === 'string') return arg;
      if (arg instanceof Error) return arg.message;
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    }).join(' ');

    return {
      level,
      message,
      argumentCount: args.length,
      timestamp: Date.now(),
      stack: new Error().stack,
      type: "console_log"
    };
  }

  function interceptConsoleError(...args: any[]) {
    const message = args.map(arg => String(arg)).join(' ');
    
    if (isEnabled.value && !shouldThrottle(message)) {
      errorCount.value++;
      
      const errorData = createLogData('error', args);
      sessionLogger.logEvent(SessionEventType.ERROR_OCCURRED, errorData);
    }

    originalConsole.error.apply(console, args);
  }

  function interceptConsoleWarn(...args: any[]) {
    const message = args.map(arg => String(arg)).join(' ');
    
    if (isEnabled.value && !shouldThrottle(message)) {
      warningCount.value++;
      
      const warningData = createLogData('warn', args);
      sessionLogger.logEvent(SessionEventType.ERROR_OCCURRED, {
        ...warningData,
        severity: 'warning'
      });
    }

    originalConsole.warn.apply(console, args);
  }

  function interceptConsoleLog(...args: any[]) {
    originalConsole.log.apply(console, args);
  }

  function interceptConsoleDebug(...args: any[]) {
    originalConsole.debug.apply(console, args);
  }

  function interceptConsoleInfo(...args: any[]) {
    originalConsole.info.apply(console, args);
  }

  function setupConsoleInterception() {
    console.error = interceptConsoleError;
    console.warn = interceptConsoleWarn;
    console.log = interceptConsoleLog;
    console.debug = interceptConsoleDebug;
    console.info = interceptConsoleInfo;
  }

  function restoreConsole() {
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
    console.log = originalConsole.log;
    console.debug = originalConsole.debug;
    console.info = originalConsole.info;
  }

  function enable() {
    isEnabled.value = true;
  }

  function disable() {
    isEnabled.value = false;
  }

  function reset() {
    errorCount.value = 0;
    warningCount.value = 0;
    throttleMap.clear();
  }

  function cleanupThrottleMap() {
    const now = Date.now();
    const cutoff = now - THROTTLE_INTERVAL * 2;
    
    for (const [message, timestamp] of throttleMap.entries()) {
      if (timestamp < cutoff) {
        throttleMap.delete(message);
      }
    }
  }

  const cleanupInterval = setInterval(cleanupThrottleMap, THROTTLE_INTERVAL * 10);

  onMounted(() => {
    setupConsoleInterception();
  });

  onUnmounted(() => {
    restoreConsole();
    clearInterval(cleanupInterval);
  });

  return {
    isEnabled,
    errorCount,
    warningCount,
    enable,
    disable,
    reset,
    originalConsole
  };
}