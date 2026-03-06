import { useState, useEffect, useCallback, useRef, createContext, useContext, ReactNode } from "react";

type ToastType = "success" | "info" | "warning";

interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextIdRef = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = nextIdRef.current++;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const TYPE_CLASSES: Record<ToastType, string> = {
  success: "bg-green-500",
  info: "bg-blue-500",
  warning: "bg-yellow-500 text-yellow-900",
};

function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${TYPE_CLASSES[toast.type]} text-white px-4 py-2 rounded shadow-lg text-sm min-w-[250px] transition-opacity`}>
      {toast.message}
    </div>
  );
}
