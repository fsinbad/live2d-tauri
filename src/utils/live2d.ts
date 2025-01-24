import * as PIXI from 'pixi.js';
import { Live2DModel as PIXILive2DModel } from 'pixi-live2d-display';
import type { Live2DModel, ModelSettings } from '../types/live2d';

// 初始化 Live2D 框架
export async function initLive2D(): Promise<void> {
  // 等待 Live2D 运行时加载完成
  await new Promise<void>((resolve) => {
    if (window.Live2DCubismCore) {
      resolve();
    } else {
      window.addEventListener('load', () => resolve(), { once: true });
    }
  });

  // 注册 Live2D 插件到 PIXI
  await PIXILive2DModel.registerTicker(PIXI.Ticker);
}

// 创建 PIXI 应用
export function createPixiApp(container: HTMLDivElement): PIXI.Application {
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundAlpha: 0,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    powerPreference: 'high-performance',
  });

  container.appendChild(app.view as HTMLCanvasElement);
  app.renderer.resize(window.innerWidth, window.innerHeight);
  return app;
}

// 加载 Live2D 模型
export async function loadLive2DModel(
  app: PIXI.Application,
  modelPath: string,
  settings: ModelSettings,
): Promise<any> {
  try {
    console.log('Starting model load:', modelPath);
    const model = await PIXILive2DModel.from(modelPath);
    console.log('Model loaded:', model);

    // 设置模型属性
    model.anchor.set(0.5, 0.5); // 设置锚点为中心
    model.scale.set(settings.scale);
    model.position.set(settings.position.x, settings.position.y);
    model.alpha = settings.opacity;
    
    // 启用交互
    model.interactive = true;
    
    // 添加到舞台
    app.stage.addChild(model as any);
    console.log('Model dimensions:', {
      width: model.width,
      height: model.height,
      scale: model.scale,
      x: model.position.x,
      y: model.position.y
    });

    return model;
  } catch (error) {
    console.error('Failed to load Live2D model:', error);
    throw error;
  }
}

// 更新模型设置
export function updateModelSettings(
  model: any,
  settings: Partial<ModelSettings>,
): void {
  if (settings.scale !== undefined) {
    model.scale.set(settings.scale);
  }
  if (settings.position) {
    model.position.set(settings.position.x, settings.position.y);
  }
  if (settings.opacity !== undefined) {
    model.alpha = settings.opacity;
  }
}

// 销毁模型
export function destroyModel(model: any): void {
  if (model) {
    model.destroy();
  }
}
