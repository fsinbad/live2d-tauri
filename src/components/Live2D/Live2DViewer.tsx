import { Component, onMount, onCleanup } from 'solid-js';
import * as PIXI from 'pixi.js';
import { Live2DModel as PIXILive2DModel } from 'pixi-live2d-display';
import {
  createPixiApp,
  loadLive2DModel,
  destroyModel,
  initLive2D,
} from '../../utils/live2d';
import type { Live2DViewerProps } from '../../types/live2d';

const Live2DViewer: Component<Live2DViewerProps> = (props) => {
  let containerRef: HTMLDivElement | undefined;
  let app: PIXI.Application | undefined;
  let currentModel: any | undefined;

  const initializeViewer = async () => {
    if (!containerRef) return;

    try {
      console.log('Initializing Live2D viewer...');
      await initLive2D();
      console.log('Live2D initialized');

      app = createPixiApp(containerRef);
      console.log('PIXI app created');

      // 调整容器大小以适应窗口
      const updateSize = () => {
        if (app) {
          app.renderer.resize(window.innerWidth, window.innerHeight);
          if (currentModel) {
            currentModel.position.set(window.innerWidth / 2, window.innerHeight * 0.7);
          }
        }
      };

      // 监听窗口大小变化
      window.addEventListener('resize', updateSize);

      console.log('Loading model from:', props.currentModel.path);
      currentModel = await loadLive2DModel(
        app,
        props.currentModel.path,
        props.settings
      );
      console.log('Model loaded successfully');

      // 初始调整大小
      updateSize();

      // 设置拖拽事件
      if (currentModel && props.onDrag) {
        let isDragging = false;
        let lastPosition = { x: 0, y: 0 };

        const onMouseDown = (event: MouseEvent) => {
          isDragging = true;
          lastPosition = {
            x: event.clientX,
            y: event.clientY
          };
        };

        const onMouseMove = (event: MouseEvent) => {
          if (isDragging && props.onDrag) {
            const newPosition = {
              x: event.clientX,
              y: event.clientY
            };
            const dx = newPosition.x - lastPosition.x;
            const dy = newPosition.y - lastPosition.y;
            props.onDrag(dx, dy);
            lastPosition = newPosition;
          }
        };

        const onMouseUp = () => {
          isDragging = false;
        };

        // 设置事件监听
        containerRef.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        // 清理事件监听
        onCleanup(() => {
          containerRef?.removeEventListener('mousedown', onMouseDown);
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        });
      }
    } catch (error) {
      console.error('Failed to initialize Live2D viewer:', error);
    }
  };

  onMount(() => {
    console.log('Component mounted');
    initializeViewer();
  });

  onCleanup(() => {
    if (currentModel) {
      destroyModel(currentModel);
    }
    if (app) {
      app.destroy(true, { children: true, texture: true });
    }
  });

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: '0',
        left: '0',
        'z-index': '1',
        'pointer-events': 'auto',
        overflow: 'visible',
      }}
    />
  );
};

export default Live2DViewer;
