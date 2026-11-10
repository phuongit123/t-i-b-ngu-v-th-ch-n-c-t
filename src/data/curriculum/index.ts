/**
 * Affinity Academy Curriculum Index
 * Aggregates all validated curriculum modules, tracks, and lessons.
 */

import type { CurriculumLesson, CurriculumModule, CurriculumTrack } from '../../types/curriculum.ts';

// Designer D01 & D02
import modD01 from '../../../curriculum/designer/D01/module.json';
import lessonD01_01 from '../../../curriculum/designer/D01/D01-01.json';
import lessonD01_02 from '../../../curriculum/designer/D01/D01-02.json';
import lessonD01_03 from '../../../curriculum/designer/D01/D01-03.json';

import modD02 from '../../../curriculum/designer/D02/module.json';
import lessonD02_01 from '../../../curriculum/designer/D02/D02-01.json';
import lessonD02_02 from '../../../curriculum/designer/D02/D02-02.json';
import lessonD02_03 from '../../../curriculum/designer/D02/D02-03.json';

import modD03 from '../../../curriculum/designer/D03/module.json';
import lessonD03_01 from '../../../curriculum/designer/D03/D03-01.json';
import lessonD03_02 from '../../../curriculum/designer/D03/D03-02.json';
import lessonD03_03 from '../../../curriculum/designer/D03/D03-03.json';

import modD04 from '../../../curriculum/designer/D04/module.json';
import lessonD04_01 from '../../../curriculum/designer/D04/D04-01.json';
import lessonD04_02 from '../../../curriculum/designer/D04/D04-02.json';
import lessonD04_03 from '../../../curriculum/designer/D04/D04-03.json';

import modD05 from '../../../curriculum/designer/D05/module.json';
import lessonD05_01 from '../../../curriculum/designer/D05/D05-01.json';
import lessonD05_02 from '../../../curriculum/designer/D05/D05-02.json';
import lessonD05_03 from '../../../curriculum/designer/D05/D05-03.json';

import modD06 from '../../../curriculum/designer/D06/module.json';
import lessonD06_01 from '../../../curriculum/designer/D06/D06-01.json';
import lessonD06_02 from '../../../curriculum/designer/D06/D06-02.json';
import lessonD06_03 from '../../../curriculum/designer/D06/D06-03.json';

import modD07 from '../../../curriculum/designer/D07/module.json';
import lessonD07_01 from '../../../curriculum/designer/D07/D07-01.json';
import lessonD07_02 from '../../../curriculum/designer/D07/D07-02.json';
import lessonD07_03 from '../../../curriculum/designer/D07/D07-03.json';

import modD08 from '../../../curriculum/designer/D08/module.json';
import lessonD08_01 from '../../../curriculum/designer/D08/D08-01.json';
import lessonD08_02 from '../../../curriculum/designer/D08/D08-02.json';
import lessonD08_03 from '../../../curriculum/designer/D08/D08-03.json';

import modD09 from '../../../curriculum/designer/D09/module.json';
import lessonD09_01 from '../../../curriculum/designer/D09/D09-01.json';
import lessonD09_02 from '../../../curriculum/designer/D09/D09-02.json';
import lessonD09_03 from '../../../curriculum/designer/D09/D09-03.json';

import modD10 from '../../../curriculum/designer/D10/module.json';
import lessonD10_01 from '../../../curriculum/designer/D10/D10-01.json';
import lessonD10_02 from '../../../curriculum/designer/D10/D10-02.json';
import lessonD10_03 from '../../../curriculum/designer/D10/D10-03.json';

// Photo P01
import modP01 from '../../../curriculum/photo/P01/module.json';
import lessonP01_01 from '../../../curriculum/photo/P01/P01-01.json';
import lessonP01_02 from '../../../curriculum/photo/P01/P01-02.json';
import lessonP01_03 from '../../../curriculum/photo/P01/P01-03.json';

// Publisher B01
import modB01 from '../../../curriculum/publisher/B01/module.json';
import lessonB01_01 from '../../../curriculum/publisher/B01/B01-01.json';
import lessonB01_02 from '../../../curriculum/publisher/B01/B01-02.json';
import lessonB01_03 from '../../../curriculum/publisher/B01/B01-03.json';

// Scripting S01
import modS01 from '../../../curriculum/scripting/S01/module.json';
import lessonS01_01 from '../../../curriculum/scripting/S01/S01-01.json';
import lessonS01_02 from '../../../curriculum/scripting/S01/S01-02.json';
import lessonS01_03 from '../../../curriculum/scripting/S01/S01-03.json';

export const ALL_PILOT_LESSONS: CurriculumLesson[] = [
  lessonD01_01 as unknown as CurriculumLesson,
  lessonD01_02 as unknown as CurriculumLesson,
  lessonD01_03 as unknown as CurriculumLesson,
  lessonD02_01 as unknown as CurriculumLesson,
  lessonD02_02 as unknown as CurriculumLesson,
  lessonD02_03 as unknown as CurriculumLesson,
  lessonD03_01 as unknown as CurriculumLesson,
  lessonD03_02 as unknown as CurriculumLesson,
  lessonD03_03 as unknown as CurriculumLesson,
  lessonD04_01 as unknown as CurriculumLesson,
  lessonD04_02 as unknown as CurriculumLesson,
  lessonD04_03 as unknown as CurriculumLesson,
  lessonD05_01 as unknown as CurriculumLesson,
  lessonD05_02 as unknown as CurriculumLesson,
  lessonD05_03 as unknown as CurriculumLesson,
  lessonD06_01 as unknown as CurriculumLesson,
  lessonD06_02 as unknown as CurriculumLesson,
  lessonD06_03 as unknown as CurriculumLesson,
  lessonD07_01 as unknown as CurriculumLesson,
  lessonD07_02 as unknown as CurriculumLesson,
  lessonD07_03 as unknown as CurriculumLesson,
  lessonD08_01 as unknown as CurriculumLesson,
  lessonD08_02 as unknown as CurriculumLesson,
  lessonD08_03 as unknown as CurriculumLesson,
  lessonD09_01 as unknown as CurriculumLesson,
  lessonD09_02 as unknown as CurriculumLesson,
  lessonD09_03 as unknown as CurriculumLesson,
  lessonD10_01 as unknown as CurriculumLesson,
  lessonD10_02 as unknown as CurriculumLesson,
  lessonD10_03 as unknown as CurriculumLesson,
  lessonP01_01 as unknown as CurriculumLesson,
  lessonP01_02 as unknown as CurriculumLesson,
  lessonP01_03 as unknown as CurriculumLesson,
  lessonB01_01 as unknown as CurriculumLesson,
  lessonB01_02 as unknown as CurriculumLesson,
  lessonB01_03 as unknown as CurriculumLesson,
  lessonS01_01 as unknown as CurriculumLesson,
  lessonS01_02 as unknown as CurriculumLesson,
  lessonS01_03 as unknown as CurriculumLesson,
];

export const ALL_PILOT_MODULES: CurriculumModule[] = [
  {
    ...(modD01 as unknown as CurriculumModule),
    lessons: [
      lessonD01_01 as unknown as CurriculumLesson,
      lessonD01_02 as unknown as CurriculumLesson,
      lessonD01_03 as unknown as CurriculumLesson,
    ],
  },
  {
    ...(modD02 as unknown as CurriculumModule),
    lessons: [
      lessonD02_01 as unknown as CurriculumLesson,
      lessonD02_02 as unknown as CurriculumLesson,
      lessonD02_03 as unknown as CurriculumLesson,
    ],
  },
  {
    ...(modD03 as unknown as CurriculumModule),
    lessons: [
      lessonD03_01 as unknown as CurriculumLesson,
      lessonD03_02 as unknown as CurriculumLesson,
      lessonD03_03 as unknown as CurriculumLesson,
    ],
  },
  {
    ...(modD04 as unknown as CurriculumModule),
    lessons: [
      lessonD04_01 as unknown as CurriculumLesson,
      lessonD04_02 as unknown as CurriculumLesson,
      lessonD04_03 as unknown as CurriculumLesson,
    ],
  },
  {
    ...(modD05 as unknown as CurriculumModule),
    lessons: [
      lessonD05_01 as unknown as CurriculumLesson,
      lessonD05_02 as unknown as CurriculumLesson,
      lessonD05_03 as unknown as CurriculumLesson,
    ],
  },
  {
    ...(modD06 as unknown as CurriculumModule),
    lessons: [
      lessonD06_01 as unknown as CurriculumLesson,
      lessonD06_02 as unknown as CurriculumLesson,
      lessonD06_03 as unknown as CurriculumLesson,
    ],
  },
  {
    ...(modD07 as unknown as CurriculumModule),
    lessons: [
      lessonD07_01 as unknown as CurriculumLesson,
      lessonD07_02 as unknown as CurriculumLesson,
      lessonD07_03 as unknown as CurriculumLesson,
    ],
  },
  {
    ...(modD08 as unknown as CurriculumModule),
    lessons: [
      lessonD08_01 as unknown as CurriculumLesson,
      lessonD08_02 as unknown as CurriculumLesson,
      lessonD08_03 as unknown as CurriculumLesson,
    ],
  },
  {
    ...(modD09 as unknown as CurriculumModule),
    lessons: [
      lessonD09_01 as unknown as CurriculumLesson,
      lessonD09_02 as unknown as CurriculumLesson,
      lessonD09_03 as unknown as CurriculumLesson,
    ],
  },
  {
    ...(modD10 as unknown as CurriculumModule),
    lessons: [
      lessonD10_01 as unknown as CurriculumLesson,
      lessonD10_02 as unknown as CurriculumLesson,
      lessonD10_03 as unknown as CurriculumLesson,
    ],
  },
  {
    ...(modP01 as unknown as CurriculumModule),
    lessons: [
      lessonP01_01 as unknown as CurriculumLesson,
      lessonP01_02 as unknown as CurriculumLesson,
      lessonP01_03 as unknown as CurriculumLesson,
    ],
  },
  {
    ...(modB01 as unknown as CurriculumModule),
    lessons: [
      lessonB01_01 as unknown as CurriculumLesson,
      lessonB01_02 as unknown as CurriculumLesson,
      lessonB01_03 as unknown as CurriculumLesson,
    ],
  },
  {
    ...(modS01 as unknown as CurriculumModule),
    lessons: [
      lessonS01_01 as unknown as CurriculumLesson,
      lessonS01_02 as unknown as CurriculumLesson,
      lessonS01_03 as unknown as CurriculumLesson,
    ],
  },
];

export const CURRICULUM_TRACKS: CurriculumTrack[] = [
  {
    id: 'designer',
    title: 'Affinity Designer Mastery',
    tagline: 'Precision vector geometry, responsive artboards & typography',
    description: 'Master vector bezier curves, boolean operations, isometric projection grids, and multi-scale asset export across 10 in-depth modules.',
    accentColor: '#00d2ff',
    iconName: 'PenTool',
    moduleCount: 10,
    lessonCount: 30,
    modules: ALL_PILOT_MODULES.filter(m => m.trackId === 'designer'),
  },
  {
    id: 'photo',
    title: 'Affinity Photo Mastery',
    tagline: 'Non-destructive retouching, RAW develop & 32-bit HDR color',
    description: 'Harness non-destructive adjustments, frequency separation, live filters, and unbounded 32-bit floating-point dynamic range across 10 modules.',
    accentColor: '#38bdf8',
    iconName: 'Image',
    moduleCount: 10,
    lessonCount: 30,
    modules: ALL_PILOT_MODULES.filter(m => m.trackId === 'photo'),
  },
  {
    id: 'publisher',
    title: 'Affinity Publisher Mastery',
    tagline: 'Multi-page architecture, master pages & press-ready bleed',
    description: 'Learn commercial editorial layout, facing page signatures, baseline grids, and StudioLink cross-app integration across 10 modules.',
    accentColor: '#fb7185',
    iconName: 'BookOpen',
    moduleCount: 10,
    lessonCount: 30,
    modules: ALL_PILOT_MODULES.filter(m => m.trackId === 'publisher'),
  },
  {
    id: 'scripting',
    title: 'Scripting & MCP Automation',
    tagline: 'Programmatic design via JavaScript DOM & local MCP bridge',
    description: 'Automate vector art, batch layouts, and generative rendering using the native embedded V8 engine and port 6767 MCP server.',
    accentColor: '#10b981',
    iconName: 'Code',
    moduleCount: 10,
    lessonCount: 30,
    modules: ALL_PILOT_MODULES.filter(m => m.trackId === 'scripting'),
  },
];

export function getLessonById(id: string): CurriculumLesson | undefined {
  return ALL_PILOT_LESSONS.find(l => l.id === id);
}

export function getModuleById(id: string): CurriculumModule | undefined {
  return ALL_PILOT_MODULES.find(m => m.id === id);
}
