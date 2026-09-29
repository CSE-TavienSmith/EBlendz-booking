import { siteConfig } from "@/lib/siteConfig";

export function Footer() {
    return (
        <footer className="border-t border-line">
            <div className="stripe h-2 w-full" aria-hidden="true" />
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6">
                <div>
                    <p className="font-display text-4xl uppercase">{siteConfig.name}</p>
                    <p className="mt-2 font-serif text-xl italic text-muted">Sharp cutz. Clean fades. All around the city.</p>
                </div>
                <div className="space-y-2 font-mono text-sm text-muted">
                    <p>{siteConfig.city}</p>
                    <p>{siteConfig.hours}</p>
                </div>
                <div className="space-y-2 font-mono text-sm">
                    <a className="block hover:text-gold" href={`sms:${siteConfig.phone}`}>
                        Text {siteConfig.phone}
                    </a>
                    <a
                        className="block hover:text-gold"
                        href={`https://instagram.com/${siteConfig.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        @{siteConfig.instagram}
                    </a>
                </div>
            </div>
            <p className="pb-8 text-center font-mono text-xs text-muted">
                © {new Date().getFullYear()} {siteConfig.name}
            </p>
        </footer>
    );
}