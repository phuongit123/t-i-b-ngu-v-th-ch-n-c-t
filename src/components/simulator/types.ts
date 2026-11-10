export interface Point {
  x: number;
  y: number;
}

export type NodeType = 'sharp' | 'smooth' | 'smart';

export interface BezierNode {
  id: string;
  point: Point;
  handleIn?: Point | null;   // incoming handle (controls incoming curve)
  handleOut?: Point | null;  // outgoing handle (controls outgoing curve)
  type: NodeType;
}

export interface PathCurve {
  id: string;
  nodes: BezierNode[];
  isClosed: boolean;
}

export type SimulatorTool = 'pen' | 'node';

export interface SimulatorExercise {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  relatedLesson: string; // e.g. "D02-01", "D03-01"
  description: string;
  targetCurve: PathCurve;
  tolerance: number; // max acceptable average pixel deviation
  hints: string[];
}
