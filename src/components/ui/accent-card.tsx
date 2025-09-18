"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

// Define AccentCardContext
type AccentCardContextType = {
  variant: "default" | "accent";
};

const AccentCardContext = React.createContext<AccentCardContextType>({
  variant: "accent", // Default value for accent cards
});

// Hook to use AccentCardContext
const useAccentCardContext = () => {
  const context = React.useContext(AccentCardContext);
  if (!context) {
    throw new Error(
      "useAccentCardContext must be used within an AccentCard component",
    );
  }
  return context;
};

// Variants
const accentCardVariants = cva(
  "flex flex-col items-stretch text-card-foreground rounded-xl",
  {
    variants: {
      variant: {
        default: "bg-card border border-border shadow-xs black/5",
        accent: "bg-muted shadow-xs p-1",
      },
    },
    defaultVariants: {
      variant: "accent",
    },
  },
);

const accentCardHeaderVariants = cva(
  "flex items-center justify-between flex-wrap px-5 min-h-14 gap-2.5",
  {
    variants: {
      variant: {
        default: "border-b border-border",
        accent: "",
      },
    },
    defaultVariants: {
      variant: "accent",
    },
  },
);

const accentCardContentVariants = cva("grow p-5", {
  variants: {
    variant: {
      default: "",
      accent: "bg-card rounded-t-xl [&:last-child]:rounded-b-xl",
    },
  },
  defaultVariants: {
    variant: "accent",
  },
});

const accentCardFooterVariants = cva("flex items-center px-5 min-h-14", {
  variants: {
    variant: {
      default: "border-t border-border",
      accent: "bg-card rounded-b-xl mt-[2px]",
    },
  },
  defaultVariants: {
    variant: "accent",
  },
});

// AccentCard Component
function AccentCard({
  className,
  variant = "accent",
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof accentCardVariants>) {
  return (
    <AccentCardContext.Provider value={{ variant: variant || "accent" }}>
      <div
        data-slot="accent-card"
        className={cn(accentCardVariants({ variant }), className)}
        {...props}
      />
    </AccentCardContext.Provider>
  );
}

// AccentCardHeader Component
function AccentCardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useAccentCardContext();
  return (
    <div
      data-slot="accent-card-header"
      className={cn(accentCardHeaderVariants({ variant }), className)}
      {...props}
    />
  );
}

// AccentCardContent Component
function AccentCardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useAccentCardContext();
  return (
    <div
      data-slot="accent-card-content"
      className={cn(accentCardContentVariants({ variant }), className)}
      {...props}
    />
  );
}

// AccentCardFooter Component
function AccentCardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useAccentCardContext();
  return (
    <div
      data-slot="accent-card-footer"
      className={cn(accentCardFooterVariants({ variant }), className)}
      {...props}
    />
  );
}

// Other Components
function AccentCardHeading({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="accent-card-heading"
      className={cn("space-y-1", className)}
      {...props}
    />
  );
}

function AccentCardToolbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="accent-card-toolbar"
      className={cn("flex items-center gap-2.5", className)}
      {...props}
    />
  );
}

function AccentCardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="accent-card-title"
      className={cn(
        "text-base font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function AccentCardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="accent-card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

// Exports
export {
  AccentCard,
  AccentCardContent,
  AccentCardDescription,
  AccentCardFooter,
  AccentCardHeader,
  AccentCardHeading,
  AccentCardTitle,
  AccentCardToolbar,
};
