import { useEffect, useRef } from 'react';
import { X, ZoomIn } from 'lucide-react';
import type { LessonLightboxVisual, LessonStepVisual } from '@/data/lesson-illustrations';

export function LessonStepImage({ visual, lazy = false }: { visual: LessonLightboxVisual; lazy?: boolean }) {
  return (
    <picture>
      {visual.mobileSrc && <source media="(max-width: 640px)" srcSet={visual.mobileSrc} width={460} height={588} />}
      <img src={visual.src} alt={visual.alt} width={944} height={292} loading={lazy ? 'lazy' : undefined} decoding="async" />
    </picture>
  );
}

export function LessonStepFigure({ visual, onZoom, showStep }: {
  visual: LessonStepVisual;
  onZoom?: (visual: LessonLightboxVisual) => void;
  showStep?: boolean;
}) {
  return (
    <figure className="lesson-step-figure" data-testid="lesson-step-figure" data-step={visual.step}>
      <figcaption className="lesson-step-tool">{showStep && `Bước ${visual.step} · `}{visual.tool}</figcaption>
      {onZoom ? (
        <button type="button" className="lesson-step-zoom" data-testid="open-visual-lightbox"
          aria-label={`Phóng to hình bước ${visual.step}, ${visual.tool}`} onClick={() => onZoom(visual)}>
          <LessonStepImage visual={visual} lazy />
          <span className="lesson-zoom-icon"><ZoomIn size={17} aria-hidden="true" /></span>
        </button>
      ) : <LessonStepImage visual={visual} lazy />}
      <p className="lesson-step-check"><strong>Quan sát.</strong> {visual.caption}</p>
    </figure>
  );
}

export function LessonIllustrationDialog({ visual, onClose }: { visual: LessonLightboxVisual; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog ref={dialogRef} className="lesson-visual-dialog" data-testid="lesson-visual-lightbox"
      aria-label="Xem ảnh minh họa phóng to" onClose={onClose}
      onClick={(event) => { if (event.currentTarget === event.target) event.currentTarget.close(); }}>
      <div className="lesson-visual-dialog-content">
        <header>
          <p>{visual.alt}</p>
          <button type="button" aria-label="Đóng khung xem phóng to" onClick={() => dialogRef.current?.close()}><X size={20} aria-hidden="true" /></button>
        </header>
        <LessonStepImage visual={visual} />
        {visual.caption && <p className="lesson-step-check">{visual.caption}</p>}
      </div>
    </dialog>
  );
}
