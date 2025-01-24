import { LogicalPosition, LogicalSize, Window } from '@tauri-apps/api/window';

// 设置窗口透明度
export async function setWindowTransparent(): Promise<void> {
  const mainWindow = await Window.getCurrent();
  await mainWindow.setDecorations(false);
  await mainWindow.setAlwaysOnTop(true);
}

// 移动窗口
export async function moveWindow(x: number, y: number): Promise<void> {
  const mainWindow = await Window.getCurrent();
  const position = await mainWindow.innerPosition();
  await mainWindow.setPosition(
    new LogicalPosition(position.x + x, position.y + y),
  );
}

// 调整窗口大小
export async function resizeWindow(
  width: number,
  height: number,
): Promise<void> {
  const mainWindow = await Window.getCurrent();
  await mainWindow.setSize(new LogicalSize(width, height));
}

// 保存窗口位置
export async function saveWindowPosition(): Promise<{ x: number; y: number }> {
  const mainWindow = await Window.getCurrent();
  const position = await mainWindow.innerPosition();
  return {
    x: position.x,
    y: position.y,
  };
}

// 恢复窗口位置
export async function restoreWindowPosition(
  x: number,
  y: number,
): Promise<void> {
  const mainWindow = await Window.getCurrent();
  await mainWindow.setPosition(new LogicalPosition(x, y));
}
