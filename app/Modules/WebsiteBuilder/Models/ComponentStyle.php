<?php

namespace App\Modules\WebsiteBuilder\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComponentStyle extends Model
{
    protected $fillable = [
        'customization_id',
        'component_path',
        'element_identifier',
        'tailwind_classes',
        'custom_css',
        'responsive_classes',
        'priority'
    ];

    protected $casts = [
        'responsive_classes' => 'array',
        'priority' => 'integer'
    ];

    /**
     * Get the customization
     */
    public function customization(): BelongsTo
    {
        return $this->belongsTo(ThemeCustomization::class, 'customization_id');
    }

    /**
     * Get merged classes for all breakpoints
     */
    public function getMergedClasses(): array
    {
        $baseClasses = $this->tailwind_classes ?? '';
        $responsive = $this->responsive_classes ?? [];

        return [
            'base' => $baseClasses,
            'sm' => $responsive['sm'] ?? '',
            'md' => $responsive['md'] ?? '',
            'lg' => $responsive['lg'] ?? '',
            'xl' => $responsive['xl'] ?? '',
            '2xl' => $responsive['2xl'] ?? ''
        ];
    }

    /**
     * Get compiled Tailwind classes
     */
    public function getCompiledClasses(): string
    {
        $classes = [$this->tailwind_classes];

        foreach ($this->responsive_classes ?? [] as $breakpoint => $breakpointClasses) {
            if ($breakpointClasses) {
                $prefixedClasses = array_map(function($class) use ($breakpoint) {
                    return "{$breakpoint}:{$class}";
                }, explode(' ', $breakpointClasses));
                $classes = array_merge($classes, $prefixedClasses);
            }
        }

        return implode(' ', array_filter($classes));
    }

    /**
     * Scope by component path
     */
    public function scopeByPath($query, string $path)
    {
        return $query->where('component_path', $path);
    }

    /**
     * Scope ordered by priority
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('priority', 'desc');
    }
}