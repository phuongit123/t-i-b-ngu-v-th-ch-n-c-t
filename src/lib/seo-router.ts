import type { AffinityTrackId } from '@/types/design-system';
import type { CurriculumLesson } from '@/types/curriculum';
import { getLessonById } from '@/data/curriculum/index';
import { lessonTranslationsVi } from '@/data/curriculum/translationsVi';

export const SITE_ORIGIN = 'https://affinityacademy.vn';

export const TRACK_SLUG_MAP: Record<AffinityTrackId, string> = {
  designer: 'vector-studio',
  photo: 'pixel-studio',
  publisher: 'layout-studio',
  scripting: 'tu-dong-hoa',
};

const SLUG_TO_TRACK: Record<string, AffinityTrackId> = {
  'vector-studio': 'designer',
  'designer': 'designer',
  'pixel-studio': 'photo',
  'photo': 'photo',
  'layout-studio': 'publisher',
  'publisher': 'publisher',
  'tu-dong-hoa': 'scripting',
  'scripting': 'scripting',
};

const ROUTE_TO_PATH: Record<string, string> = {
  home: '/',
  catalog: '/lo-trinh',
  simulator: '/phong-mo-phong',
  sandbox: '/phong-mo-phong',
  challenges: '/thu-thach',
  knowledge: '/tri-thuc',
  search: '/tri-thuc',
  shortcuts: '/tri-thuc/phim-tat',
  cheatsheet: '/tri-thuc/tom-tat',
  glossary: '/tri-thuc/tu-dien-thuat-ngu',
  resources: '/tai-nguyen',
  playground: '/thuc-hanh-tu-dong-hoa',
  encyclopedia: '/bach-khoa-api',
  dashboard: '/ho-so-hoc-tap',
  settings: '/cai-dat',
  capstone: '/do-an-tot-nghiep',
  preview: '/he-thong-thiet-ke',
  'design-system': '/he-thong-thiet-ke',
};

const PATH_TO_ROUTE: Record<string, string> = {
  '': 'home',
  'home': 'home',
  'lo-trinh': 'catalog',
  'catalog': 'catalog',
  'phong-mo-phong': 'simulator',
  'simulator': 'simulator',
  'sandbox': 'simulator',
  'thu-thach': 'challenges',
  'challenges': 'challenges',
  'tri-thuc': 'knowledge',
  'knowledge': 'knowledge',
  'search': 'knowledge',
  'tri-thuc/phim-tat': 'shortcuts',
  'shortcuts': 'shortcuts',
  'tri-thuc/tom-tat': 'cheatsheet',
  'cheatsheet': 'cheatsheet',
  'tri-thuc/tu-dien-thuat-ngu': 'glossary',
  'glossary': 'glossary',
  'tai-nguyen': 'resources',
  'resources': 'resources',
  'thuc-hanh-tu-dong-hoa': 'playground',
  'playground': 'playground',
  'bach-khoa-api': 'encyclopedia',
  'encyclopedia': 'encyclopedia',
  'ho-so-hoc-tap': 'dashboard',
  'dashboard': 'dashboard',
  'cai-dat': 'settings',
  'settings': 'settings',
  'do-an-tot-nghiep': 'capstone',
  'capstone': 'capstone',
  'he-thong-thiet-ke': 'design-system',
  'design-system': 'design-system',
  'preview': 'design-system',
};

export interface ParsedRouteState {
  route: string;
  trackId?: AffinityTrackId;
  moduleId?: string;
  lessonId?: string;
}

/**
 * Converts a Vietnamese heading or lesson title into a clean ASCII URL slug.
 */
export function toVietnameseSlug(text: string): string {
  return text
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

/**
 * Builds the canonical SEO URL path for any lesson, e.g. /bai-hoc/d01-01-cau-truc-giao-dien-...
 */
export function getLessonCanonicalPath(lessonOrId: CurriculumLesson | string): string {
  const lesson = typeof lessonOrId === 'string' ? getLessonById(lessonOrId) : lessonOrId;
  if (!lesson) {
    return `/bai-hoc/${String(lessonOrId).toLowerCase()}`;
  }
  const titleVi = lessonTranslationsVi[lesson.id] || lesson.title;
  const slug = toVietnameseSlug(titleVi);
  const baseId = lesson.id.toLowerCase();
  return slug ? `/bai-hoc/${baseId}-${slug}` : `/bai-hoc/${baseId}`;
}

/**
 * Builds the clean Vietnamese URL path for a given internal route and optional track/lesson context.
 */
export function getRoutePath(
  route: string,
  options?: { trackId?: AffinityTrackId; lesson?: CurriculumLesson | null }
): string {
  if (route === 'lesson' && options?.lesson) {
    return getLessonCanonicalPath(options.lesson);
  }
  if (route === 'catalog' && options?.trackId) {
    const slug = TRACK_SLUG_MAP[options.trackId];
    return slug ? `/lo-trinh/${slug}` : '/lo-trinh';
  }
  return ROUTE_TO_PATH[route] ?? '/';
}

/**
 * Parses either new clean Vietnamese SEO URLs or legacy English paths into unified app state.
 */
export function parseLocationPathname(pathname: string): ParsedRouteState {
  const clean = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!clean) {
    return { route: 'home' };
  }

  // Match /bai-hoc/:id-:slug or /bai-hoc/:id
  if (clean.startsWith('bai-hoc/')) {
    const segment = clean.slice('bai-hoc/'.length);
    const idMatch = segment.match(/^([dpbs]\d{2}-\d{2})(?:-|$)/i);
    if (idMatch) {
      const normalizedId = idMatch[1].toUpperCase();
      const lesson = getLessonById(normalizedId);
      if (lesson) {
        return {
          route: 'lesson',
          lessonId: lesson.id,
          moduleId: lesson.moduleId,
          trackId: lesson.trackId,
        };
      }
    }
    return { route: 'catalog' };
  }

  // Match /lo-trinh/:trackSlug
  if (clean.startsWith('lo-trinh/')) {
    const trackSlug = clean.slice('lo-trinh/'.length);
    const mappedTrack = SLUG_TO_TRACK[trackSlug];
    if (mappedTrack) {
      return { route: 'catalog', trackId: mappedTrack };
    }
    return { route: 'catalog' };
  }

  const direct = PATH_TO_ROUTE[clean];
  if (direct) {
    return { route: direct };
  }

  return { route: 'home' };
}
