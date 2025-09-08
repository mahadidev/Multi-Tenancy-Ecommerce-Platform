import React from 'react';
import { CGBuilderLayoutBuilderPage } from './CGBuilderLayoutBuilderPage';

interface CGBuilderLayoutBuilderProps {
  type?: 'header' | 'footer';
}

export function CGBuilderLayoutBuilder({ type }: CGBuilderLayoutBuilderProps) {
  return <CGBuilderLayoutBuilderPage type={type} />;
}