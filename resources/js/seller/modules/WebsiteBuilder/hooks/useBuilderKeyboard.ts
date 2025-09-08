import { useEffect } from 'react';

interface UseBuilderKeyboardProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  selectedElement: { type: 'section' | 'column' | 'widget'; id: string } | null;
  isSaving: boolean;
  historyIndex: number;
}

export function useBuilderKeyboard({
  onUndo,
  onRedo,
  onSave,
  onDelete,
  onDuplicate,
  selectedElement,
  isSaving,
  historyIndex
}: UseBuilderKeyboardProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo();
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        onRedo();
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!isSaving) {
          onSave();
        }
      }
      
      if (e.key === 'Delete' && selectedElement) {
        e.preventDefault();
        onDelete();
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedElement) {
        e.preventDefault();
        onDuplicate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, historyIndex, isSaving, onUndo, onRedo, onSave, onDelete, onDuplicate]);
}