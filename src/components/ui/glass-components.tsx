import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

// --- GLASS BUTTON COMPONENT ---
const glassButtonVariants = cva(
  "relative isolate all-unset cursor-pointer rounded-full transition-all",
  {
    variants: {
      size: {
        default: "text-base font-medium",
        sm: "text-sm font-medium",
        lg: "text-lg font-medium",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
);

const glassButtonTextVariants = cva(
  "glass-button-text relative block select-none tracking-tighter",
  {
    variants: {
      size: {
        default: "px-6 py-3.5",
        sm: "px-4 py-2",
        lg: "px-8 py-4",
        icon: "flex h-10 w-10 items-center justify-center"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string;
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, contentClassName, onClick, ...props }, ref) => {
    const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const button = e.currentTarget.querySelector('button');
      if (button && e.target !== button) button.click();
    };

    return (
      <div
        className={cn("glass-button-wrap cursor-pointer rounded-full relative", className)}
        onClick={handleWrapperClick}
      >
        <button
          className={cn("glass-button relative z-10", glassButtonVariants({ size }))}
          ref={ref}
          onClick={onClick}
          {...props}
        >
          <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>
            {children}
          </span>
        </button>
        <div className="glass-button-shadow rounded-full pointer-events-none"></div>
      </div>
    );
  }
);

GlassButton.displayName = "GlassButton";

// --- GLASS INPUT COMPONENT ---
export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, icon, endIcon, ...props }, ref) => {
    return (
      <div className="glass-input-wrap w-full">
        <div className="glass-input">
          <span className="glass-input-text-area"></span>
          {icon && (
            <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-10 pl-2">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "relative z-10 h-full w-0 flex-grow bg-transparent text-foreground placeholder:text-foreground/60 focus:outline-none",
              icon ? "" : "pl-4",
              endIcon ? "" : "pr-4",
              className
            )}
            {...props}
          />
          {endIcon && (
            <div className="relative z-10 flex-shrink-0 pr-2">
              {endIcon}
            </div>
          )}
        </div>
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";

// --- GLASS CARD COMPONENT ---
export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative backdrop-blur-md bg-card/80 border-2 border-border/50 rounded-2xl p-6 shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
