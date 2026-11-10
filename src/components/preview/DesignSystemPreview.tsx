import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { Tooltip } from '../ui/Tooltip';
import { Modal } from '../ui/Modal';
import { Toast } from '../ui/Toast';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { HeroSection } from '../sections/HeroSection';
import { TrackCard } from '../cards/TrackCard';
import { ModuleCard } from '../cards/ModuleCard';
import { LessonCard } from '../cards/LessonCard';
import { ProgressCard } from '../cards/ProgressCard';
import { ToolCard } from '../cards/ToolCard';
import { ResourceCard } from '../cards/ResourceCard';
import { SearchCommand, SearchResultItem } from '../search/SearchCommand';
import { PageHeader } from '../layout/PageHeader';
import { PenTool, Image, BookOpen, Terminal } from 'lucide-react';
import type { ModuleSummary, LessonSummary, ToolEncyclopediaItem, ResourceItem } from '@/types/design-system';

export const DesignSystemPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState('components');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sample data for components
  const sampleModule: ModuleSummary = {
    id: 'D02',
    trackId: 'designer',
    moduleNumber: 'D02',
    title: 'Vector Nodes, Paths & Pen Tool Geometry',
    description: 'Master Sharp, Smooth, and Smart nodes with bezier handle manipulation.',
    lessonCount: 3,
    estimatedMinutes: 45,
    difficulty: 'Intermediate',
    progressPercentage: 66,
  };

  const sampleLesson: LessonSummary = {
    id: 'L-D02-1',
    moduleId: 'D02',
    lessonNumber: 1,
    title: 'Anatomy of Bezier Curves and Node Types',
    durationMinutes: 15,
    completed: true,
  };

  const sampleTool: ToolEncyclopediaItem = {
    id: 'tool-pen',
    name: 'Pen Tool',
    app: 'designer',
    persona: 'vector',
    shortcut: { windows: 'P', mac: 'P' },
    description: 'Places precise vector anchor points and controls curve tangents.',
    modifiers: [
      { key: 'Alt / Option', action: 'Drag handle independently to create sharp cusp corner' },
      { key: 'Shift', action: 'Constrain angle to 45 degree increments' },
    ],
  };

  const sampleResource: ResourceItem = {
    id: 'res-palettes-1',
    title: 'Affinity Mastero Core Color Swatches',
    category: 'palette',
    format: '.afpalette',
    fileSize: '124 KB',
    downloadsCount: 1420,
    description: 'Curated 64-color palette designed for high-contrast digital UI and print.',
  };

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <PageHeader
        title="Design System & Visual Foundations"
        description="Mastero & Minimalism component architecture inspired by traced.life with authentic Serif Affinity creative tokens."
        badge="Phase 2 Verified"
        breadcrumbs={[
          { label: 'System', href: '/' },
          { label: 'Design System', active: true },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsSearchOpen(true)}
            >
              Open Search (Ctrl+K)
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsModalOpen(true)}
            >
              Open Modal
            </Button>
          </div>
        }
      />

      {/* Hero Section */}
      <HeroSection
        onExploreTracks={() => setToastMessage('Navigating to 40 modules catalog')}
        onLaunchPlayground={() => setToastMessage('Launching Affinity MCP playground')}
        isMcpActive={true}
      />

      {/* Tabs */}
      <Tabs
        activeId={activeTab}
        onChange={setActiveTab}
        items={[
          { id: 'components', label: 'UI Primitives & Buttons', badge: 8 },
          { id: 'cards', label: 'Affinity Cards & Modules', badge: 6 },
          { id: 'states', label: 'States & Skeletons', badge: 4 },
        ]}
      />

      {/* Tab 1: Components & Primitives */}
      {activeTab === 'components' && (
        <div className="space-y-8">
          {/* Button Variants */}
          <div className="p-6 rounded-sm bg-surface border border-hairline space-y-4">
            <h3 className="text-sm font-bold text-zinc-100 uppercase font-mono tracking-wider">
              1. Button Variants & Interaction States
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="accent-designer" leftIcon={<PenTool className="w-3.5 h-3.5" />}>
                Designer Cyan
              </Button>
              <Button variant="accent-photo" leftIcon={<Image className="w-3.5 h-3.5" />}>
                Photo Blue
              </Button>
              <Button variant="accent-publisher" leftIcon={<BookOpen className="w-3.5 h-3.5" />}>
                Publisher Rose
              </Button>
              <Button variant="accent-scripting" leftIcon={<Terminal className="w-3.5 h-3.5" />}>
                Scripting Green
              </Button>
              <Button variant="primary" isLoading={true}>
                Loading
              </Button>
            </div>
          </div>

          {/* Tooltips & Badges */}
          <div className="p-6 rounded-sm bg-surface border border-hairline space-y-4">
            <h3 className="text-sm font-bold text-zinc-100 uppercase font-mono tracking-wider">
              2. Tooltips & Micro-Interactions
            </h3>
            <div className="flex items-center gap-4">
              <Tooltip content="Pen Tool shortcut key: P" position="top">
                <Button size="sm" variant="outline">
                  Hover for Tooltip (Top)
                </Button>
              </Tooltip>
              <Tooltip content="Live connection established on localhost:6767" position="bottom">
                <Button size="sm" variant="outline">
                  Hover for Tooltip (Bottom)
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Affinity Cards & Modules */}
      {activeTab === 'cards' && (
        <div className="space-y-8">
          {/* 4 Tracks Grid */}
          <div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase font-mono tracking-wider mb-4">
              Affinity Learning Tracks (4 Core Pillars)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <TrackCard
                id="designer"
                name="Affinity Designer"
                tagline="Vector Precision"
                description="Master vector nodes, pen tool, isometric grids, and boolean curves."
                moduleCount={10}
                lessonCount={30}
                progressPercentage={30}
                onClick={() => setToastMessage('Selected Designer Track')}
              />
              <TrackCard
                id="photo"
                name="Affinity Photo"
                tagline="Raster Mastery"
                description="Professional RAW development, frequency separation, and non-destructive compositing."
                moduleCount={10}
                lessonCount={30}
                progressPercentage={10}
                onClick={() => setToastMessage('Selected Photo Track')}
              />
              <TrackCard
                id="publisher"
                name="Affinity Publisher"
                tagline="Editorial Design"
                description="Master pages, baseline grids, typographic hierarchy, and preflight print standards."
                moduleCount={10}
                lessonCount={30}
                progressPercentage={0}
                onClick={() => setToastMessage('Selected Publisher Track')}
              />
              <TrackCard
                id="scripting"
                name="Scripting & MCP"
                tagline="Automation Engine"
                description="Computational design with JavaScript DOM API and live MCP server integration."
                moduleCount={10}
                lessonCount={30}
                progressPercentage={50}
                onClick={() => setToastMessage('Selected Scripting Track')}
              />
            </div>
          </div>

          {/* Module & Lesson & Tool Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ModuleCard
              module={sampleModule}
              onClick={() => setToastMessage('Selected Module D02')}
            />
            <div className="space-y-2">
              <LessonCard
                lesson={sampleLesson}
                isActive={true}
                onClick={() => setToastMessage('Playing Lesson 1')}
              />
              <LessonCard
                lesson={{ ...sampleLesson, lessonNumber: 2, title: 'Node Manipulation with Modifiers', completed: false }}
                onClick={() => setToastMessage('Playing Lesson 2')}
              />
            </div>
            <ProgressCard
              completedLessons={15}
              totalLessons={120}
              streakDays={4}
              earnedBadgesCount={2}
            />
          </div>

          {/* Tool Card & Resource Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToolCard
              tool={sampleTool}
              onClick={() => setToastMessage('Selected Pen Tool detail')}
            />
            <ResourceCard
              resource={sampleResource}
              onDownload={() => setToastMessage('Downloading .afpalette file')}
            />
          </div>
        </div>
      )}

      {/* Tab 3: States & Skeletons */}
      {activeTab === 'states' && (
        <div className="space-y-8">
          {/* Skeleton Loaders */}
          <div className="p-6 rounded-sm bg-surface border border-hairline space-y-4">
            <h3 className="text-sm font-bold text-zinc-100 uppercase font-mono tracking-wider">
              1. Skeleton Shimmer States (Zero Layout Shift)
            </h3>
            <div className="space-y-3 max-w-md">
              <Skeleton height="24px" width="60%" />
              <Skeleton height="14px" width="100%" />
              <Skeleton height="14px" width="85%" />
              <div className="flex gap-2 pt-2">
                <Skeleton height="36px" width="100px" />
                <Skeleton height="36px" width="100px" />
              </div>
            </div>
          </div>

          {/* Empty & Error States */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EmptyState
              title="No Challenge Submissions Yet"
              description="Complete the Module D02 challenge exercise in Affinity Designer and submit your vector render for verification."
              action={
                <Button size="sm" variant="outline">
                  View Exercise Brief
                </Button>
              }
            />
            <ErrorState
              title="MCP Connection Timeout"
              message="Failed to connect to http://localhost:6767/sse after 2000ms. Affinity 3.0 listener is offline."
              onRetry={() => setToastMessage('Retrying MCP connection...')}
            />
          </div>
        </div>
      )}

      {/* Modals & Dialogs */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Affinity Pen Tool Bezier Mechanics"
        description="Core keyboard modifier interactions verified in Affinity 3.3.3"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Understood
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs leading-relaxed text-zinc-300">
          <p>
            When drawing curves with the Pen Tool in Affinity Designer:
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400 font-mono">
            <li>Click without dragging: Places a sharp corner node.</li>
            <li>Click and drag: Pulls symmetrical bezier control handles.</li>
            <li>Hold <span className="text-zinc-200">Alt / Option</span>: Breaks symmetry to create a cusp point.</li>
            <li>Hold <span className="text-zinc-200">Shift</span>: Constrains tangent angle to 45&deg; increments.</li>
          </ul>
        </div>
      </Modal>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast
            type="success"
            title="Design System Event"
            message={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        </div>
      )}

      {/* Quick Search Palette */}
      <SearchCommand
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectItem={(item: SearchResultItem) => setToastMessage(`Selected: ${item.title}`)}
      />
    </div>
  );
};
