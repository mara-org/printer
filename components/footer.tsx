export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink/10">
      <div className="mx-auto max-w-5xl px-6 py-10 text-xs text-ink/50">
        <p className="mb-2">
          Documents are auto-deleted after analysis on free tier (30 days on paid). Not legal advice.
        </p>
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          <a
            href="https://buymeacoffee.com/iammara"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            Support the team
          </a>
          <a
            href="https://buymeacoffee.com/justabdulaziz10"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            Support the developer
          </a>
          <a
            href="https://github.com/mara-org/printer"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            Source on GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
