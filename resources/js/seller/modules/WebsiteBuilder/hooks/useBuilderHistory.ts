import { useState, useCallback } from 'react';
import type { ElementorSection } from '../elementor/ElementorBuilder';

export function useBuilderHistory(initialSections: ElementorSection[] = []) {
  const [historyStack, setHistoryStack] = useState<ElementorSection[][]>([initialSections]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const saveHistory = useCallback((newSections: ElementorSection[]) => {
    const newHistory = historyStack.slice(0, historyIndex + 1);
    newHistory.push(newSections);
    setHistoryStack(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [historyStack, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      return historyStack[historyIndex - 1];
    }
    return null;
  }, [historyStack, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < historyStack.length - 1) {
      setHistoryIndex(historyIndex + 1);
      return historyStack[historyIndex + 1];
    }
    return null;
  }, [historyStack, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyStack.length - 1;

  return {
    saveHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    historyIndex
  };
}