// src/utils/scale-util.ts
export function getScaledCoordinates(
  e: MouseEvent,
  canvas: HTMLCanvasElement
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();

  // 브라우저에서 보여지는 캔버스 크기와 실제 해상도 비율 계산
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  // 현재 마우스 위치를 원본 해상도 기준으로 변환
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  return { x: Math.round(x), y: Math.round(y) };
}
