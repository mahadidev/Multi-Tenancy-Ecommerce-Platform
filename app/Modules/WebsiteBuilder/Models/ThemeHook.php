<?php

namespace App\Modules\WebsiteBuilder\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ThemeHook extends Model
{
    protected $fillable = [
        'name',
        'type',
        'category',
        'description',
        'parameters',
        'response_schema',
        'is_core',
        'is_active'
    ];

    protected $casts = [
        'parameters' => 'array',
        'response_schema' => 'array',
        'is_core' => 'boolean',
        'is_active' => 'boolean'
    ];

    // Hook types
    const TYPE_ACTION = 'action';
    const TYPE_FILTER = 'filter';
    const TYPE_RENDER = 'render';

    // Hook categories
    const CATEGORY_COMMERCE = 'commerce';
    const CATEGORY_AUTH = 'auth';
    const CATEGORY_CONTENT = 'content';
    const CATEGORY_UI = 'ui';
    const CATEGORY_SYSTEM = 'system';

    /**
     * Get seller settings for this hook
     */
    public function sellerSettings(): HasMany
    {
        return $this->hasMany(SellerHookSetting::class, 'hook_id');
    }

    /**
     * Get execution logs
     */
    public function executions(): HasMany
    {
        return $this->hasMany(HookExecution::class, 'hook_id');
    }

    /**
     * Check if hook is an action
     */
    public function isAction(): bool
    {
        return $this->type === self::TYPE_ACTION;
    }

    /**
     * Check if hook is a filter
     */
    public function isFilter(): bool
    {
        return $this->type === self::TYPE_FILTER;
    }

    /**
     * Check if hook is a render hook
     */
    public function isRender(): bool
    {
        return $this->type === self::TYPE_RENDER;
    }

    /**
     * Validate parameters
     */
    public function validateParameters(array $params): bool
    {
        if (empty($this->parameters)) {
            return true;
        }

        foreach ($this->parameters as $key => $rules) {
            // Check required parameters
            if (($rules['required'] ?? false) && !isset($params[$key])) {
                return false;
            }

            // Check parameter types
            if (isset($params[$key]) && isset($rules['type'])) {
                $type = gettype($params[$key]);
                $expectedType = $rules['type'];
                
                if ($type !== $expectedType && !$this->isValidType($params[$key], $expectedType)) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Check if value matches expected type
     */
    private function isValidType($value, string $expectedType): bool
    {
        switch ($expectedType) {
            case 'integer':
                return is_numeric($value);
            case 'float':
            case 'double':
                return is_numeric($value);
            case 'string':
                return is_scalar($value);
            case 'array':
                return is_array($value) || is_object($value);
            default:
                return false;
        }
    }

    /**
     * Get hook full name with type prefix
     */
    public function getFullName(): string
    {
        return "{$this->type}:{$this->name}";
    }

    /**
     * Scope for active hooks
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for core hooks
     */
    public function scopeCore($query)
    {
        return $query->where('is_core', true);
    }

    /**
     * Scope by type
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope by category
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }
}