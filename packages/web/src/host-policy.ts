/** Localhost-only bind policy for principal Web surface. */
export function assertLocalhostHost(host: string): void {
  if (host !== "127.0.0.1" && host !== "localhost" && host !== "::1") {
    throw new Error(
      `QINGFU_WEB_HOST must be localhost-only (got ${host})`,
    );
  }
}
