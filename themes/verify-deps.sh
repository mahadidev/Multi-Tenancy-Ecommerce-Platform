#!/bin/bash

# Dependency Verification Script
# Verifies that themes use only the root node_modules

echo "🔍 Verifying Theme Dependency Setup..."
echo ""

# Check root node_modules
if [ -d "../node_modules" ]; then
    echo "✅ Root node_modules exists"
    ROOT_DEPS=$(ls ../node_modules | wc -l)
    echo "   └── Contains $ROOT_DEPS packages"
else
    echo "❌ Root node_modules not found!"
    exit 1
fi

echo ""

# Check theme directories
for theme_dir in */; do
    if [ -d "$theme_dir" ]; then
        echo "🎨 Checking theme: ${theme_dir%/}"
        
        # Check for local node_modules (should not exist)
        if [ -d "$theme_dir/node_modules" ]; then
            echo "   ❌ Has local node_modules directory"
        elif [ -L "$theme_dir/node_modules" ]; then
            echo "   ⚠️  Has node_modules symlink"
        else
            echo "   ✅ Clean - no local dependencies"
        fi
        
        # Check for vite config
        if [ -f "$theme_dir/vite.config.ts" ]; then
            if grep -q "modules.*node_modules" "$theme_dir/vite.config.ts"; then
                echo "   ✅ Vite config properly configured for root dependencies"
            else
                echo "   ⚠️  Vite config may need dependency resolution setup"
            fi
        fi
        
        echo ""
    fi
done

echo "🎯 Summary:"
echo "   • All themes should use the single root node_modules"
echo "   • No theme should have its own node_modules directory"
echo "   • Vite configs should resolve dependencies from root"
echo ""