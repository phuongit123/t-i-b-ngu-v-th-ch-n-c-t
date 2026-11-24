import React from 'react';
import { ArrowRight, Check, ChevronDown, X } from 'lucide-react';
import type { CurriculumLesson, CurriculumModule } from '@/types/curriculum';
import { useLearningProgress } from '@/lib/learning-store';
import { lessonTranslationsVi } from '@/data/curriculum/translationsVi';
import { getLessonCanonicalPath } from '@/lib/seo-router';

const SECTIONS = [
  'Mục tiêu bài học', 'Chuẩn bị', 'Công cụ và phím tắt', 'Làm từng bước',
  'Hình minh họa', 'Thực hành có hướng dẫn', 'Thử thách tự làm',
  'Lỗi thường gặp', 'Kiểm tra kiến thức', 'Tổng kết và tài liệu',
];

export interface OutlineSidebarProps {
  lesson: CurriculumLesson;
  module?: CurriculumModule;
  viewMode: 'slides' | 'sections';
  activeSectionIndex: number | null;
  onSelectLesson: (lessonId: string) => void;
  onSelectSection: (sectionNumber: number) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const OutlineSidebar: React.FC<OutlineSidebarProps> = ({
  lesson, module, viewMode, activeSectionIndex, onSelectLesson, onSelectSection, isOpen, onToggleOpen,
}) => {
  const { completedLessonIds } = useLearningProgress();
  if (!isOpen) return null;

  return (
    <aside id="course-outline" className="course-outline" data-testid="outline-sidebar" aria-label="Mục lục học phần và bài học">
      <div className="course-outline-heading">
        <h2>Trong học phần này</h2>
        <button className="academy-icon" type="button" onClick={onToggleOpen} aria-label="Thu gọn thanh mục lục"><X size={17} /></button>
      </div>
      <div className="course-outline-lessons">{(module?.lessons ?? [lesson]).map((item) => {
        const completed = completedLessonIds.includes(item.id);
        return (
          <a key={item.id} href={getLessonCanonicalPath(item)} className="course-outline-lesson"
            aria-label={completed ? `${lessonTranslationsVi[item.id] ?? item.title}, ${item.durationMinutes} phút, đã đánh dấu` : undefined}
            data-testid={`outline-lesson-${item.id}`} aria-current={lesson.id === item.id ? 'page' : undefined}
            onClick={(event) => {
              if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              if (lesson.id !== item.id) onSelectLesson(item.id);
            }}>
            <span>{lessonTranslationsVi[item.id] ?? item.title}</span>
            <small>{item.durationMinutes} phút</small>
            {completed ? <Check size={15} aria-hidden="true" /> : <ArrowRight size={15} aria-hidden="true" />}
          </a>
        );
      })}</div>
      <details className="course-section-index">
        <summary>Mục lục bài <ChevronDown size={16} aria-hidden="true" /></summary>
        <nav aria-label="Mười phần bài học">
          {SECTIONS.map((label, index) => (
            <button key={label} type="button" data-testid={`outline-section-${index + 1}`}
              aria-current={viewMode === 'sections' && activeSectionIndex === index + 1 ? 'location' : undefined}
              onClick={() => onSelectSection(index + 1)}>{label}</button>
          ))}
        </nav>
      </details>
    </aside>
  );
};

export default OutlineSidebar;
