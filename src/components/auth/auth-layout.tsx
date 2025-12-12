import { ReactNode } from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
    children: ReactNode;
    imageSrc?: string;
    title?: string;
    subtitle?: string;
}

export function AuthLayout({ children, imageSrc, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side: Form Content (100% on mobile, 40% on desktop) */}
            <div className="flex w-full flex-col justify-center bg-background px-4 py-12 sm:px-6 lg:w-[40%] lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    {(title || subtitle) && (
                        <div className="mb-8 text-center">
                            {title && <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>}
                            {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
                        </div>
                    )}
                    {children}
                </div>
            </div>

            {/* Right Side: Image/Pattern (Hidden on mobile, 60% on desktop) */}
            <div className="hidden lg:block lg:w-[60%] relative bg-muted">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt="Authentication Background"
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-zinc-900 bg-[size:20px_20px] opacity-20 [mask-image:linear-gradient(to_bottom,white,transparent)]"
                        style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)' }}
                    />
                )}
            </div>
        </div>
    );
}
