<?php

namespace App\Modules\WebsiteBuilder\Services;

use App\Modules\WebsiteBuilder\Models\ComponentType;
use App\Modules\WebsiteBuilder\Models\PageComponent;
use App\Modules\WebsiteBuilder\Models\PageSection;
use Illuminate\Support\Facades\Cache;

class ComponentService
{
    /**
     * Get or create component type
     */
    public function getOrCreateComponentType(string $typeName, array $config = []): ComponentType
    {
        $componentType = ComponentType::where('name', $typeName)->first();
        
        if (!$componentType) {
            $componentType = $this->createComponentType($typeName, $config);
        }
        
        return $componentType;
    }

    /**
     * Create a new component type
     */
    protected function createComponentType(string $typeName, array $config = []): ComponentType
    {
        $defaultConfig = $this->getDefaultComponentConfig($typeName);
        $finalConfig = array_merge($defaultConfig, $config);

        return ComponentType::create([
            'name' => $typeName,
            'display_name' => $finalConfig['display_name'],
            'description' => $finalConfig['description'],
            'icon' => $finalConfig['icon'],
            'category' => $finalConfig['category'],
            'props_schema' => $finalConfig['props_schema'],
            'is_active' => true
        ]);
    }

    /**
     * Get default configuration for common component types
     */
    protected function getDefaultComponentConfig(string $typeName): array
    {
        $configs = [
            'text' => [
                'display_name' => 'Text',
                'description' => 'Rich text content',
                'icon' => 'type',
                'category' => 'basic',
                'props_schema' => ['type' => 'object', 'properties' => []]
            ],
            'product-grid' => [
                'display_name' => 'Product Grid',
                'description' => 'Grid layout displaying products',
                'icon' => 'grid',
                'category' => 'ecommerce',
                'props_schema' => ['type' => 'object', 'properties' => []]
            ],
            'hero-banner' => [
                'display_name' => 'Hero Banner',
                'description' => 'Large hero section',
                'icon' => 'layout',
                'category' => 'hero',
                'props_schema' => ['type' => 'object', 'properties' => []]
            ]
        ];

        return $configs[$typeName] ?? [
            'display_name' => ucwords(str_replace(['-', '_'], ' ', $typeName)),
            'description' => "Component type: {$typeName}",
            'icon' => 'component',
            'category' => 'custom',
            'props_schema' => ['type' => 'object', 'properties' => []]
        ];
    }

    /**
     * Create component in section
     */
    public function createComponent(PageSection $section, array $componentData): PageComponent
    {
        $componentType = $this->getOrCreateComponentType($componentData['type']);
        
        return PageComponent::create([
            'section_id' => $section->id,
            'component_type_id' => $componentType->id,
            'name' => $componentData['name'] ?? $componentData['type'],
            'sort_order' => $componentData['sort_order'] ?? 0,
            'is_visible' => $componentData['is_visible'] ?? true,
            'props' => $componentData['props'] ?? [],
            'styles' => $componentData['styles'] ?? [],
            'responsive_settings' => $componentData['responsive_settings'] ?? [],
            'animation_settings' => $componentData['animation_settings'] ?? []
        ]);
    }

    /**
     * Add component to a section (alias for createComponent, but with data validation)
     */
    public function addComponent(array $data): PageComponent
    {
        // Ensure required fields are present
        if (!isset($data['section_id'])) {
            throw new \InvalidArgumentException('section_id is required');
        }
        
        if (!isset($data['component_type_id']) && !isset($data['type'])) {
            throw new \InvalidArgumentException('component_type_id or type is required');
        }
        
        // Get the section
        $section = PageSection::findOrFail($data['section_id']);
        
        // If component_type_id is provided, use it; otherwise, use type to get/create the component type
        if (isset($data['component_type_id'])) {
            $componentType = ComponentType::findOrFail($data['component_type_id']);
        } else {
            $componentType = $this->getOrCreateComponentType($data['type']);
        }
        
        // Create the component
        return PageComponent::create([
            'section_id' => $section->id,
            'component_type_id' => $componentType->id,
            'name' => $data['name'] ?? $componentType->display_name,
            'sort_order' => $data['sort_order'] ?? 999,
            'is_visible' => $data['is_visible'] ?? true,
            'props' => $data['props'] ?? [],
            'styles' => $data['styles'] ?? [],
            'responsive_settings' => $data['responsive_settings'] ?? [],
            'animation_settings' => $data['animation_settings'] ?? [],
            'meta_data' => $data['meta_data'] ?? []
        ]);
    }

    /**
     * Update existing component
     * @param PageComponent|int $componentOrId - Can accept either a PageComponent instance or an ID
     */
    public function updateComponent($componentOrId, array $data): PageComponent
    {
        // Handle both PageComponent object and ID
        if ($componentOrId instanceof PageComponent) {
            $component = $componentOrId;
        } else {
            $component = PageComponent::findOrFail($componentOrId);
        }
        
        // Build update array with only provided fields
        $updateData = [];
        
        // Only update fields that are explicitly provided in the data array
        if (array_key_exists('name', $data)) {
            $updateData['name'] = $data['name'];
        }
        
        if (array_key_exists('sort_order', $data)) {
            $updateData['sort_order'] = $data['sort_order'];
        }
        
        if (array_key_exists('is_visible', $data)) {
            $updateData['is_visible'] = $data['is_visible'];
        }
        
        if (array_key_exists('props', $data)) {
            // If props is a string (JSON), decode it first
            $props = is_string($data['props']) ? json_decode($data['props'], true) : $data['props'];
            // Merge with existing props to preserve unmodified properties
            $updateData['props'] = array_merge($component->props ?? [], $props ?? []);
        }
        
        if (array_key_exists('styles', $data)) {
            // If styles is a string (JSON), decode it first
            $styles = is_string($data['styles']) ? json_decode($data['styles'], true) : $data['styles'];
            // Merge with existing styles to preserve unmodified properties
            $updateData['styles'] = array_merge($component->styles ?? [], $styles ?? []);
        }
        
        if (array_key_exists('responsive_settings', $data)) {
            $responsive = is_string($data['responsive_settings']) ? json_decode($data['responsive_settings'], true) : $data['responsive_settings'];
            $updateData['responsive_settings'] = array_merge($component->responsive_settings ?? [], $responsive ?? []);
        }
        
        if (array_key_exists('animation_settings', $data)) {
            $animations = is_string($data['animation_settings']) ? json_decode($data['animation_settings'], true) : $data['animation_settings'];
            $updateData['animation_settings'] = array_merge($component->animation_settings ?? [], $animations ?? []);
        }
        
        if (array_key_exists('meta_data', $data)) {
            $metaData = is_string($data['meta_data']) ? json_decode($data['meta_data'], true) : $data['meta_data'];
            $updateData['meta_data'] = array_merge($component->meta_data ?? [], $metaData ?? []);
        }
        
        // Only update if there's actually something to update
        if (!empty($updateData)) {
            $component->update($updateData);
        }
        
        return $component->fresh();
    }

    /**
     * Delete component
     */
    public function deleteComponent(int $componentId): bool
    {
        $component = PageComponent::find($componentId);
        
        if (!$component) {
            return false;
        }
        
        return $component->delete();
    }

    /**
     * Duplicate component
     * @param PageComponent|int $componentOrId - Can accept either a PageComponent instance or an ID
     */
    public function duplicateComponent($componentOrId): PageComponent
    {
        // Handle both PageComponent object and ID
        if ($componentOrId instanceof PageComponent) {
            $originalComponent = $componentOrId;
        } else {
            $originalComponent = PageComponent::findOrFail($componentOrId);
        }
        
        $newComponent = $originalComponent->replicate();
        $newComponent->name = $originalComponent->name . ' (Copy)';
        $newComponent->sort_order = $originalComponent->sort_order + 1;
        $newComponent->save();
        
        return $newComponent;
    }

    /**
     * Move component to different section
     * @param PageComponent $component - The component to move
     * @param PageSection $targetSection - The target section
     * @param int $targetPosition - The position in the target section
     */
    public function moveComponent(PageComponent $component, PageSection $targetSection, int $targetPosition): PageComponent
    {
        $component->section_id = $targetSection->id;
        $component->sort_order = $targetPosition;
        $component->save();
        
        return $component;
    }

    /**
     * Reorder components in a section
     * @param PageSection $section - The section containing the components
     * @param array $components - Array of components with their new order
     */
    public function reorderComponents(PageSection $section, array $components): void
    {
        foreach ($components as $componentData) {
            PageComponent::where('id', $componentData['id'])
                ->where('section_id', $section->id)
                ->update(['sort_order' => $componentData['sort_order']]);
        }
    }

    /**
     * Get all components for a section
     */
    public function getSectionComponents(int $sectionId): \Illuminate\Support\Collection
    {
        return PageComponent::where('section_id', $sectionId)
            ->with('componentType')
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * Get all available component types
     */
    public function getAvailableComponentTypes(): \Illuminate\Support\Collection
    {
        return Cache::remember('component_types_all', 3600, function () {
            return ComponentType::where('is_active', true)
                ->orderBy('category')
                ->orderBy('display_name')
                ->get(['id', 'name', 'display_name', 'description', 'icon', 'category', 'props_schema']);
        });
    }

    /**
     * Clear component type cache
     */
    public function clearComponentTypeCache(): void
    {
        Cache::forget('component_types_all');
    }
}