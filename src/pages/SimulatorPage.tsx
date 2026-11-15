import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Tabs } from '@/components/ui/Tabs';
import { PenNodeSimulator } from '@/components/simulator/PenNodeSimulator';
import { PhotoLayerSimulator } from '@/components/simulator/PhotoLayerSimulator';
import { PenTool, Image } from 'lucide-react';

export const SimulatorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'designer' | 'photo'>('designer');

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          <>
            <span>Bộ Mô Phỏng Bézier Pen &amp; Node Tool Và Các Studio Tương Tác</span>
            <span className="sr-only">Affinity Pen &amp; Node Tool Bézier Simulator &amp; Interactive Studios</span>
          </>
        }
        description="Môi trường thực hành tương tác trực tiếp trên trình duyệt dành cho cơ chế Vector Bézier (Vector Studio) và Layer Stack, Masking & Blend Modes (Pixel Studio)."
        badge="Phân hệ thực hành tương tác giai đoạn 5"
      />

      <Tabs
        variant="pill"
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as 'designer' | 'photo')}
        items={[
          {
            id: 'designer',
            label: 'Bộ mô phỏng Vector Bézier (Vector Studio)',
            srText: 'Vector Bézier Simulator (Designer)',
            icon: <PenTool className="w-4 h-4 text-sky-400" />,
          },
          {
            id: 'photo',
            label: 'Bộ mô phỏng Layer Stack & Masking (Pixel Studio)',
            srText: 'Layer Stack & Masking Simulator (Photo)',
            icon: <Image className="w-4 h-4 text-emerald-400" />,
            badge: 'Phiên bản v4.2.1',
          },
        ]}
      />

      {activeTab === 'designer' ? <PenNodeSimulator /> : <PhotoLayerSimulator />}
    </div>
  );
};
