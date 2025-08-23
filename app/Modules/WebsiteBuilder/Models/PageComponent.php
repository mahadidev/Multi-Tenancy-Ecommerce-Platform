<?php

namespace App\Modules\WebsiteBuilder\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageComponent extends Model
{
    protected $fillable = [
        'section_id',
        'component_type_id',
        'name',
        'props',
        'styles',
        'sort_order',
        'is_visible',
        'responsive_settings',
        'animation_settings',
        'meta_data',
    ];

    protected $casts = [
        'props' => 'json',
        'styles' => 'json',
        'is_visible' => 'boolean',
        'responsive_settings' => 'json',
        'animation_settings' => 'json',
        'meta_data' => 'json',
    ];

    public function section(): BelongsTo
    {
        return $this->belongsTo(PageSection::class, 'section_id');
    }

    public function componentType(): BelongsTo
    {
        return $this->belongsTo(ComponentType::class, 'component_type_id');
    }

    public function scopeVisible($query)
    {
        return $query->where('is_visible', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    public function getMergedPropsAttribute(): array
    {
        $defaultProps = $this->componentType->default_props ?? [];
        $customProps = $this->props ?? [];
        
        // Handle default props
        if (!is_array($defaultProps)) {
            if (is_string($defaultProps)) {
                $decoded = json_decode($defaultProps, true);
                $defaultProps = is_array($decoded) ? $decoded : [];
            } else {
                $defaultProps = [];
            }
        }
        
        // Handle custom props with special handling for corrupted data
        if (!is_array($customProps)) {
            if (is_string($customProps)) {
                $decoded = json_decode($customProps, true);
                $customProps = is_array($decoded) ? $decoded : [];
            } else {
                $customProps = [];
            }
        } else {
            // Check if this is a corrupted array (numeric keys containing JSON string characters)
            if ($this->isCorruptedJsonArray($customProps)) {
                // Reconstruct the JSON string from the character array
                $jsonString = implode('', array_values($customProps));
                $decoded = json_decode($jsonString, true);
                $customProps = is_array($decoded) ? $decoded : [];
            }
        }
        
        return array_merge($defaultProps, $customProps);
    }
    
    /**
     * Check if an array contains corrupted JSON data (each character as array element)
     */
    private function isCorruptedJsonArray(array $data): bool
    {
        // If array has numeric keys starting from 0 and contains string characters
        if (isset($data[0]) && is_string($data[0]) && strlen($data[0]) === 1) {
            // Check if first few characters look like JSON
            $firstChars = '';
            for ($i = 0; $i < min(10, count($data)); $i++) {
                if (isset($data[$i]) && is_string($data[$i]) && strlen($data[$i]) === 1) {
                    $firstChars .= $data[$i];
                } else {
                    return false;
                }
            }
            // Check if it starts with JSON-like pattern
            return in_array($firstChars[0] ?? '', ['{', '[']) || strpos($firstChars, '{"') === 0;
        }
        return false;
    }

    public function getMergedStylesAttribute(): array
    {
        $defaultStyles = $this->componentType->styles ?? [];
        $customStyles = $this->styles ?? [];
        
        // Ensure we have arrays
        if (!is_array($defaultStyles)) {
            if (is_string($defaultStyles)) {
                // Try to decode JSON first
                $decoded = json_decode($defaultStyles, true);
                $defaultStyles = is_array($decoded) ? $decoded : $this->parseCssToArray($defaultStyles);
            } else {
                $defaultStyles = [];
            }
        }
        
        if (!is_array($customStyles)) {
            if (is_string($customStyles)) {
                // Try to decode JSON first
                $decoded = json_decode($customStyles, true);
                $customStyles = is_array($decoded) ? $decoded : $this->parseCssToArray($customStyles);
            } else {
                $customStyles = [];
            }
        }
        
        return array_merge($defaultStyles, $customStyles);
    }

    private function parseCssToArray(string $css): array
    {
        // Simple CSS parser - you might want to use a more robust solution
        $rules = [];
        $css = preg_replace('/\/\*.*?\*\//', '', $css); // Remove comments
        
        preg_match_all('/([^{]+)\s*{\s*([^}]+)\s*}/', $css, $matches);
        
        for ($i = 0; $i < count($matches[0]); $i++) {
            $selector = trim($matches[1][$i]);
            $properties = trim($matches[2][$i]);
            
            $props = [];
            foreach (explode(';', $properties) as $property) {
                if (trim($property)) {
                    list($key, $value) = explode(':', $property, 2);
                    $props[trim($key)] = trim($value);
                }
            }
            
            $rules[$selector] = $props;
        }
        
        return $rules;
    }
}