export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:px-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium text-foreground">TailorMyJob</p>
        <div className="flex flex-wrap gap-4">
          <a href="/terms" className="hover:text-foreground">
            Terms
          </a>
          <a href="/privacy" className="hover:text-foreground">
            Privacy
          </a>
          <a href="mailto:hello@tailormyjob.com" className="hover:text-foreground">
            Contact
          </a>
          <a href="/help" className="hover:text-foreground">
            Help / FAQ
          </a>
        </div>
      </div>
    </footer>
  );
}
