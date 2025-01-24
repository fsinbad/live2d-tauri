declare global {
  interface Window {
    Live2DCubismCore: any;
  }
}

export interface Live2DModel {
  name: string;
  path: string;
  config?: {
    position?: {
      x: number;
      y: number;
    };
    scale?: number;
    opacity?: number;
  };
}

export interface ModelSettings {
  scale: number;
  opacity: number;
  position: {
    x: number;
    y: number;
  };
}

export interface Live2DViewerProps {
  currentModel: Live2DModel;
  settings: ModelSettings;
  onDrag?: (x: number, y: number) => void;
  onSettingsChange?: (settings: Partial<ModelSettings>) => void;
}
