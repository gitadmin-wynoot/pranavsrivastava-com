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
                href="https://qubitsy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                Qubitsy ↗
              </a>
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
                { label: "AI Lab", href: "/ai-lab" },
                { label: "Blog", href: "/blog" },
                { label: "Learn", href: "/learn" },
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
                { label: "GitHub", href: "https://github.com" },
                { label: "LinkedIn", href: "https://linkedin.com" },
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
          <p className="text-xs text-zinc-400">
            This site is a living AI OS — always evolving.
          </p>
        </div>
      </div>
    </footer>
  );
}
