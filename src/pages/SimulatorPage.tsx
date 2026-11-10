import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PenNodeSimulator } from '@/components/simulator/PenNodeSimulator';

export const SimulatorPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Affinity Pen & Node Tool Bézier Simulator"
        description="Môi trường thực hành tương tác trực tiếp trên trình duyệt dành cho cơ chế đường cong Bézier, các loại điểm neo (Sharp, Smooth, Smart) và tay đòn điều hướng."
        badge="Phase 4 MVP Interactive Sandbox"
      />

      <PenNodeSimulator />
    </div>
  );
};
