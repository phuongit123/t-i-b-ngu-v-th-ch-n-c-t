export const LESSON_READER_GROUPS = [
  { id: 'overview', label: 'Tổng quan', sections: [1, 2] },
  { id: 'steps', label: 'Theo từng bước', sections: [3, 4, 5, 8] },
  { id: 'practice', label: 'Bài tập', sections: [6, 7, 9] },
  { id: 'resources', label: 'Tài liệu', sections: [10] },
] as const;

export type LessonReaderGroup = (typeof LESSON_READER_GROUPS)[number]['id'] | 'all';

export function getReaderGroup(section: number): LessonReaderGroup {
  return LESSON_READER_GROUPS.find((group) => group.sections.some((item) => item === section))?.id ?? 'all';
}

export function isSectionVisible(group: LessonReaderGroup, section: number): boolean {
  return group === 'all' || getReaderGroup(section) === group;
}
