const normalizeVersion = (version: string) => version.trim();

const splitVersionString = (value: string): string[] => {
  const trimmed = value.trim();
  if (!trimmed) return [];

  // Support JSON array string format, e.g. ["1.3.0", "1.3.1"].
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map(item => String(item ?? '').trim())
          .filter(Boolean);
      }
    } catch (_error) {
      // Fall back to delimiter-based parsing below.
    }
  }

  return trimmed
    .split(/[\s,;|]+/)
    .map(version => version.trim())
    .filter(Boolean);
};

export const parseAllowedVersions = (rawVersion: unknown): string[] => {
  if (Array.isArray(rawVersion)) {
    return rawVersion
      .flatMap(item => splitVersionString(String(item ?? '')))
      .filter(Boolean);
  }

  if (rawVersion == null) return [];

  return splitVersionString(String(rawVersion));
};

export const isVersionAllowed = (currentVersion: string | null, rawVersion: unknown): boolean => {
  if (!currentVersion) return false;

  const normalizedCurrentVersion = normalizeVersion(currentVersion);
  const allowedVersions = parseAllowedVersions(rawVersion).map(normalizeVersion);

  if (!allowedVersions.length) return false;

  return allowedVersions.includes(normalizedCurrentVersion);
};