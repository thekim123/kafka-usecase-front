// src/composables/useKeyboardControl.ts
import { onMounted, onUnmounted } from "vue";

export function useKeyboardControl(handleKeyDown: (event: KeyboardEvent) => void) {
  onMounted(() => {
    window.addEventListener("keydown", handleKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });
}
