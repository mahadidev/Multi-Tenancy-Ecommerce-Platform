<?php

namespace App\Modules\WebsiteBuilder\Services;

use App\Modules\WebsiteBuilder\Models\Theme;
use App\Modules\WebsiteBuilder\Models\SellerTheme;
use App\Modules\WebsiteBuilder\Models\ThemeCustomization;
use App\Modules\WebsiteBuilder\Models\StoreWebsite;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Collection;

class ThemeService
{
    protected HookService $hookService;
    protected ThemeLoader $themeLoader;

    public function __construct(HookService $hookService, ThemeLoader $themeLoader)
    {
        $this->hookService = $hookService;
        $this->themeLoader = $themeLoader;
    }

    /**
     * Get all available themes
     */
    public function getAvailableThemes(array $filters = []): Collection
    {
        $query = Theme::active();

        if (isset($filters['category'])) {
            $query->byCategory($filters['category']);
        }

        if (isset($filters['price'])) {
            if ($filters['price'] === 'free') {
                $query->free();
            } elseif ($filters['price'] === 'premium') {
                $query->premium();
            }
        }

        if (isset($filters['featured'])) {
            $query->featured();
        }

        return $query->orderBy('name', 'asc')
                    ->get();
    }

    /**
     * Install theme for seller
     */
    public function installTheme(int $sellerId, int $themeId, array $licenseData = null): SellerTheme
    {
        return DB::transaction(function () use ($sellerId, $themeId, $licenseData) {
            $theme = Theme::findOrFail($themeId);

            // Check if theme requires license
            if (!$theme->isFree() && !$this->validateLicense($licenseData)) {
                throw new \Exception('Valid license required for premium theme');
            }

            // Create or update seller theme installation
            $sellerTheme = SellerTheme::updateOrCreate(
                [
                    'seller_id' => $sellerId,
                    'theme_id' => $themeId
                ],
                [
                    'license_data' => $licenseData
                ]
            );

            // Create default customization
            $this->createDefaultCustomization($sellerId, $themeId);

            // Increment installation count
            $theme->incrementInstallations();

            // Register theme hooks for seller
            $this->hookService->registerThemeHooks($sellerId, $theme);

            return $sellerTheme;
        });
    }

    /**
     * Activate theme for seller
     */
    public function activateTheme(int $sellerId, int $themeId): void
    {
        DB::transaction(function () use ($sellerId, $themeId) {
            $sellerTheme = SellerTheme::where('seller_id', $sellerId)
                ->where('theme_id', $themeId)
                ->firstOrFail();

            // Check license validity
            if (!$sellerTheme->hasValidLicense()) {
                throw new \Exception('Theme license has expired');
            }

            // Activate the theme
            $sellerTheme->activate();

            // Update store website
            $store = \App\Models\Seller::find($sellerId)->store;
            StoreWebsite::where('store_id', $store->id)
                ->update(['theme_id' => $themeId]);

            // Clear theme cache
            $this->clearThemeCache($sellerId);
        });
    }

    /**
     * Create default customization for theme
     */
    protected function createDefaultCustomization(int $sellerId, int $themeId): ThemeCustomization
    {
        $theme = Theme::findOrFail($themeId);
        $defaults = $theme->getConfigSchema();

        return ThemeCustomization::create([
            'seller_id' => $sellerId,
            'theme_id' => $themeId,
            'name' => 'Default',
            'colors' => $this->extractDefaults($defaults['colors'] ?? []),
            'fonts' => $this->extractDefaults($defaults['fonts'] ?? []),
            'spacing' => $this->extractDefaults($defaults['spacing'] ?? []),
            'settings' => $this->extractDefaults($defaults['layout'] ?? []),
            'is_active' => true
        ]);
    }

    /**
     * Extract default values from schema
     */
    protected function extractDefaults(array $schema): array
    {
        $defaults = [];
        foreach ($schema as $key => $config) {
            $defaults[$key] = $config['default'] ?? null;
        }
        return $defaults;
    }

    /**
     * Get active theme for seller
     */
    public function getActiveTheme(int $sellerId): ?Theme
    {
        return Cache::remember("seller_theme_{$sellerId}", 3600, function () use ($sellerId) {
            $sellerTheme = SellerTheme::where('seller_id', $sellerId)
                ->where('is_active', true)
                ->with('theme')
                ->first();

            return $sellerTheme?->theme;
        });
    }

    /**
     * Get theme customization for seller
     */
    public function getActiveCustomization(int $sellerId, int $themeId): ?ThemeCustomization
    {
        return Cache::remember("theme_customization_{$sellerId}_{$themeId}", 3600, function () use ($sellerId, $themeId) {
            return ThemeCustomization::where('seller_id', $sellerId)
                ->where('theme_id', $themeId)
                ->where('is_active', true)
                ->with('componentStyles')
                ->first();
        });
    }

    /**
     * Update theme customization
     */
    public function updateCustomization(int $customizationId, array $data): ThemeCustomization
    {
        $customization = ThemeCustomization::findOrFail($customizationId);

        $customization->update([
            'colors' => $data['colors'] ?? $customization->colors,
            'fonts' => $data['fonts'] ?? $customization->fonts,
            'spacing' => $data['spacing'] ?? $customization->spacing,
            'settings' => $data['settings'] ?? $customization->settings,
            'custom_css' => $data['custom_css'] ?? $customization->custom_css,
            'tailwind_config' => $data['tailwind_config'] ?? $customization->tailwind_config,
        ]);

        // Clear cache
        $this->clearThemeCache($customization->seller_id);

        return $customization;
    }

    /**
     * Duplicate theme customization
     */
    public function duplicateCustomization(int $customizationId, string $name): ThemeCustomization
    {
        $original = ThemeCustomization::findOrFail($customizationId);
        return $original->duplicate($name);
    }

    /**
     * Switch theme customization
     */
    public function switchCustomization(int $sellerId, int $customizationId): void
    {
        $customization = ThemeCustomization::where('seller_id', $sellerId)
            ->where('id', $customizationId)
            ->firstOrFail();

        $customization->activate();
        $this->clearThemeCache($sellerId);
    }

    /**
     * Validate theme license
     */
    protected function validateLicense(?array $licenseData): bool
    {
        if (!$licenseData) {
            return false;
        }

        // Implement license validation logic
        // This could involve checking with a license server
        return isset($licenseData['key']) && !empty($licenseData['key']);
    }

    /**
     * Clear theme cache for seller
     */
    protected function clearThemeCache(int $sellerId): void
    {
        Cache::forget("seller_theme_{$sellerId}");
        Cache::forget("theme_customization_{$sellerId}_*");
        Cache::tags(["seller_{$sellerId}_theme"])->flush();
    }

    /**
     * Get theme configuration for renderer
     */
    public function getThemeConfig(int $sellerId): array
    {
        $theme = $this->getActiveTheme($sellerId);
        
        if (!$theme) {
            return $this->getDefaultConfig();
        }

        $customization = $this->getActiveCustomization($sellerId, $theme->id);

        return [
            'theme' => [
                'id' => $theme->id,
                'slug' => $theme->slug,
                'name' => $theme->name,
                'version' => $theme->version,
                'components' => $theme->components,
                'layouts' => $theme->layouts,
                'hooks' => $theme->hooks_manifest
            ],
            'customization' => $customization ? [
                'id' => $customization->id,
                'colors' => $customization->getMergedConfig()['colors'],
                'fonts' => $customization->getMergedConfig()['fonts'],
                'spacing' => $customization->getMergedConfig()['spacing'],
                'settings' => $customization->getMergedConfig()['settings'],
                'css_variables' => $customization->generateCssVariables(),
                'tailwind_config' => $customization->getTailwindConfig(),
                'component_styles' => $customization->componentStyles->keyBy('component_path')
            ] : null
        ];
    }

    /**
     * Get default configuration
     */
    protected function getDefaultConfig(): array
    {
        return [
            'theme' => [
                'id' => 'default',
                'slug' => 'default',
                'name' => 'Default Theme',
                'version' => '1.0.0',
                'components' => [],
                'layouts' => ['default'],
                'hooks' => []
            ],
            'customization' => null
        ];
    }
}