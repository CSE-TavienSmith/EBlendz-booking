const links = [
    { label: "The Cutz", href: "#cutz" },
    { label: "Work", href: "#work" },
    { label: "Menu", href: "#menu" },
];

export function Nav() {
    return (
        <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                <a href="#top" className="font-display text-2xl uppercase">
                    Eblendz
                </a>

                <div className="flex items-center gap-5">
                    {links.map((link) => (

                        <a
                            key={link.href}
                            href={link.href}
                            className="hidden text-sm text-muted transition hover:text-bone sm:block"
                        >
                            {link.label}
                        </a>
                    ))}

                    <a
                        href="#book"
                        className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink transition hover:bg-gold-soft"
                    >
                        Book
                    </a>
                </div>
            </nav>
        </header>
    );
}