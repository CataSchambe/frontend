import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg, duration) => addToast(msg, 'success', duration), [addToast]);
  const error = useCallback((msg, duration) => addToast(msg, 'error', duration), [addToast]);
  const warning = useCallback((msg, duration) => addToast(msg, 'warning', duration), [addToast]);
  const info = useCallback((msg, duration) => addToast(msg, 'info', duration), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, success, error, warning, info }}>
      {children}
      {/* Toast Container Floating lower-right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let borderColor = 'border-l-accent-cyan';
          let Icon = Info;
          let iconColor = 'text-accent-cyan';

          if (toast.type === 'success') {
            borderColor = 'border-l-status-success';
            Icon = CheckCircle;
            iconColor = 'text-status-success';
          } else if (toast.type === 'error') {
            borderColor = 'border-l-status-danger';
            Icon = AlertCircle;
            iconColor = 'text-status-danger';
          } else if (toast.type === 'warning') {
            borderColor = 'border-l-status-warning';
            Icon = AlertTriangle;
            iconColor = 'text-status-warning';
          } else if (toast.type === 'purple') {
            borderColor = 'border-l-accent-purple';
            iconColor = 'text-accent-purple';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto bg-bg-card text-text-main px-4 py-3 rounded-lg shadow-card border border-border-subtle border-l-4 ${borderColor} flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 transition-all`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
                <span className="text-sm font-medium leading-snug break-words">
                  {toast.message}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-text-muted hover:text-text-main p-1 rounded transition-colors"
                aria-label="Cerrar notificación"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser utilizado dentro de un ToastProvider');
  }
  return context;
};

export default ToastProvider;
