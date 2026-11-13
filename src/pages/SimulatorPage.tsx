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
        title="Affinity Pen & Node Tool Bézier Simulator & Interactive Studios"
        description="Môi trường thực hành tương tác trực tiếp trên trình duyệt dành cho cơ chế Vector Bézier (Designer) và Layer Stack, Masking & Blend Modes (Photo)."
        badge="Phase 5 Interactive Learning Subsystem"
      />

      <Tabs
        variant="pill"
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as 'designer' | 'photo')}
        items={[
          {
            id: 'designer',
            label: 'Vector Bézier Simulator (Designer)',
            icon: <PenTool className="w-4 h-4 text-sky-400" />,
          },
          {
            id: 'photo',
            label: 'Layer Stack & Masking Simulator (Photo)',
            icon: <Image className="w-4 h-4 text-emerald-400" />,
            badge: 'New v4.2.1',
          },
        ]}
      />

      {activeTab === 'designer' ? <PenNodeSimulator /> : <PhotoLayerSimulator />}
    </div>
  );
};
