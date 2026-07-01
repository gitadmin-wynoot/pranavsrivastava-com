import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Identity */}
          <div className="space-y-2">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
              Pranav Srivastava
            </p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              AI, Cloud &amp; API Architect.
              <br />
              Based in the Netherlands.
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
              <a
                href="https://wynoot.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                Wynoot ↗
              </a>
            </div>
          </div>

          {/* Site links */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Site
            </p>
            <nav className="space-y-1.5">
              {[
                { label: "Labs", href: "/labs" },
                { label: "Learn", href: "/learn" },
                { label: "Writing", href: "/blog" },
                { label: "Projects", href: "/ai-lab" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Connect
            </p>
            <nav className="space-y-1.5">
              {[
                { label: "LinkedIn", href: "https://nl.linkedin.com/in/pranav-srivastava-651a9427" },
                { label: "Medium", href: "https://pranav-srivastava.medium.com" },
                { label: "GitHub", href: "https://pranavsdev.github.io" },
                { label: "Email", href: "mailto:hello@pranavsrivastava.com" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-xs text-zinc-400">
            © {year} Pranav Srivastava. Built in public.
          </p>
          {/* A quiet whisper — the circle is found, not advertised. */}
          <Link
            href="/circle"
            className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            The Circle — by invitation →
          </Link>
        </div>
      </div>
    </footer>
  );
}
