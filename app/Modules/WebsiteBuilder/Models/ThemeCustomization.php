<?php

namespace App\Modules\WebsiteBuilder\Models;

use App\Models\Store;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ThemeCustomization extends Model
{
    protected $fillable = [
        'store_id',
        'theme_id',
        'name',
        'colors',
        'fonts',
        'spacing',
        'settings',
        'custom_css',
        'tailwind_config',
        'is_active'
    ];

    protected $casts = [
        'colors' => 'array',
        'fonts' => 'array',
        'spacing' => 'array',
        'settings' => 'array',
        'tailwind_config' => 'array',
        'is_active' => 'boolean'
    ];

    /**
     * Get the store
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Get the theme
     */
    public function theme(): BelongsTo
    {
        return $this->belongsTo(Theme::class);
    }

    /**
     * Get component styles
     */
    public function componentStyles(): HasMany
    {
        return $this->hasMany(ComponentStyle::class, 'customization_id');
    }

    /**
     * Get websites using this customization
     */
    public function websites(): HasMany
    {
        return $this->hasMany(StoreWebsite::class, 'theme_customization_id');
    }

    /**
     * Activate this customization
     */
    public function activate(): void
    {
        // Deactivate other customizations for this store and theme
        static::where('store_id', $this->store_id)
            ->where('theme_id', $this->theme_id)
            ->where('id', '!=', $this->id)
            ->update(['is_active' => false]);

        // Activate this customization
        $this->update(['is_active' => true]);

        // Update the store's website to use this customization
        StoreWebsite::where('store_id', $this->store_id)
            ->where('theme_id', $this->theme_id)
            ->update(['theme_customization_id' => $this->id]);
    }

    /**
     * Duplicate this customization
     */
    public function duplicate(string $name = null): self
    {
        $newCustomization = $this->replicate();
        $newCustomization->name = $name ?? $this->name . ' (Copy)';
        $newCustomization->is_active = false;
        $newCustomization->save();

        // Duplicate component styles
        foreach ($this->componentStyles as $style) {
            $newStyle = $style->replicate();
            $newStyle->customization_id = $newCustomization->id;
            $newStyle->save();
        }

        return $newCustomization;
    }

    /**
     * Merge with theme defaults
     */
    public function getMergedConfig(): array
    {
        $themeDefaults = $this->theme->getConfigSchema();
        
        return [
            'colors' => array_merge(
                $this->extractDefaults($themeDefaults['colors'] ?? []),
                $this->colors ?? []
            ),
            'fonts' => array_merge(
                $this->extractDefaults($themeDefaults['fonts'] ?? []),
                $this->fonts ?? []
            ),
            'spacing' => array_merge(
                $this->extractDefaults($themeDefaults['spacing'] ?? []),
                $this->spacing ?? []
            ),
            'settings' => array_merge(
                $this->extractDefaults($themeDefaults['layout'] ?? []),
                $this->settings ?? []
            ),
        ];
    }

    /**
     * Extract default values from schema
     */
    private function extractDefaults(array $schema): array
    {
        $defaults = [];
        foreach ($schema as $key => $config) {
            $defaults[$key] = $config['default'] ?? null;
        }
        return $defaults;
    }

    /**
     * Generate CSS variables
     */
    public function generateCssVariables(): string
    {
        $config = $this->getMergedConfig();
        $css = ":root {\n";

        // Colors
        foreach ($config['colors'] as $key => $value) {
            $css .= "  --theme-color-{$key}: {$value};\n";
        }

        // Fonts
        foreach ($config['fonts'] as $key => $value) {
            $css .= "  --theme-font-{$key}: '{$value}';\n";
        }

        // Spacing
        foreach ($config['spacing'] as $key => $value) {
            $css .= "  --theme-spacing-{$key}: {$value};\n";
        }

        $css .= "}\n";

        // Add custom CSS
        if ($this->custom_css) {
            $css .= "\n" . $this->custom_css;
        }

        return $css;
    }

    /**
     * Get Tailwind config for this customization
     */
    public function getTailwindConfig(): array
    {
        $config = $this->getMergedConfig();
        
        return array_merge([
            'theme' => [
                'extend' => [
                    'colors' => $this->mapColorsToTailwind($config['colors']),
                    'fontFamily' => $this->mapFontsToTailwind($config['fonts']),
                    'spacing' => $config['spacing'] ?? []
                ]
            ]
        ], $this->tailwind_config ?? []);
    }

    /**
     * Map colors to Tailwind format
     */
    private function mapColorsToTailwind(array $colors): array
    {
        $tailwindColors = [];
        foreach ($colors as $key => $value) {
            $tailwindColors[$key] = $value;
        }
        return $tailwindColors;
    }

    /**
     * Map fonts to Tailwind format
     */
    private function mapFontsToTailwind(array $fonts): array
    {
        $tailwindFonts = [];
        foreach ($fonts as $key => $value) {
            $tailwindFonts[$key] = [$value, 'sans-serif'];
        }
        return $tailwindFonts;
    }

    /**
     * Scope for active customizations
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}