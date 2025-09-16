export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="fixed top-0 left-0 z-[100] bg-primary text-primary-foreground px-4 py-2 font-medium transition-all duration-300 -translate-y-full focus:translate-y-0"
      >
        Skip to main content
      </a>
      <a
        href="#main-navigation"
        className="fixed top-0 left-20 z-[100] bg-primary text-primary-foreground px-4 py-2 font-medium transition-all duration-300 -translate-y-full focus:translate-y-0"
      >
        Skip to navigation
      </a>
    </div>
  );
}
