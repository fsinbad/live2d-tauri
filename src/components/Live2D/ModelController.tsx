import { Component, createSignal } from 'solid-js';
import type { Live2DModel, ModelSettings } from '../../types/live2d';

interface ModelControllerProps {
  models: Live2DModel[];
  currentModel: Live2DModel;
  settings: ModelSettings;
  onModelChange: (model: Live2DModel) => void;
  onSettingsChange: (settings: Partial<ModelSettings>) => void;
}

const ModelController: Component<ModelControllerProps> = (props) => {
  const [isSettingsVisible, setIsSettingsVisible] = createSignal(false);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '10px',
        'border-radius': '8px',
        color: 'white',
        'pointer-events': 'auto',
      }}
    >
      <button
        style={{
          background: '#4a90e2',
          border: 'none',
          padding: '8px 16px',
          'border-radius': '4px',
          color: 'white',
          cursor: 'pointer',
        }}
        onClick={() => setIsSettingsVisible(!isSettingsVisible())}
      >
        {isSettingsVisible() ? '隐藏设置' : '显示设置'}
      </button>

      {isSettingsVisible() && (
        <div style={{ 'margin-top': '10px' }}>
          <div style={{ margin: '10px 0' }}>
            <label style={{ display: 'block', 'margin-bottom': '5px' }}>
              选择模型：
            </label>
            <select
              style={{
                width: '100%',
                padding: '5px',
                'border-radius': '4px',
              }}
              value={props.currentModel.path}
              onChange={(e) => {
                const selectedModel = props.models.find(
                  (model) => model.path === e.currentTarget.value,
                );
                if (selectedModel) {
                  props.onModelChange(selectedModel);
                }
              }}
            >
              {props.models.map((model) => (
                <option value={model.path}>{model.name}</option>
              ))}
            </select>
          </div>

          <div style={{ margin: '10px 0' }}>
            <label style={{ display: 'block', 'margin-bottom': '5px' }}>
              缩放：
            </label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={props.settings.scale}
              onChange={(e) =>
                props.onSettingsChange({
                  scale: parseFloat(e.currentTarget.value),
                })
              }
              style={{ width: '100%' }}
            />
            <span>{props.settings.scale.toFixed(1)}</span>
          </div>

          <div style={{ margin: '10px 0' }}>
            <label style={{ display: 'block', 'margin-bottom': '5px' }}>
              透明度：
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={props.settings.opacity}
              onChange={(e) =>
                props.onSettingsChange({
                  opacity: parseFloat(e.currentTarget.value),
                })
              }
              style={{ width: '100%' }}
            />
            <span>{props.settings.opacity.toFixed(1)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelController;
