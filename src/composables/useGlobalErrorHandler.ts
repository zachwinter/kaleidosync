import { ref, onMounted, onUnmounted } from "vue";
import { useSessionLogger, SessionEventType } from "@wearesage/vue";

export function useGlobalErrorHandler() {
  const sessionLogger = useSessionLogger();
  const isEnabled = ref(true);
  const errorCount = ref(0);
  const lastError = ref<Error | null>(null);

  let originalWindowErrorHandler: ((event: ErrorEvent) => void) | null = null;
  let originalUnhandledRejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;

  function handleError(error: Error, context: string, additionalData: Record<string, any> = {}) {
    if (!isEnabled.value) return;

    errorCount.value++;
    lastError.value = error;

    const errorData = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
      errorCount: errorCount.value,
      timestamp: Date.now(),
      ...additionalData
    };

    sessionLogger.logEvent(SessionEventType.ERROR_OCCURRED, errorData);

    console.error(`[GlobalErrorHandler] ${context}:`, error);
  }

  function handleWindowError(event: ErrorEvent) {
    const error = event.error || new Error(event.message);
    handleError(error, "window_error", {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      type: "javascript_error"
    });

    if (originalWindowErrorHandler) {
      originalWindowErrorHandler(event);
    }
  }

  function handleUnhandledRejection(event: PromiseRejectionEvent) {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    
    handleError(error, "unhandled_promise_rejection", {
      reason: event.reason,
      type: "promise_rejection"
    });

    if (originalUnhandledRejectionHandler) {
      originalUnhandledRejectionHandler(event);
    }
  }

  function handleVueError(error: Error, instance: any, info: string) {
    handleError(error, "vue_error", {
      componentName: instance?.$options?.name || instance?.$?.type?.name || "Unknown",
      errorInfo: info,
      type: "vue_error"
    });
  }

  function setupErrorHandlers() {
    originalWindowErrorHandler = window.onerror as any;
    originalUnhandledRejectionHandler = window.onunhandledrejection as any;

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
  }

  function removeErrorHandlers() {
    window.removeEventListener("error", handleWindowError);
    window.removeEventListener("unhandledrejection", handleUnhandledRejection);

    if (originalWindowErrorHandler) {
      window.onerror = originalWindowErrorHandler;
    }
    if (originalUnhandledRejectionHandler) {
      window.onunhandledrejection = originalUnhandledRejectionHandler;
    }
  }

  function enable() {
    isEnabled.value = true;
  }

  function disable() {
    isEnabled.value = false;
  }

  function reset() {
    errorCount.value = 0;
    lastError.value = null;
  }

  onMounted(() => {
    setupErrorHandlers();
  });

  onUnmounted(() => {
    removeErrorHandlers();
  });

  return {
    isEnabled,
    errorCount,
    lastError,
    handleError,
    handleVueError,
    enable,
    disable,
    reset
  };
}