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
        title="Bộ Mô Phỏng Bézier Pen & Node Tool Và Các Studio Tương Tác"
        description="Môi trường thực hành tương tác trực tiếp trên trình duyệt dành cho cơ chế Vector Bézier (Vector Studio) và Layer Stack, Masking & Blend Modes (Pixel Studio)."
        badge="Phòng mô phỏng tương tác"
      />

      <Tabs
        variant="pill"
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as 'designer' | 'photo')}
        items={[
          {
            id: 'designer',
            testId: 'sim-tab-designer',
            label: 'Bộ mô phỏng Vector Bézier (Vector Studio)',
            icon: <PenTool className="w-4 h-4 text-sky-400" />,
          },
          {
            id: 'photo',
            testId: 'sim-tab-photo',
            label: 'Bộ mô phỏng Layer Stack & Masking (Pixel Studio)',
            icon: <Image className="w-4 h-4 text-emerald-400" />,
            badge: 'Mặt nạ & Hòa trộn',
          },
        ]}
      />

      {activeTab === 'designer' ? <PenNodeSimulator /> : <PhotoLayerSimulator />}
    </div>
  );
};
