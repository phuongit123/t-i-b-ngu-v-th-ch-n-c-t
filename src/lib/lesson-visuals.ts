export function isBundledLessonImage(value: string): boolean {
  return /^\/assets\/lessons\/(?:steps\/)?[a-z0-9][a-z0-9-]*\.(?:svg|webp|png)$/i.test(value);
}

export function getLessonStepImagePath(lessonId: string, step: number, stacked = false): string {
  const index = String(step).padStart(2, '0');
  return `/assets/lessons/steps/${lessonId.toLowerCase()}-${index}${stacked ? '-stacked' : ''}.webp`;
}
