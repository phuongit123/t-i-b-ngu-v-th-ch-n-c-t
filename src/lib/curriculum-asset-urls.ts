/// <reference types="vite/client" />

/**
 * Resolves bundled download URLs for all files inside curriculum/assets/
 * so Vite serves valid assets across LessonViewer, SlidePlayer, and ResourcesPage.
 */
export const ALL_CURRICULUM_ASSET_URLS = import.meta.glob('../../curriculum/assets/**/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export function resolveCurriculumAssetUrl(filepathOrFilename?: string | null): string | null {
  if (!filepathOrFilename) return null;
  const normalizedTarget = filepathOrFilename.replace(/\\/g, '/').trim();
  const targetBasename = normalizedTarget.split('/').pop();
  if (!targetBasename) return null;

  for (const [globPath, url] of Object.entries(ALL_CURRICULUM_ASSET_URLS)) {
    const normalizedGlob = globPath.replace(/\\/g, '/');
    if (
      normalizedGlob.endsWith(`/${normalizedTarget}`) ||
      normalizedGlob.endsWith(`/${targetBasename}`)
    ) {
      return url;
    }
  }

  return null;
}
