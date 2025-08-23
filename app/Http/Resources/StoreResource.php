<?php

namespace App\Http\Resources;

use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'domain' => $this->domain(),
            'email' => $this->email,
            'phone' => $this->phone,
            'location' => $this->location,
            'status' => $this->status,
            'type' => $this->type,
            'description' => $this->description,
            'currency' => $this->currency ?? 'BDT',
            'logo' => $this->logo_image,
            "dark_logo" => $this->dark_logo_image,
            'primary_color' => $this->primary_color,
            'storeProducts' => ProductResource::collection($this->products()->latest()->get()),
            'featuredProducts' => ProductResource::collection($this->featured_products),
            'trendingProducts' => ProductResource::collection($this->trending_products),
            'secondary_color' => $this->secondary_color,
            'store_type' => $this->storeType ? StoreTypeResource::make($this->storeType) : null,
            'theme_id' => $this->theme_id,
            "theme" => $this->theme_id ? new ThemeResource(Theme::where(["id" => $this->theme_id])->first()) : null,
            'settings' => $this->settings !== "null" ? $this->settings : null,
            'social_media' => $this->socialMedia ? StoreSocialMediaResource::collection($this->socialMedia) : [],
            'categories' => $this->categories ? CategoryResource::collection($this->categories) : [],
            'brands' => $this->brands ? BrandResource::collection($this->brands) : [],
            'pages' => $this->pages ? StorePagesResource::collection($this->pages) : [],
            'menus' => $this->menus ? StoreMenuResource::collection($this->menus) : [],
            'widgets' => $this->widgets ? WidgetResource::collection($this->widgets) : [],
            'partials' => $this->partials ? WidgetResource::collection($this->partials) : [],
            'layouts' => $this->layouts ? WidgetResource::collection($this->layouts) : [],
            'website' => $this->website ? [
                'id' => $this->website->id,
                'subdomain' => $this->website->subdomain,
                'domain' => $this->website->domain,
                'title' => $this->website->title,
                'description' => $this->website->description,
                'is_published' => $this->website->is_published,
                'is_maintenance_mode' => $this->website->is_maintenance_mode,
            ] : null,
            'store_subscription_status' => $this->package_remaining_days == 0 ? 'Expired' : 'Active',
            'store_subscription_plan' => ($this->package_remaining_days != 0 && $this->storeSubscription) ? [
                'id' => $this->storeSubscription->id,
                'start_date' => date('d M, Y | h:ia', strtotime($this->storeSubscription->start_date)),
                'end_date' => date('d M, Y | h:ia', strtotime($this->storeSubscription->end_date)), 
                'is_active' => $this->storeSubscription->is_active,
                'package' => $this->storeSubscription->package ? SubscriptionResource::make($this->storeSubscription->package) : null,
            ] : null,
            'created_at' => date('d M, Y | h:i A', strtotime($this->created_at)),
            'updated_at' => date('d M, Y | h:i A', strtotime($this->updated_at)),
        ];
    }
}
