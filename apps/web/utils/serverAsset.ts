const config = () => useRuntimeConfig();

/**
 * Returns the absolute URL for a server asset.
 *
 * @param {string} assetPath - The path to the asset.
 * @return {string} The absolute URL for the asset.
 */
export function serverAsset(assetPath: string): string {
  return `${config().public.apiBase}/${assetPath}`;
}
