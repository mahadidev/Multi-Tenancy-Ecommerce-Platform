<?php

namespace App\Modules\WebsiteBuilder\Services;

use App\Modules\WebsiteBuilder\Models\StoreWebsite;
use App\Modules\WebsiteBuilder\Models\WebsiteTemplate;
use App\Modules\WebsiteBuilder\Models\WebsitePage;
use App\Modules\WebsiteBuilder\Models\PageSection;
use App\Modules\WebsiteBuilder\Models\PageComponent;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class WebsiteService
{
    public function createWebsite(array $data): StoreWebsite
    {
        return DB::transaction(function () use ($data) {
            // Generate unique subdomain if not provided
            if (empty($data['subdomain'])) {
                $data['subdomain'] = $this->generateUniqueSubdomain($data['title']);
            }

            $website = StoreWebsite::create($data);

            // Create default homepage if no template is used
            if (empty($data['template_id'])) {
                $this->createDefaultHomepage($website);
            }

            return $website->load(['template', 'pages']);
        });
    }

    public function updateWebsite(StoreWebsite $website, array $data): StoreWebsite
    {
        $website->update($data);
        return $website->load(['template', 'pages']);
    }

    public function duplicateWebsite(StoreWebsite $website): StoreWebsite
    {
        return DB::transaction(function () use ($website) {
            $duplicateData = $website->toArray();
            unset($duplicateData['id'], $duplicateData['created_at'], $duplicateData['updated_at']);
            
            // Generate new subdomain
            $duplicateData['subdomain'] = $this->generateUniqueSubdomain($website->title . ' Copy');
            $duplicateData['title'] = $website->title . ' Copy';
            $duplicateData['is_published'] = false;
            $duplicateData['published_at'] = null;

            $duplicateWebsite = StoreWebsite::create($duplicateData);

            // Duplicate all pages and their content
            foreach ($website->pages as $page) {
                $this->duplicatePage($page, $duplicateWebsite);
            }

            return $duplicateWebsite->load(['template', 'pages']);
        });
    }

    public function createWebsiteFromTemplate(WebsiteTemplate $template, array $data): StoreWebsite
    {
        return DB::transaction(function () use ($template, $data) {
            $data['template_id'] = $template->id;
            $website = StoreWebsite::create($data);

            // Copy template structure to website
            foreach ($template->pages as $templatePage) {
                $pageData = [
                    'website_id' => $website->id,
                    'title' => $templatePage->title,
                    'slug' => $templatePage->slug,
                    'type' => $templatePage->type,
                    'description' => $templatePage->description,
                    'is_homepage' => $templatePage->is_homepage,
                    'sort_order' => $templatePage->sort_order,
                    'meta_data' => $templatePage->meta_data,
                ];

                $page = WebsitePage::create($pageData);

                // Copy sections and components
                foreach ($templatePage->sections as $templateSection) {
                    $sectionData = [
                        'page_id' => $page->id,
                        'name' => $templateSection->name,
                        'type' => $templateSection->type,
                        'container_styles' => $templateSection->container_styles,
                        'sort_order' => $templateSection->sort_order,
                        'meta_data' => $templateSection->meta_data,
                    ];

                    $section = PageSection::create($sectionData);

                    // Copy components
                    foreach ($templateSection->components as $templateComponent) {
                        $componentData = [
                            'section_id' => $section->id,
                            'component_type_id' => $templateComponent->component_type_id,
                            'name' => $templateComponent->name,
                            'props' => $templateComponent->props,
                            'styles' => $templateComponent->styles,
                            'sort_order' => $templateComponent->sort_order,
                            'meta_data' => $templateComponent->meta_data,
                        ];

                        PageComponent::create($componentData);
                    }
                }
            }

            return $website->load(['template', 'pages.sections.components.componentType']);
        });
    }

    private function generateUniqueSubdomain(string $title): string
    {
        $baseSubdomain = Str::slug($title);
        $subdomain = $baseSubdomain;
        $counter = 1;

        while (StoreWebsite::where('subdomain', $subdomain)->exists()) {
            $subdomain = $baseSubdomain . '-' . $counter;
            $counter++;
        }

        return $subdomain;
    }

    private function createDefaultHomepage(StoreWebsite $website): WebsitePage
    {
        $page = WebsitePage::create([
            'website_id' => $website->id,
            'title' => 'Home',
            'slug' => 'home',
            'type' => 'home',
            'description' => 'Welcome to our website',
            'is_homepage' => true,
            'is_published' => true,
            'sort_order' => 0,
        ]);

        // Create a default section
        PageSection::create([
            'page_id' => $page->id,
            'name' => 'Main Content',
            'type' => 'section',
            'sort_order' => 0,
            'is_visible' => true,
        ]);

        return $page;
    }

    private function duplicatePage(WebsitePage $page, StoreWebsite $targetWebsite): WebsitePage
    {
        $pageData = $page->toArray();
        unset($pageData['id'], $pageData['created_at'], $pageData['updated_at']);
        $pageData['website_id'] = $targetWebsite->id;

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

        return $duplicatePage;
    }
}