<?php

namespace App\Modules\WebsiteBuilder\Services;

use App\Modules\WebsiteBuilder\Models\PageComponent;
use App\Modules\WebsiteBuilder\Models\PageSection;
use App\Modules\WebsiteBuilder\Models\ComponentType;
use Illuminate\Support\Facades\DB;

class ComponentService
{
    public function addComponent(array $data): PageComponent
    {
        return DB::transaction(function () use ($data) {
            // Set sort order if not provided
            if (!isset($data['sort_order'])) {
                $maxOrder = PageComponent::where('section_id', $data['section_id'])
                    ->max('sort_order') ?? 0;
                $data['sort_order'] = $maxOrder + 1;
            }

            // Merge default props with provided props
            $componentType = ComponentType::find($data['component_type_id']);
            if ($componentType && $componentType->default_props) {
                // Decode JSON string to array if needed
                $providedProps = $data['props'] ?? '{}';
                if (is_string($providedProps)) {
                    $providedProps = json_decode($providedProps, true) ?? [];
                }
                
                $data['props'] = json_encode(array_merge(
                    $componentType->default_props, 
                    $providedProps
                ));
            }

            return PageComponent::create($data);
        });
    }

    public function updateComponent(PageComponent $component, array $data): PageComponent
    {
        $component->update($data);
        return $component->load(['componentType', 'section']);
    }

    public function duplicateComponent(PageComponent $component): PageComponent
    {
        return DB::transaction(function () use ($component) {
            $componentData = $component->toArray();
            unset($componentData['id'], $componentData['created_at'], $componentData['updated_at']);
            
            $componentData['name'] = ($component->name ?? 'Component') . ' Copy';
            
            // Set new sort order
            $maxOrder = PageComponent::where('section_id', $component->section_id)
                ->max('sort_order') ?? 0;
            $componentData['sort_order'] = $maxOrder + 1;

            return PageComponent::create($componentData);
        });
    }

    public function reorderComponents(PageSection $section, array $components): void
    {
        DB::transaction(function () use ($components) {
            foreach ($components as $componentData) {
                PageComponent::where('id', $componentData['id'])
                    ->update(['sort_order' => $componentData['sort_order']]);
            }
        });
    }

    public function moveComponent(PageComponent $component, PageSection $targetSection, int $targetPosition): PageComponent
    {
        return DB::transaction(function () use ($component, $targetSection, $targetPosition) {
            $oldSectionId = $component->section_id;
            
            // If moving to a different section
            if ($oldSectionId !== $targetSection->id) {
                // Update component's section
                $component->update([
                    'section_id' => $targetSection->id,
                    'sort_order' => $targetPosition
                ]);

                // Reorder components in the old section
                $this->reorderComponentsAfterRemoval($oldSectionId, $component->sort_order);
                
                // Reorder components in the new section
                $this->reorderComponentsAfterInsertion($targetSection->id, $targetPosition, $component->id);
            } else {
                // Moving within the same section
                $oldPosition = $component->sort_order;
                
                if ($oldPosition !== $targetPosition) {
                    $component->update(['sort_order' => $targetPosition]);
                    
                    // Adjust other components
                    if ($oldPosition < $targetPosition) {
                        // Moving down
                        PageComponent::where('section_id', $targetSection->id)
                            ->where('id', '!=', $component->id)
                            ->whereBetween('sort_order', [$oldPosition + 1, $targetPosition])
                            ->decrement('sort_order');
                    } else {
                        // Moving up
                        PageComponent::where('section_id', $targetSection->id)
                            ->where('id', '!=', $component->id)
                            ->whereBetween('sort_order', [$targetPosition, $oldPosition - 1])
                            ->increment('sort_order');
                    }
                }
            }

            return $component->load(['componentType', 'section']);
        });
    }

    private function reorderComponentsAfterRemoval(int $sectionId, int $removedPosition): void
    {
        PageComponent::where('section_id', $sectionId)
            ->where('sort_order', '>', $removedPosition)
            ->decrement('sort_order');
    }

    private function reorderComponentsAfterInsertion(int $sectionId, int $insertPosition, int $excludeComponentId): void
    {
        PageComponent::where('section_id', $sectionId)
            ->where('id', '!=', $excludeComponentId)
            ->where('sort_order', '>=', $insertPosition)
            ->increment('sort_order');
    }

    public function getComponentPreview(int $componentTypeId, array $props = []): string
    {
        $componentType = ComponentType::findOrFail($componentTypeId);
        
        // Merge default props with provided props
        $mergedProps = array_merge($componentType->default_props ?? [], $props);
        
        // Simple template rendering (you might want to use a more sophisticated template engine)
        $template = $componentType->template ?? '<div>Component Preview</div>';
        
        // Replace template variables with actual values
        foreach ($mergedProps as $key => $value) {
            $placeholder = '{{' . $key . '}}';
            $template = str_replace($placeholder, $value, $template);
        }
        
        return $template;
    }

    public function validateComponentProps(int $componentTypeId, array $props): array
    {
        $componentType = ComponentType::findOrFail($componentTypeId);
        $schema = $componentType->schema ?? [];
        
        $validatedProps = [];
        $errors = [];
        
        if (isset($schema['properties'])) {
            foreach ($schema['properties'] as $propName => $propSchema) {
                $value = $props[$propName] ?? null;
                
                // Required field validation
                if (($schema['required'] ?? []) && in_array($propName, $schema['required']) && empty($value)) {
                    $errors[$propName] = "Field {$propName} is required";
                    continue;
                }
                
                // Type validation
                if ($value !== null && isset($propSchema['type'])) {
                    $isValid = $this->validatePropType($value, $propSchema['type']);
                    if (!$isValid) {
                        $errors[$propName] = "Field {$propName} must be of type {$propSchema['type']}";
                        continue;
                    }
                }
                
                $validatedProps[$propName] = $value;
            }
        }
        
        return [
            'valid' => empty($errors),
            'props' => $validatedProps,
            'errors' => $errors
        ];
    }

    private function validatePropType($value, string $expectedType): bool
    {
        switch ($expectedType) {
            case 'string':
                return is_string($value);
            case 'number':
            case 'integer':
                return is_numeric($value);
            case 'boolean':
                return is_bool($value);
            case 'array':
                return is_array($value);
            case 'object':
                return is_object($value) || is_array($value);
            default:
                return true;
        }
    }
}