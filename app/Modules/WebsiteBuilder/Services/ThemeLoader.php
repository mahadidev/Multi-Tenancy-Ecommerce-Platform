<?php

namespace App\Modules\WebsiteBuilder\Services;

use App\Modules\WebsiteBuilder\Models\Theme;
use App\Modules\WebsiteBuilder\Models\ThemeCustomization;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Cache;

class ThemeLoader
{
    protected string $themesPath;
    protected array $loadedThemes = [];

    public function __construct()
    {
        $this->themesPath = resource_path('themes');
    }

    /**
     * Load theme configuration from filesystem
     */
    public function loadTheme(string $slug): array
    {
        if (isset($this->loadedThemes[$slug])) {
            return $this->loadedThemes[$slug];
        }

        $themePath = $this->themesPath . '/' . $slug;

        if (!File::exists($themePath)) {
            throw new \Exception("Theme {$slug} not found in filesystem");
        }

        $config = $this->loadThemeConfig($themePath);
        $this->loadedThemes[$slug] = $config;

        return $config;
    }

    /**
     * Load theme configuration file
     */
    protected function loadThemeConfig(string $themePath): array
    {
        $configPath = $themePath . '/theme.json';

        if (!File::exists($configPath)) {
            throw new \Exception("Theme configuration not found");
        }

        $config = json_decode(File::get($configPath), true);

        // Load additional theme assets
        $config['layouts'] = $this->loadLayouts($themePath);
        $config['components'] = $this->loadComponents($themePath);
        $config['sections'] = $this->loadSections($themePath);
        $config['presets'] = $this->loadPresets($themePath);

        return $config;
    }

    /**
     * Load theme layouts
     */
    protected function loadLayouts(string $themePath): array
    {
        $layoutsPath = $themePath . '/layouts';
        $layouts = [];

        if (File::exists($layoutsPath)) {
            foreach (File::files($layoutsPath) as $file) {
                $name = pathinfo($file->getFilename(), PATHINFO_FILENAME);
                $layouts[$name] = [
                    'name' => $name,
                    'path' => $file->getPathname(),
                    'content' => File::get($file)
                ];
            }
        }

        return $layouts;
    }

    /**
     * Load theme components
     */
    protected function loadComponents(string $themePath): array
    {
        $componentsPath = $themePath . '/components';
        $components = [];

        if (File::exists($componentsPath)) {
            foreach (File::allFiles($componentsPath) as $file) {
                $relativePath = str_replace($componentsPath . '/', '', $file->getPathname());
                $name = str_replace(['/', '.tsx', '.jsx'], ['.', '', ''], $relativePath);
                
                $components[$name] = [
                    'name' => $name,
                    'path' => $file->getPathname(),
                    'type' => $this->getComponentType($name),
                    'props' => $this->extractComponentProps($file->getPathname())
                ];
            }
        }

        return $components;
    }

    /**
     * Load theme sections
     */
    protected function loadSections(string $themePath): array
    {
        $sectionsPath = $themePath . '/sections';
        $sections = [];

        if (File::exists($sectionsPath)) {
            foreach (File::directories($sectionsPath) as $dir) {
                $sectionName = basename($dir);
                $configPath = $dir . '/config.json';
                
                $sections[$sectionName] = [
                    'name' => $sectionName,
                    'config' => File::exists($configPath) ? json_decode(File::get($configPath), true) : [],
                    'components' => $this->loadSectionComponents($dir)
                ];
            }
        }

        return $sections;
    }

    /**
     * Load section components
     */
    protected function loadSectionComponents(string $sectionPath): array
    {
        $components = [];

        foreach (File::files($sectionPath) as $file) {
            if (in_array($file->getExtension(), ['tsx', 'jsx'])) {
                $name = pathinfo($file->getFilename(), PATHINFO_FILENAME);
                $components[$name] = [
                    'name' => $name,
                    'path' => $file->getPathname()
                ];
            }
        }

        return $components;
    }

    /**
     * Load theme presets
     */
    protected function loadPresets(string $themePath): array
    {
        $presetsPath = $themePath . '/presets';
        $presets = [];

        if (File::exists($presetsPath)) {
            foreach (File::files($presetsPath) as $file) {
                if ($file->getExtension() === 'json') {
                    $name = pathinfo($file->getFilename(), PATHINFO_FILENAME);
                    $presets[$name] = json_decode(File::get($file), true);
                }
            }
        }

        return $presets;
    }

    /**
     * Get component type from name
     */
    protected function getComponentType(string $name): string
    {
        if (str_starts_with($name, 'widgets.')) {
            return 'widget';
        } elseif (str_starts_with($name, 'sections.')) {
            return 'section';
        } elseif (str_starts_with($name, 'layouts.')) {
            return 'layout';
        }
        
        return 'component';
    }

    /**
     * Extract component props from file
     */
    protected function extractComponentProps(string $filePath): array
    {
        // Parse TypeScript/React component to extract prop types
        // This is a simplified version - you might want to use a proper parser
        $content = File::get($filePath);
        $props = [];

        // Look for interface Props or type Props
        if (preg_match('/(?:interface|type)\s+\w*Props\s*(?:=\s*)?\{([^}]+)\}/s', $content, $matches)) {
            $propsString = $matches[1];
            
            // Extract individual props
            preg_match_all('/(\w+)(?:\?)?:\s*([^;,\n]+)/s', $propsString, $propMatches);
            
            foreach ($propMatches[1] as $index => $propName) {
                $props[$propName] = [
                    'type' => trim($propMatches[2][$index]),
                    'required' => !str_contains($propMatches[0][$index], '?')
                ];
            }
        }

        return $props;
    }

    /**
     * Get theme manifest for API response
     */
    public function getThemeManifest(string $slug): array
    {
        $theme = $this->loadTheme($slug);

        return [
            'slug' => $slug,
            'name' => $theme['name'] ?? $slug,
            'version' => $theme['version'] ?? '1.0.0',
            'components' => array_keys($theme['components'] ?? []),
            'sections' => array_keys($theme['sections'] ?? []),
            'layouts' => array_keys($theme['layouts'] ?? []),
            'presets' => array_keys($theme['presets'] ?? []),
            'hooks' => $theme['hooks'] ?? [],
            'config_schema' => $theme['config_schema'] ?? []
        ];
    }

    /**
     * Install theme files from upload
     */
    public function installThemeFiles(string $zipPath, string $slug): void
    {
        $themePath = $this->themesPath . '/' . $slug;

        // Extract theme files
        $zip = new \ZipArchive();
        if ($zip->open($zipPath) === true) {
            $zip->extractTo($themePath);
            $zip->close();
        } else {
            throw new \Exception("Failed to extract theme files");
        }

        // Validate theme structure
        $this->validateThemeStructure($themePath);

        // Clear cache
        Cache::tags(['themes'])->flush();
    }

    /**
     * Validate theme structure
     */
    protected function validateThemeStructure(string $themePath): void
    {
        $requiredFiles = ['theme.json'];
        $requiredDirs = ['layouts', 'components'];

        foreach ($requiredFiles as $file) {
            if (!File::exists($themePath . '/' . $file)) {
                throw new \Exception("Required file {$file} not found in theme");
            }
        }

        foreach ($requiredDirs as $dir) {
            if (!File::isDirectory($themePath . '/' . $dir)) {
                throw new \Exception("Required directory {$dir} not found in theme");
            }
        }

        // Validate theme.json
        $config = json_decode(File::get($themePath . '/theme.json'), true);
        
        if (!isset($config['name']) || !isset($config['version'])) {
            throw new \Exception("Invalid theme configuration");
        }
    }

    /**
     * Get theme asset URL
     */
    public function getAssetUrl(string $themeSlug, string $assetPath): string
    {
        return asset("themes/{$themeSlug}/{$assetPath}");
    }

    /**
     * Compile theme styles with customization
     */
    public function compileStyles(Theme $theme, ThemeCustomization $customization): string
    {
        $baseStyles = $this->loadThemeStyles($theme->slug);
        $customStyles = $customization->generateCssVariables();
        $componentStyles = $this->compileComponentStyles($customization);

        return $baseStyles . "\n" . $customStyles . "\n" . $componentStyles;
    }

    /**
     * Load base theme styles
     */
    protected function loadThemeStyles(string $slug): string
    {
        $stylesPath = $this->themesPath . '/' . $slug . '/assets/styles/main.css';
        
        if (File::exists($stylesPath)) {
            return File::get($stylesPath);
        }

        return '';
    }

    /**
     * Compile component-specific styles
     */
    protected function compileComponentStyles(ThemeCustomization $customization): string
    {
        $styles = '';

        foreach ($customization->componentStyles as $componentStyle) {
            $selector = $this->getComponentSelector($componentStyle->component_path);
            
            if ($componentStyle->tailwind_classes) {
                // These would be processed by Tailwind at build time
                $styles .= "/* {$selector}: {$componentStyle->tailwind_classes} */\n";
            }
            
            if ($componentStyle->custom_css) {
                $styles .= "{$selector} {\n{$componentStyle->custom_css}\n}\n";
            }
        }

        return $styles;
    }

    /**
     * Get CSS selector for component path
     */
    protected function getComponentSelector(string $componentPath): string
    {
        // Convert component path to CSS selector
        // e.g., "sections.hero.title" -> "[data-component='sections.hero.title']"
        return "[data-component='{$componentPath}']";
    }
}