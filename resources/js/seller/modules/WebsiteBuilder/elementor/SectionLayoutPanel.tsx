import React from 'react';

interface SectionLayoutPanelProps {
  onSelectLayout: (layout: SectionLayout) => void;
  onClose: () => void;
}

export interface SectionLayout {
  id: string;
  name: string;
  columns: number[];
  icon: React.ReactNode;
  description: string;
}

const sectionLayouts: SectionLayout[] = [
  {
    id: '1-col',
    name: 'Single Column',
    columns: [100],
    description: 'One full-width column',
    icon: (
      <div className="w-full h-8 bg-blue-200 rounded border-2 border-blue-400"></div>
    )
  },
  {
    id: '2-col-equal',
    name: 'Two Equal Columns',
    columns: [50, 50],
    description: 'Two columns with equal width',
    icon: (
      <div className="flex gap-1 w-full h-8">
        <div className="flex-1 bg-blue-200 rounded border-2 border-blue-400"></div>
        <div className="flex-1 bg-blue-200 rounded border-2 border-blue-400"></div>
      </div>
    )
  },
  {
    id: '2-col-left',
    name: 'Two Columns (2:1)',
    columns: [66.67, 33.33],
    description: 'Left column wider than right',
    icon: (
      <div className="flex gap-1 w-full h-8">
        <div className="w-2/3 bg-blue-200 rounded border-2 border-blue-400"></div>
        <div className="w-1/3 bg-blue-200 rounded border-2 border-blue-400"></div>
      </div>
    )
  },
  {
    id: '2-col-right',
    name: 'Two Columns (1:2)',
    columns: [33.33, 66.67],
    description: 'Right column wider than left',
    icon: (
      <div className="flex gap-1 w-full h-8">
        <div className="w-1/3 bg-blue-200 rounded border-2 border-blue-400"></div>
        <div className="w-2/3 bg-blue-200 rounded border-2 border-blue-400"></div>
      </div>
    )
  },
  {
    id: '3-col-equal',
    name: 'Three Equal Columns',
    columns: [33.33, 33.33, 33.33],
    description: 'Three columns with equal width',
    icon: (
      <div className="flex gap-1 w-full h-8">
        <div className="flex-1 bg-blue-200 rounded border-2 border-blue-400"></div>
        <div className="flex-1 bg-blue-200 rounded border-2 border-blue-400"></div>
        <div className="flex-1 bg-blue-200 rounded border-2 border-blue-400"></div>
      </div>
    )
  },
  {
    id: '3-col-center',
    name: 'Three Columns (1:2:1)',
    columns: [25, 50, 25],
    description: 'Center column wider',
    icon: (
      <div className="flex gap-1 w-full h-8">
        <div className="w-1/4 bg-blue-200 rounded border-2 border-blue-400"></div>
        <div className="w-1/2 bg-blue-200 rounded border-2 border-blue-400"></div>
        <div className="w-1/4 bg-blue-200 rounded border-2 border-blue-400"></div>
      </div>
    )
  },
  {
    id: '4-col-equal',
    name: 'Four Equal Columns',
    columns: [25, 25, 25, 25],
    description: 'Four columns with equal width',
    icon: (
      <div className="flex gap-1 w-full h-8">
        <div className="flex-1 bg-blue-200 rounded border-2 border-blue-400"></div>
        <div className="flex-1 bg-blue-200 rounded border-2 border-blue-400"></div>
        <div className="flex-1 bg-blue-200 rounded border-2 border-blue-400"></div>
        <div className="flex-1 bg-blue-200 rounded border-2 border-blue-400"></div>
      </div>
    )
  }
];

export function SectionLayoutPanel({ onSelectLayout, onClose }: SectionLayoutPanelProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Choose Section Layout</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Layout Options */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectionLayouts.map((layout) => (
              <button
                key={layout.id}
                onClick={() => {
                  onSelectLayout(layout);
                  onClose();
                }}
                className="group p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
              >
                <div className="mb-3">
                  {layout.icon}
                </div>
                <h3 className="font-medium text-gray-900 mb-1 group-hover:text-blue-700">
                  {layout.name}
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-blue-600">
                  {layout.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <p className="text-sm text-gray-600 text-center">
            You can adjust column widths and add styling options after creating the section
          </p>
        </div>
      </div>
    </div>
  );
}