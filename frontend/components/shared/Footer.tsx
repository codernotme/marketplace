export const Footer = () => {
    return (
        <footer className="w-full py-6 border-t border-[--c-border] text-center text-[--c-muted] text-sm">
            © {new Date().getFullYear()} Marketplace. All rights reserved.
        </footer>
    );
};
