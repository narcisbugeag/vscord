export const isFolderExcluded = (patterns: string[], filePath?: string): boolean => {
    if (!patterns?.length || !filePath) return false;
    const normalized = filePath.replace(/\\/g, "/");
    const flags = process.platform === "linux" ? "gm" : "gim";
    return patterns.some((pattern) => {
        const p = pattern.replace(/\\/g, "/");
        return new RegExp(p, flags).test(normalized);
    });
};
