import path from "node:path";

/**
 * Whether a configured database URL points at a hosted Turso database rather
 * than a local SQLite file. Turso databases are addressed as `libsql://...`
 * (or the `https://` alias); anything else - a bare path or a `file:` URL -
 * is a local file opened directly by the libSQL client.
 */
export const isRemoteDatabaseUrl = (url: string): boolean =>
  /^(?:libsql|https?):\/\//iu.test(url);

/**
 * Absolute path of the local SQLite file backing `DATABASE_URL` in development.
 */
export const resolveDatabasePath = (configuredUrl: string): string => {
  if (isRemoteDatabaseUrl(configuredUrl)) {
    throw new Error(
      `resolveDatabasePath() cannot resolve a filesystem path for a remote Turso database (URL=${configuredUrl}).`
    );
  }
  const configuredPath = configuredUrl.replace(/^file:/u, "");
  if (path.isAbsolute(configuredPath)) {
    return configuredPath;
  }
  const moduleDir = import.meta.dirname;
  return path.join(
    moduleDir,
    "../../../",
    configuredPath.replace(/^(?:[.][.][\\/])+/u, "")
  );
};

/**
 * The URL the libSQL client should connect with: the configured value
 * unchanged for a remote Turso database, or an absolute `file:` URL for
 * local development.
 */
export const resolveDatabaseUrl = (configuredUrl: string): string =>
  isRemoteDatabaseUrl(configuredUrl)
    ? configuredUrl
    : `file:${resolveDatabasePath(configuredUrl)}`;
