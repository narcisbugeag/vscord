import type gitUrlParse from "git-url-parse";

export type RepoAccessibilityStatus = "public" | "hidden" | "unknown";

const PUBLIC_HIDDEN_TTL_MS = 10 * 60 * 1000;
const UNKNOWN_TTL_MS = 60 * 1000;

const cache = new Map<string, { status: RepoAccessibilityStatus; checkedAt: number }>();
const inflight = new Map<string, Promise<RepoAccessibilityStatus>>();

function normalizeRemoteUrl(remoteUrl?: gitUrlParse.GitUrl): string | undefined {
    const url = remoteUrl?.toString("https").replace(/\.git$/, "");
    if (!url) return undefined;

    return url;
}

async function probeOnce(url: string, method: "HEAD" | "GET"): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    try {
        return await fetch(url, {
            method,
            redirect: "follow",
            signal: controller.signal
        });
    } finally {
        clearTimeout(timeout);
    }
}

async function probeRepoAccessibility(url: string): Promise<RepoAccessibilityStatus> {
    try {
        const headResponse = await probeOnce(url, "HEAD");

        if (headResponse.ok) return "public";
        if (headResponse.status === 403 || headResponse.status === 404) return "hidden";
        if (headResponse.status === 405) {
            const getResponse = await probeOnce(url, "GET");
            if (getResponse.ok) return "public";
            if (getResponse.status === 403 || getResponse.status === 404) return "hidden";
            return "unknown";
        }

        return "unknown";
    } catch {
        return "unknown";
    }
}

export async function getRepoAccessibility(
    repoKey?: string,
    remoteUrl?: gitUrlParse.GitUrl
): Promise<RepoAccessibilityStatus> {
    const normalizedUrl = normalizeRemoteUrl(remoteUrl);
    const key = repoKey ?? normalizedUrl;

    if (!key || !normalizedUrl) return "unknown";

    const cached = cache.get(key);
    if (cached) {
        const ttl = cached.status === "unknown" ? UNKNOWN_TTL_MS : PUBLIC_HIDDEN_TTL_MS;
        if (Date.now() - cached.checkedAt < ttl) return cached.status;
    }

    const pending = inflight.get(key);
    if (pending) return pending;

    const request = probeRepoAccessibility(normalizedUrl).then((status) => {
        cache.set(key, { status, checkedAt: Date.now() });
        inflight.delete(key);
        return status;
    });

    inflight.set(key, request);
    return request;
}
