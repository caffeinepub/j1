export function Footer() {
  const year = new Date().getFullYear();
  const hostname = window.location.hostname;
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="w-full border-t border-border mt-16"
      style={{ backgroundColor: "oklch(0.11 0 0)" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col items-center gap-4">
        <span className="text-3xl font-black text-primary">J1</span>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span>Market Results</span>
          <span>Live Data</span>
          <span>Analytics</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {year}.{" "}
          <a
            href={utmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
