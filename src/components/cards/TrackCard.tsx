import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AffinityTrackId } from '@/types/design-system';

export interface TrackCardProps {
  id: AffinityTrackId;
  name: string;
  tagline: string;
  description: string;
  moduleCount: number;
  lessonCount: number;
  completedLessonsCount?: number;
  plannedModuleCount?: number;
  plannedLessonCount?: number;
  progressPercentage?: number;
  coverImage?: string;
  onClick: () => void;
  className?: string;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  id, name, tagline, description, moduleCount, lessonCount, completedLessonsCount, progressPercentage, coverImage, onClick, className,
}) => (
  <button type="button" data-testid={`track-card-${id}`} onClick={onClick} className={cn('academy-course-card', className)}>
    {coverImage && <img src={coverImage} alt="" width="600" height="295" loading="lazy" />}
    <div className="academy-course-card-body">
      <p className="course-kicker">{tagline}</p>
      <h3>{name}</h3>
      <p>{description}</p>
      <span>{lessonCount} bài · {moduleCount} học phần <ArrowUpRight size={16} /></span>
      {completedLessonsCount !== undefined && progressPercentage !== undefined && (
        <div className="academy-course-progress">
          <progress value={progressPercentage} max={100} aria-label={`Tiến độ ${name}`} />
          {completedLessonsCount}/{lessonCount} bài đã hoàn thành
        </div>
      )}
    </div>
  </button>
);
