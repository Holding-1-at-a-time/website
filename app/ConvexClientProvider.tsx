// app/ConvexClientProvider.tsx

"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useState } from "react";

/**
 * A wrapper around the ConvexProvider component from the convex-react library.
 * Provides a pre-configured ConvexReactClient instance to its children.
 * @param {Object} props - The props object.
 * @param {ReactNode} props.children - The children of the component.
 * @returns {ReactElement} - A ConvexProvider component with the pre-configured ConvexReactClient instance.
 */
export function ConvexClientProvider({ children }: { children: ReactNode }) {
    const [convex] = useState(() => new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!));
    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
