import { ReactNode } from "react";

type FlowLayoutProps = {
    children: ReactNode;
};

export function FlowLayout({
    children,
}: FlowLayoutProps) {
    return (
        <section className="relative">
            <div
                className="
                    mx-auto
                    grid
                    max-w-7xl
                    grid-cols-[120px_1fr]
                    gap-8
                    px-8
                "
            >
                {/* Stream column */}
                <div />

                {/* Content */}
                <div>
                    {children}
                </div>
            </div>
        </section>
    );
}