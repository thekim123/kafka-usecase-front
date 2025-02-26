// src/composables/useCanvasMosaic.ts
import {computed, ref, Ref} from "vue";
import {Rect} from "@/types/rect"
import {useMosaicStore} from "@/stores/mosaic-store";

export function useCanvasMosaic(canvas: Ref<HTMLCanvasElement | null>, frameSequence: Ref<number>) {
  // 저장된 모자이크 영역 좌표
  // 드래그 관련 상태
  const mosaicStore = useMosaicStore();
  const mosaicRects = computed<Rect[]>(() => {
    return mosaicStore.getMosaics(frameSequence.value)
  });

  const isDragging = ref(false);
  const startX = ref(0);
  const startY = ref(0);
  const currentRect = ref<Rect | null>(null);

  // 캔버스 이벤트 핸들러 등록
  function init() {
    if (!canvas.value) return;
    const c = canvas.value;
    c.addEventListener("mousedown", onMouseDown);
    c.addEventListener("mousemove", onMouseMove);
    c.addEventListener("mouseup", onMouseUp);
    c.addEventListener('keydown', onKeydown);
    c.addEventListener('contextmenu', onCanvasContextMenu, {capture: true});
  }

  function onKeydown(e: KeyboardEvent) {
    console.log(e.key);
    if (e.key === "Escape") {
      isDragging.value = false;
      currentRect.value = null;
      drawOverlay();
    } else if (e.key === "Delete") {
      console.log('delete key down');
    }
  }

  function onMouseDown(e: MouseEvent) {
    if (!canvas.value) return;
    const rect = canvas.value.getBoundingClientRect();
    isDragging.value = true;
    startX.value = e.clientX - rect.left;
    startY.value = e.clientY - rect.top;
    currentRect.value = {x: startX.value, y: startY.value, width: 0, height: 0};
  }

  function onMouseMove(e: MouseEvent) {
    if (!isDragging.value || !canvas.value) return;
    const rect = canvas.value.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    currentRect.value = {
      x: Math.round(Math.min(startX.value, currentX)),
      y: Math.round(Math.min(startY.value, currentY)),
      width: Math.round(Math.abs(currentX - startX.value)),
      height: Math.round(Math.abs(currentY - startY.value))
    };
  }

  function onMouseUp(e: MouseEvent) {
    if (!isDragging.value || !currentRect.value || e.button === 2) return;
    // 저장할 좌표 추가
    mosaicStore.pushMosaic(frameSequence.value, currentRect.value);
    // 선택 영역에 모자이크 효과 적용
    applyMosaic(currentRect.value);
    isDragging.value = false;
  }

  function onCanvasContextMenu(e: MouseEvent) {
    console.log('onCanvasContextMenu is called');
    e.preventDefault();
    if (!canvas.value) {
      return;
    }
    const rect = canvas.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const index = mosaicRects.value.findIndex(r =>
      x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height
    );
    if (index !== -1) {
      mosaicStore.removeMosaic(frameSequence.value, index);
      redrawMosaics();
    }
  }

  function redrawMosaics() {
    if (!canvas.value) {
      return;
    }
    const ctx = canvas.value.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
    mosaicRects.value.forEach(rect => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    });
  }

  // 현재 드래그 중인 영역(오버레이) 그리기
  function drawOverlay() {
    if (!canvas.value) return;
    const ctx = canvas.value.getContext("2d");
    if (!ctx) return;

    // 캔버스 전체 클리어 (필요한 경우, 원본 영상은 별도로 관리)
    // ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

    // 현재 드래그 중인 사각형 오버레이 그리기
    if (currentRect.value) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        currentRect.value.x,
        currentRect.value.y,
        currentRect.value.width,
        currentRect.value.height
      );
    }
  }

  // 선택 영역에 모자이크 효과 적용
  function applyMosaic(rect: Rect) {
    if (!canvas.value) return;
    const ctx = canvas.value.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = `rgba(0, 0, 0, 0.5)`;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  function pushMosaicRects(rects: Rect[]) {
    mosaicStore.pushMosaicArray(frameSequence.value, rects)
    redrawMosaics();
  }

  return {
    mosaicRects,
    currentRect,
    init,
    setMosaicRects: pushMosaicRects,
  };
}
