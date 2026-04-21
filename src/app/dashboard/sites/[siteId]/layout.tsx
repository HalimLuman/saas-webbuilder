"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSiteStore } from "@/store/site-store";
import { useWorkspaceFetch } from "@/hooks/use-workspace-fetch";
import { Button } from "@/components/ui/button";

export default function SiteDashboardLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const siteId = params.siteId as string;
    const site = useSiteStore((s) => s.getSiteById(siteId));
    const wfetch = useWorkspaceFetch();
    const [loading, setLoading] = useState(!site);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!siteId) { setLoading(false); return; }

        wfetch(`/api/v1/sites/${siteId}`)
            .then((res) => res.json())
            .then((json) => {
                if (json.data) {
                    const data = json.data;
                    const updates = {
                        name: data.name,
                        description: data.description || "",
                        domain: data.domain || "",
                        customDomain: data.custom_domain || "",
                        status: data.status || "draft",
                        pages: data.pages || [],
                    };
                    if (!useSiteStore.getState().getSiteById(siteId)) {
                        useSiteStore.getState().addSite({ id: data.id, ...updates });
                    } else {
                        useSiteStore.getState().updateSite(data.id, updates);
                    }
                } else if (!useSiteStore.getState().getSiteById(siteId)) {
                    // API returned no data and site is not in local store
                    setNotFound(true);
                }
                setLoading(false);
            })
            .catch(() => {
                if (!useSiteStore.getState().getSiteById(siteId)) {
                    setNotFound(true);
                }
                setLoading(false);
            });
    }, [siteId, wfetch]);

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-6 w-6 border-2 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Loading site details...</p>
                </div>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Site not found</h2>
                    <p className="text-sm text-gray-500 mb-4">This site may have been deleted or you may not have access.</p>
                    <Button asChild>
                        <Link href="/dashboard/sites">Go to Sites</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
