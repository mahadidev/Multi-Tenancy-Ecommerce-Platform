<?php

namespace App\Modules\WebsiteBuilder\Services;

use App\Modules\WebsiteBuilder\Models\WebsitePage;
use App\Modules\WebsiteBuilder\Models\StoreWebsite;
use App\Modules\WebsiteBuilder\Models\PageSection;
use App\Modules\WebsiteBuilder\Models\PageComponent;
use Illuminate\Support\Facades\DB;

class PageService
{
    public function createPage(array $data): WebsitePage
    {
        return DB::transaction(function () use ($data) {
            // Handle homepage logic
            if (!empty($data['is_homepage'])) {
                WebsitePage::where('website_id', $data['website_id'])
                    ->update(['is_homepage' => false]);
            }

            // Set sort order if not provided
            if (!isset($data['sort_order'])) {
                $maxOrder = WebsitePage::where('website_id', $data['website_id'])
                    ->max('sort_order') ?? 0;
                $data['sort_order'] = $maxOrder + 1;
            }

            $page = WebsitePage::create($data);

            // Create default section
            PageSection::create([
                'page_id' => $page->id,
                'name' => 'Main Content',
                'type' => 'section',
                'sort_order' => 0,
                'is_visible' => true,
            ]);

            return $page->load(['sections.components.componentType']);
        });
    }

    public function updatePage(WebsitePage $page, array $data): WebsitePage
    {
        return DB::transaction(function () use ($page, $data) {
            // Handle homepage logic
            if (!empty($data['is_homepage'])) {
                WebsitePage::where('website_id', $page->website_id)
                    ->where('id', '!=', $page->id)
                    ->update(['is_homepage' => false]);
            }

            $page->update($data);

            return $page->load(['sections.components.componentType']);
        });
    }

    public function duplicatePage(WebsitePage $page): WebsitePage
    {
        return DB::transaction(function () use ($page) {
            $pageData = $page->toArray();
            unset($pageData['id'], $pageData['created_at'], $pageData['updated_at']);
            
            // Generate unique slug
            $pageData['slug'] = $this->generateUniqueSlug($page->slug, $page->website_id);
            $pageData['title'] = $page->title . ' Copy';
            $pageData['is_homepage'] = false;
            $pageData['is_published'] = false;

            $duplicatePage = WebsitePage::create($pageData);

            // Duplicate sections
            foreach ($page->sections as $section) {
                $sectionData = $section->toArray();
                unset($sectionData['id'], $sectionData['created_at'], $sectionData['updated_at']);
                $sectionData['page_id'] = $duplicatePage->id;

                $duplicateSection = PageSection::create($sectionData);

                // Duplicate components
                foreach ($section->components as $component) {
                    $componentData = $component->toArray();
                    unset($componentData['id'], $componentData['created_at'], $componentData['updated_at']);
                    $componentData['section_id'] = $duplicateSection->id;

                    PageComponent::create($componentData);
                }
            }

            return $duplicatePage->load(['sections.components.componentType']);
        });
    }

    public function setAsHomepage(WebsitePage $page): WebsitePage
    {
        return DB::transaction(function () use ($page) {
            // Remove homepage status from other pages
            WebsitePage::where('website_id', $page->website_id)
                ->where('id', '!=', $page->id)
                ->update(['is_homepage' => false]);

            // Set this page as homepage
            $page->update(['is_homepage' => true]);

            return $page;
        });
    }

    public function reorderPages(StoreWebsite $website, array $pages): void
    {
        DB::transaction(function () use ($pages) {
            foreach ($pages as $pageData) {
                WebsitePage::where('id', $pageData['id'])
                    ->update(['sort_order' => $pageData['sort_order']]);
            }
        });
    }

    public function createSection(WebsitePage $page, array $data): PageSection
    {
        $data['page_id'] = $page->id;

        // Set sort order if not provided
        if (!isset($data['sort_order'])) {
            $maxOrder = PageSection::where('page_id', $page->id)->max('sort_order') ?? 0;
            $data['sort_order'] = $maxOrder + 1;
        }

        return PageSection::create($data);
    }

    public function updateSection(PageSection $section, array $data): PageSection
    {
        $section->update($data);
        return $section->load(['components.componentType']);
    }

    public function deleteSection(PageSection $section): void
    {
        DB::transaction(function () use ($section) {
            // Delete all components in this section
            $section->components()->delete();
            
            // Delete the section
            $section->delete();
        });
    }

    public function duplicateSection(PageSection $section): PageSection
    {
        return DB::transaction(function () use ($section) {
            $sectionData = $section->toArray();
            unset($sectionData['id'], $sectionData['created_at'], $sectionData['updated_at']);
            
            $sectionData['name'] = $section->name . ' Copy';
            
            // Set new sort order
            $maxOrder = PageSection::where('page_id', $section->page_id)->max('sort_order') ?? 0;
            $sectionData['sort_order'] = $maxOrder + 1;

            $duplicateSection = PageSection::create($sectionData);

            // Duplicate components
            foreach ($section->components as $component) {
                $componentData = $component->toArray();
                unset($componentData['id'], $componentData['created_at'], $componentData['updated_at']);
                $componentData['section_id'] = $duplicateSection->id;

                PageComponent::create($componentData);
            }

            return $duplicateSection->load(['components.componentType']);
        });
    }

    private function generateUniqueSlug(string $baseSlug, int $websiteId): string
    {
        $slug = $baseSlug . '-copy';
        $counter = 1;

        while (WebsitePage::where('website_id', $websiteId)->where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-copy-' . $counter;
            $counter++;
        }

        return $slug;
    }
}