import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TrackCard } from '@/components/cards/TrackCard';
import { ALL_PILOT_MODULES } from '@/data/curriculum';
import type { AffinityTrackId } from '@/types/design-system';

export interface HomePageProps {
  onNavigate: (route: string) => void;
  onSelectTrack: (trackId: AffinityTrackId) => void;
  onLaunchLesson: (lessonId: string) => void;
}

const courses = [
  { id: 'designer', studio: 'Vector Studio', title: 'Thiết kế vector', image: 'tra-mat', description: 'Vẽ logo, biểu tượng và minh họa cho màn hình lẫn bản in.' },
  { id: 'photo', studio: 'Pixel Studio', title: 'Chỉnh sửa ảnh', image: 'retouch', description: 'Tạo vùng chọn, dùng mặt nạ và cân màu trên từng lớp.' },
  { id: 'publisher', studio: 'Layout Studio', title: 'Dàn trang ấn phẩm', image: 'editorial', description: 'Dàn trang với trang mẫu, khung chữ và lưới bố cục.' },
] as const;

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectTrack, onLaunchLesson }) => (
  <div className="academy-width">
    <section className="academy-hero">
      <div>
        <p className="course-kicker">Học Affinity qua dự án</p>
        <h1 className="course-title">Học thiết kế.<br /><em>Làm ngay trong Affinity.</em></h1>
        <p>Làm poster đầu tiên từ trang trắng, rồi học thiết kế vector, chỉnh ảnh và dàn trang qua từng sản phẩm thực hành.</p>
        <div className="course-actions">
          <Button size="lg" onClick={() => onNavigate('journey')} rightIcon={<ArrowRight size={16} />}>Bắt đầu từ số 0</Button>
          <Button variant="outline" size="lg" onClick={() => onLaunchLesson('D01-01')}>Mở bài đầu tiên</Button>
        </div>
      </div>
      <figure>
        <img src="/assets/academy/tra-mat.webp" alt="Poster Trà Mát với hình lá dựng bằng đường cong vector" width="840" height="620" fetchPriority="high" />
        <figcaption><span>Poster thực hành · Trà Mát</span><span>Vector Studio</span></figcaption>
      </figure>
    </section>

    <section className="academy-course-list" aria-labelledby="home-courses">
      <div className="course-section-heading">
        <div><h2 id="home-courses" className="course-title">Chọn khóa học</h2><p>Học theo Studio khi đã biết mình cần luyện gì.</p></div>
        <button type="button" onClick={() => onNavigate('catalog')}>Xem tất cả học phần <ArrowRight size={16} /></button>
      </div>
      <div className="academy-course-grid">
        {courses.map((course) => {
          const modules = ALL_PILOT_MODULES.filter((item) => item.trackId === course.id);
          const lessonCount = modules.reduce((sum, item) => sum + item.lessons.length, 0);
          return (
            <TrackCard key={course.id} id={course.id} name={course.title} tagline={course.studio}
              description={course.description} coverImage={`/assets/academy/${course.image}.webp`}
              moduleCount={modules.length} lessonCount={lessonCount} onClick={() => onSelectTrack(course.id)} />
          );
        })}
      </div>
    </section>
    <section className="academy-automation">
      <div><h2>Tự động hóa trong Affinity</h2><p>Thử JavaScript DOM sau khi đã quen các công cụ thiết kế.</p></div>
      <Button variant="outline" size="lg" onClick={() => onSelectTrack('scripting')}>Xem khóa tự động hóa</Button>
    </section>
  </div>
);

export default HomePage;
