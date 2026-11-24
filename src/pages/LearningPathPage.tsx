import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LessonIllustrationDialog, LessonStepFigure } from '@/components/lesson/LessonStepFigure';
import { getLessonById } from '@/data/curriculum';
import { FOUNDATION_STEPS, LEARNING_PATH_QUERY, LEARNING_STAGES } from '@/data/learning-path';
import { getLessonIllustrations, type LessonLightboxVisual } from '@/data/lesson-illustrations';
import { lessonTranslationsVi } from '@/data/curriculum/translationsVi';
import { useLearningProgress } from '@/lib/learning-store';
import { getLessonCanonicalPath, getRoutePath } from '@/lib/seo-router';

const workshopIllustrations = getLessonIllustrations('starter-poster');

export default function LearningPathPage({ onLaunchLesson }: { onLaunchLesson: (id: string) => void }) {
  const { completedLessonIds } = useLearningProgress();
  const completed = new Set(completedLessonIds);
  const [sampleImproved, setSampleImproved] = useState(true);
  const [zoomedIllustration, setZoomedIllustration] = useState<LessonLightboxVisual | null>(null);
  const [returnStage] = useState(() => window.location.hash.slice(1));
  const nextId = LEARNING_STAGES.flatMap(({ lessons }) => [...lessons]).find((id) => !completed.has(id));
  const hasWatched = LEARNING_STAGES.some(({ lessons }) => lessons.some((id) => completed.has(id)));

  useEffect(() => {
    if (!returnStage) return;
    document.getElementById(returnStage)?.scrollIntoView();
  }, [returnStage]);

  return (
    <div className="learning-path">
      <nav aria-label="Đường dẫn lộ trình" className="course-breadcrumb">
        <a href="/">Trang chủ</a><span aria-hidden="true">/</span><a href="/lo-trinh">Khóa học</a>
      </nav>
      <header className="path-heading">
        <p className="course-kicker">Lộ trình học</p>
        <h1 className="course-title">Học Affinity từ số 0</h1>
        <p>Làm một poster từ trang trắng, học cách chọn công cụ theo việc cần làm, rồi tự giải một đề thiết kế mới. Không cần biết Affinity hay có kinh nghiệm thiết kế để bắt đầu.</p>
        <div className="path-actions">
          <a className="path-primary" href="#bai-dau-tien">Bắt đầu bài thực hành <ArrowDown size={17} aria-hidden="true" /></a>
          {hasWatched && nextId && <Button variant="outline" size="lg" rightIcon={<ArrowRight size={16} />} onClick={() => onLaunchLesson(nextId)}>Tiếp tục bài kế tiếp</Button>}
        </div>
      </header>

      <section id="bai-dau-tien" className="path-foundation" aria-labelledby="first-project-title">
        <div className="path-foundation-intro">
          <div>
            <p className="course-kicker">Bài thực hành đầu tiên</p>
            <h2 id="first-project-title" className="course-title">Dựng poster đổi sách từ trang trắng</h2>
            <p>Người đi ngang cần hiểu sự kiện gì, diễn ra lúc nào và ở đâu. Dùng hình chữ nhật và chữ để làm một ảnh vuông đọc được trên điện thoại.</p>
            <p>Chuẩn bị máy tính có Affinity. <a href="https://www.affinity.studio/get-affinity" target="_blank" rel="noreferrer">Mở trang tải Affinity</a> nếu máy chưa cài.</p>
          </div>

          <figure className="path-sample">
            <div className={`path-poster${sampleImproved ? ' is-improved' : ''}`} aria-label={sampleImproved ? 'Mẫu poster sau khi sửa phân cấp chữ' : 'Mẫu poster có ba dòng chữ cùng cỡ'}>
              <span>Đổi sách<br />cuối tuần</span>
              <span>9 giờ · Thứ Bảy</span>
              <span>Thư viện phường</span>
            </div>
            <figcaption>
              <div className="path-sample-controls" aria-label="So sánh hai cách đặt chữ">
                <button type="button" aria-pressed={!sampleImproved} onClick={() => setSampleImproved(false)}>Bản nháp</button>
                <button type="button" aria-pressed={sampleImproved} onClick={() => setSampleImproved(true)}>Bản đã sửa</button>
              </div>
              <p>{sampleImproved ? 'Tiêu đề lớn, chi tiết nhỏ và chung đường căn trái. Mắt có thứ tự để đọc.' : 'Ba dòng có sức nặng gần bằng nhau. Thử tìm tên sự kiện khi nhìn thoáng qua.'}</p>
            </figcaption>
          </figure>
        </div>

        <ol className="path-steps" aria-label="Các bước dựng poster">
          {FOUNDATION_STEPS.map((step, index) => (
            <li key={step.title}>
              <span className="path-step-number" aria-hidden="true">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.instruction}</p>
              <LessonStepFigure visual={workshopIllustrations[index]} onZoom={setZoomedIllustration} />
              <p className="path-checkpoint"><Check aria-hidden="true" size={18} /><span><strong>Tự kiểm.</strong> {step.checkpoint}</span></p>
            </li>
          ))}
        </ol>
        <div className="path-first-next">
          <p>Thử lại với poster tuyển tình nguyện viên. Lần này, cho người xem thấy hạn đăng ký trước địa điểm. Giữ cả hai bản để so sánh.</p>
          <Button rightIcon={<ArrowRight size={16} />} onClick={() => onLaunchLesson('D01-01')}>Mở bài làm quen Affinity</Button>
        </div>
        <p className="path-sources">Đối chiếu thao tác với <a href="https://www.affinity.studio/blog/affinity-essentials-lesson-1-welcome-to-affinity" target="_blank" rel="noreferrer">Affinity Essentials</a> và <a href="https://www.affinity.studio/help/sharing-export-settings/" target="_blank" rel="noreferrer">trợ giúp xuất tệp</a>.</p>
      </section>

      <section className="path-stages" aria-labelledby="path-stages-title">
        <h2 id="path-stages-title" className="course-title">Học theo từng chặng</h2>
        <p>Mở từng chặng để xem bài theo thứ tự. Làm đề tự luyện và dùng mục tự kiểm để biết khi nào nên chuyển chặng.</p>
        {LEARNING_STAGES.map((stage, index) => {
          const lessonsSeen = stage.lessons.filter((id) => completed.has(id)).length;
          return (
            <details className="path-stage" key={stage.id} id={stage.id} open={returnStage ? stage.id === returnStage : index === 0}>
              <summary>
                <span className="path-stage-number">{String(index + 1).padStart(2, '0')}</span>
                <span><strong>{stage.title}</strong><small>{stage.tool}</small></span>
                <span className="path-stage-status">{lessonsSeen}/{stage.lessons.length} bài đã đánh dấu</span>
              </summary>
              <div className="path-stage-body">
                <div>
                  <h3>Bài học theo thứ tự</h3>
                  <ol className="path-lessons">
                    {stage.lessons.map((id) => {
                      const lesson = getLessonById(id);
                      if (!lesson) return null;
                      return <li key={id}><a href={getLessonCanonicalPath(lesson) + LEARNING_PATH_QUERY} onClick={(event) => {
                        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                        event.preventDefault();
                        onLaunchLesson(id);
                      }}><span>{lessonTranslationsVi[id] ?? lesson.title}</span><small>{completed.has(id) ? 'Đã xem' : `${lesson.durationMinutes} phút`}</small></a></li>;
                    })}
                  </ol>
                  <a className="path-catalog-link" href={getRoutePath('catalog', { trackId: stage.track })}>Xem các học phần cùng Studio <ArrowRight size={15} aria-hidden="true" /></a>
                </div>
                <div className="path-assignment">
                  <h3>Quyết định thiết kế</h3><p>{stage.judgement}</p>
                  <h3>Bài tự làm</h3><p>{stage.task}</p>
                  <h3>Sản phẩm cần có</h3><p>{stage.evidence}</p>
                  <h3>Tự kiểm trước khi học tiếp</h3><p>{stage.pass}</p>
                </div>
              </div>
            </details>
          );
        })}
      </section>

      <section className="path-capstone" aria-labelledby="path-capstone-title">
        <div>
          <p className="course-kicker">Chặng cuối</p>
          <h2 id="path-capstone-title" className="course-title">Tự giải một đề thiết kế</h2>
          <p>Đọc brief, xác định người xem và đầu ra. Phác hai hướng, tự chọn Studio, dựng bản đầu rồi sửa dựa trên phản hồi có căn cứ. Nộp tệp có thể chỉnh sửa, tệp xuất và ghi chú giải thích quyết định quan trọng.</p>
          <p>Việc đánh dấu đã xem giúp theo dõi bài. Dùng sản phẩm, khả năng giải thích và tiêu chí chấm đồ án để đánh giá năng lực.</p>
        </div>
        <a className="path-primary" href={getRoutePath('capstone')}>Mở đề và tiêu chí chấm <ArrowRight size={16} aria-hidden="true" /></a>
      </section>
      {zoomedIllustration && <LessonIllustrationDialog visual={zoomedIllustration} onClose={() => setZoomedIllustration(null)} />}
    </div>
  );
}
