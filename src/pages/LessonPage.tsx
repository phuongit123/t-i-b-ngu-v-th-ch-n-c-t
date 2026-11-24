import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Download, Layers } from 'lucide-react';
import type { CurriculumLesson, CurriculumModule } from '@/types/curriculum';
import { OutlineSidebar } from '@/components/lesson/OutlineSidebar';
import { SlidePlayer } from '@/components/lesson/SlidePlayer';
import { Button } from '@/components/ui/Button';
import { resolveCurriculumAssetUrl } from '@/lib/curriculum-asset-urls';
import { getLessonCanonicalPath, getRoutePath } from '@/lib/seo-router';
import { lessonTranslationsVi, moduleTranslationsVi } from '@/data/curriculum/translationsVi';
import { LEARNING_PATH_QUERY, LEARNING_STAGES } from '@/data/learning-path';
import { getReaderGroup, LESSON_READER_GROUPS, type LessonReaderGroup } from '@/lib/lesson-reader';
import { markLessonCompleted, useLearningProgress } from '@/lib/learning-store';
import { useAuth } from '@/lib/supabase/auth-context';

export interface LessonPageProps {
  lesson: CurriculumLesson;
  module?: CurriculumModule;
  allLessons: CurriculumLesson[];
  onSelectLesson: (lessonId: string) => void;
  onBackToCatalog: () => void;
  onNavigate: (route: string) => void;
  inLearningPath?: boolean;
  onLessonComplete?: (lessonId: string) => void;
}

const TRACK_NAMES = { designer: 'Vector Studio', photo: 'Pixel Studio', publisher: 'Layout Studio', scripting: 'Tự động hóa' };
const DIFFICULTY = { Beginner: 'Cơ bản', Intermediate: 'Trung cấp', Advanced: 'Nâng cao' };
const WORKSPACE_IMAGES: Record<string, { name: string; studio: string }> = {
  'D01-01': { name: 'vector', studio: 'Vector Studio' },
  'D02-01': { name: 'pen', studio: 'Pen Tool trong Vector Studio' },
  'P01-01': { name: 'pixel', studio: 'Pixel Studio' },
  'B01-02': { name: 'layout', studio: 'Bảng Pages trong Layout Studio' },
};

export function LessonPage({ lesson, module, allLessons, onSelectLesson, onBackToCatalog, onNavigate, onLessonComplete, inLearningPath }: LessonPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(() => !window.matchMedia('(max-width: 700px)').matches);
  const [viewMode, setViewMode] = useState<'slides' | 'sections'>('sections');
  const [group, setGroup] = useState<LessonReaderGroup>('overview');
  const [targetSection, setTargetSection] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const requests = useRef(false);
  const { user } = useAuth();
  const { progressMap } = useLearningProgress();
  const saved = progressMap[lesson.id];
  const completed = saved?.status === 'completed';
  const pathStage = inLearningPath ? LEARNING_STAGES.find((stage) => stage.lessons.some((id) => id === lesson.id)) : undefined;
  const sequence = pathStage ? pathStage.lessons.map((id) => allLessons.find((item) => item.id === id)) : allLessons;
  const currentIndex = sequence.findIndex((item) => item?.id === lesson.id);
  const previous = sequence[currentIndex - 1];
  const next = sequence[currentIndex + 1];
  const lessonLink = (item: CurriculumLesson) => getLessonCanonicalPath(item) + (pathStage ? LEARNING_PATH_QUERY : '');
  const moduleTitle = moduleTranslationsVi[lesson.moduleId]?.title ?? module?.title ?? lesson.moduleId;
  const trackName = TRACK_NAMES[lesson.trackId];
  const title = lessonTranslationsVi[lesson.id] ?? lesson.title;
  const workspace = WORKSPACE_IMAGES[lesson.id];
  const showWorkspace = viewMode === 'sections' && Boolean(workspace);
  const starter = lesson.standardSections.guidedPractice.starterAsset
    ?? lesson.standardSections.independentChallenge.starterAsset ?? lesson.practiceAsset ?? module?.starterAsset;
  const download = starter && (resolveCurriculumAssetUrl(starter.filepath) ?? resolveCurriculumAssetUrl(starter.filename));
  const practice = lesson.trackId === 'scripting' ? 'playground' : 'simulator';

  function showMode(mode: 'slides' | 'sections') {
    setViewMode(mode);
    setTargetSection(null);
    if (mode === 'sections') setGroup('all');
  }

  function selectGroup(id: LessonReaderGroup) {
    setViewMode('sections');
    setGroup(id);
    setTargetSection(null);
  }

  function selectSection(section: number) {
    selectGroup(getReaderGroup(section));
    setTargetSection(section);
  }

  async function markViewed() {
    if (completed || requests.current) return;
    requests.current = true;
    setSaveStatus('saving');
    try {
      await markLessonCompleted(user?.id ?? null, lesson.id, saved?.lastSlideIndex ?? 0);
      setSaveStatus('idle');
      onLessonComplete?.(lesson.id);
    } catch {
      setSaveStatus('error');
    } finally {
      requests.current = false;
    }
  }

  return (
    <article className="course-lesson">
      <nav aria-label="Đường dẫn bài học" className="course-breadcrumb">
        <a href="/" onClick={(event) => { event.preventDefault(); onNavigate('home'); }}>Trang chủ</a>
        <span aria-hidden="true">/</span>
        <a href={getRoutePath('catalog', { trackId: lesson.trackId })} onClick={(event) => { event.preventDefault(); onBackToCatalog(); }}>{trackName}</a>
        <span aria-hidden="true">/</span>
        <span>{moduleTitle}</span>
      </nav>
      <header className="course-lesson-heading">
        <div>
          <p className="course-kicker">{trackName} · {lesson.durationMinutes} phút · {DIFFICULTY[lesson.difficulty] ?? lesson.difficulty}</p>
          <h1 className="course-title">{title}</h1>
        </div>
        <Button variant="outline" size="md" data-testid="mark-lesson-viewed" disabled={completed || saveStatus === 'saving'} onClick={() => void markViewed()} leftIcon={completed ? <Check size={16} /> : undefined}>
          {completed ? 'Đã đánh dấu' : saveStatus === 'saving' ? 'Đang lưu…' : 'Đánh dấu đã xem'}
        </Button>
      </header>
      {saveStatus === 'error' && <p className="course-notice" role="alert">Không lưu được tiến độ. Thử lại khi trình duyệt cho phép lưu dữ liệu.</p>}
      {(showWorkspace || sidebarOpen) && (
        <div className={showWorkspace && sidebarOpen ? 'course-lesson-intro has-evidence' : 'course-lesson-intro'}>
          {showWorkspace && workspace && <figure className="course-evidence"><img src={`/assets/lessons/affinity-333-${workspace.name}.webp`} alt={workspace.studio} width="1280" height="745" /><figcaption>Affinity 3.3.3.5004 trên Windows · {workspace.studio}</figcaption></figure>}
          <OutlineSidebar lesson={lesson} module={module} viewMode={viewMode} activeSectionIndex={targetSection} onSelectLesson={onSelectLesson} onSelectSection={selectSection} isOpen={sidebarOpen} onToggleOpen={() => setSidebarOpen(false)} />
        </div>
      )}
      <div className="course-lesson-body">
          {viewMode === 'sections' && !showWorkspace && <p className="course-notice">Bài đang được rà lại theo Affinity hiện hành. Đối chiếu tên menu, phím tắt và ví dụ trong ứng dụng khi làm theo.</p>}
          <div className="course-lesson-tabs" role="tablist" aria-label="Nội dung bài học" onKeyDown={(event) => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            const buttons = Array.from(event.currentTarget.querySelectorAll('button'));
            const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
            if (index < 0) return;
            event.preventDefault();
            const delta = event.key === 'ArrowLeft' ? -1 : 1;
            const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1
              : (index + delta + buttons.length) % buttons.length;
            selectGroup(LESSON_READER_GROUPS[nextIndex].id);
            buttons[nextIndex].focus();
          }}>
            {LESSON_READER_GROUPS.map(({ id, label }) => (
              <button key={id} type="button" role="tab" aria-selected={viewMode === 'sections' && group === id}
                tabIndex={group === id || ((viewMode === 'slides' || group === 'all') && id === 'overview') ? 0 : -1} aria-controls="lesson-reading-panel" id={`lesson-tab-${id}`} onClick={() => selectGroup(id)}>{label}</button>
            ))}
          </div>
          <div className="course-lesson-tools">
            {viewMode === 'slides' || group !== 'all' ? <button type="button" data-testid="lesson-mode-sections" onClick={() => showMode('sections')}>Đọc toàn bài</button> : null}
            {viewMode !== 'slides' && <button type="button" data-testid="lesson-mode-slides" onClick={() => showMode('slides')}>Trình chiếu</button>}
            <button type="button" data-testid="toggle-outline-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-expanded={sidebarOpen} aria-controls="course-outline">{sidebarOpen ? 'Ẩn mục lục' : 'Mở mục lục'}</button>
          </div>
          <div id="lesson-reading-panel" data-reading-group={viewMode === 'sections' ? group : undefined} role={viewMode === 'sections' && group !== 'all' ? 'tabpanel' : undefined} aria-labelledby={viewMode === 'sections' && group !== 'all' ? `lesson-tab-${group}` : undefined}>
            <SlidePlayer lesson={lesson} viewMode={viewMode} onViewModeChange={showMode} activeSectionIndex={targetSection} readerGroup={group} embedded onSelectLesson={onSelectLesson} onNavigate={onNavigate} onLessonComplete={onLessonComplete} />
          </div>
          <nav aria-label="Liên kết bài học và học liệu liên quan" data-testid="lesson-seo-silo-bar" className="course-lesson-footer">
            {download && <a href={download} download={starter.filename} data-testid="lesson-starter-download"><Download size={16} /> {starter.assetStatus === 'CAMERA_RAW' ? 'Tải ảnh RAW để thực hành' : 'Tải học liệu'}</a>}
            <a href={getRoutePath(practice)} onClick={(event) => { event.preventDefault(); onNavigate(practice); }}><Layers size={16} /> {practice === 'playground' ? 'Thực hành DOM' : 'Bộ mô phỏng'}</a>
            <a href={getRoutePath('catalog', { trackId: lesson.trackId })} onClick={(event) => { event.preventDefault(); onBackToCatalog(); }}>Lộ trình {trackName}</a>
            <a href={getRoutePath('glossary')} onClick={(event) => { event.preventDefault(); onNavigate('glossary'); }}>Từ điển thuật ngữ</a>
            <a href={getRoutePath('resources')} onClick={(event) => { event.preventDefault(); onNavigate('resources'); }}>Thư viện học liệu</a>
            <div className="course-lesson-sequence">
              {previous && <a data-testid="prev-lesson-btn" href={lessonLink(previous)} onClick={(event) => { event.preventDefault(); onSelectLesson(previous.id); }}><ArrowLeft size={16} /> Bài trước</a>}
              {next && <a data-testid="next-lesson-btn" href={lessonLink(next)} onClick={(event) => { event.preventDefault(); onSelectLesson(next.id); }}>Bài tiếp: {lessonTranslationsVi[next.id] ?? next.title} <ArrowRight size={16} /></a>}
              {pathStage && <a href={`${getRoutePath('journey')}#${pathStage.id}`}>{next ? `Về chặng ${pathStage.title}` : `Làm bài tự làm của chặng ${pathStage.title}`} <ArrowRight size={16} /></a>}
            </div>
          </nav>
      </div>
    </article>
  );
}

export default LessonPage;
