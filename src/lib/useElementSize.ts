import { useLayoutEffect, useRef, useState } from 'react';

type ElementSize = {
    width: number;
    height: number;
};

export function useElementSize<T extends HTMLElement>() {
    const ref = useRef<T | null>(null);
    const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

    useLayoutEffect(() => {
        const element = ref.current;
        if (!element) return;

        const updateSize = () => {
            const rect = element.getBoundingClientRect();
            setSize({
                width: Math.max(1, Math.round(rect.width)),
                height: Math.max(1, Math.round(rect.height)),
            });
        };

        const frame = requestAnimationFrame(updateSize);
        const observer = new ResizeObserver(updateSize);
        observer.observe(element);

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
        };
    }, []);

    return [ref, size] as const;
}
