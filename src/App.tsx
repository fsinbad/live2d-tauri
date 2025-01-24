import { Component, createSignal, onMount } from 'solid-js';
import Live2DViewer from './components/Live2D/Live2DViewer';
import ModelController from './components/Live2D/ModelController';
import type { Live2DModel, ModelSettings } from './types/live2d';

// 默认模型列表
const DEFAULT_MODELS: Live2DModel[] = [
  {
    name: 'Hiyori',
    path: 'models/hiyori/Hiyori.model3.json',
  },
  {
    name: 'Haru',
    path: 'models/haru/Haru.model3.json',
  },
];

// 默认设置
const DEFAULT_SETTINGS: ModelSettings = {
  scale: 0.22,  // 缩小模型比例
  opacity: 1.0,
  position: {
    x: window.innerWidth / 2,
    y: window.innerHeight * 0.7, // 将模型位置下移
  },
};

const App: Component = () => {
  const [currentModel, setCurrentModel] = createSignal<Live2DModel>(
    DEFAULT_MODELS[0],
  );
  const [settings, setSettings] = createSignal<ModelSettings>(DEFAULT_SETTINGS);

  // 初始化窗口设置
  onMount(async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      const appWindow = getCurrentWindow();
      // await appWindow.setDecorations(false);
    } catch (error) {
      console.error('Failed to initialize window:', error);
    }
  });

  // 处理模型拖拽
  const handleDrag = async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      const appWindow = getCurrentWindow();
      await appWindow.startDragging();
    } catch (error) {
      console.error('Failed to start dragging:', error);
    }
  };

  // 处理设置变更
  const handleSettingsChange = (newSettings: Partial<ModelSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        'pointer-events': 'auto',
        background: 'transparent',
      }}
      data-tauri-drag-region
    >
      <Live2DViewer
        currentModel={currentModel()}
        settings={settings()}
        onDrag={handleDrag}
        onSettingsChange={handleSettingsChange}
      />
      <ModelController
        models={DEFAULT_MODELS}
        currentModel={currentModel()}
        settings={settings()}
        onModelChange={setCurrentModel}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
};

export default App;
