"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * A Convex provider component that wraps the given children with a Convex
 * client. This component is used to provide the Convex client to all of
 * the components in the app.
 *
 * @param {Object} props - The props object.
 * @param {ReactNode} props.children - The children of the component.
 *
 * @returns {ReactNode} The wrapped children with the Convex client.
 */
export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}