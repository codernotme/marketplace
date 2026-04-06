export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            {children}
        </div>
    );
};
