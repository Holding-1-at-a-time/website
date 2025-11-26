// Modern Sonner toast implementation for backward compatibility
// This exports the Sonner toast function with the same interface as the deprecated use-toast hook

import { toast } from "sonner";

// Re-export the modern toast function
export { toast };

// Legacy compatibility - if any code expects a useToast hook
export const useToast = () => ({
  toast: (options: {
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
  }) => {
    const { title = "", description = "", variant = "default" } = options;
    
    if (variant === "destructive") {
      return toast.error(title, { description });
    } else {
      return toast.success(title, { description });
    }
  },
  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },
});