<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Mail\WelcomeSellerMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;



class Store extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = ['store_type_id', 'owner_id', 'name', 'slug', 'domain', 'email', 'phone', 'location', 'status', 'currency', 'logo', 'dark_logo', 'settings', 'theme_id', 'primary_color', 'secondary_color', 'description'];
    protected $casts = [
        'settings' => 'json',
        // 'settings' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        // Automatically generate a slug when creating
        static::creating(function ($data) {
            if (empty($data->slug)) {
                $data->slug = Str::slug($data->name); // Generate slug from name
            }

            // Send welcome email with error handling
            $data->sendWelcomeEmail();
        });

         // Set default trial period for the store
        static::created(function ($data) {
           
             $package = Subscription::where('name', 'free-trial')->first();

             if ($package) {
                 $data->storeSubscription()->create([
                     'user_id' => $data->owner_id,
                     'subscription_id' => $package->id,
                     'start_date' => now(),
                     'end_date' => now()->addDays($package->trial_days),
                     'is_active' => true,
                 ]);
             }
 
        });

        // Automatically update the slug when updating
        static::updating(function ($data) {
            if ($data->isDirty('name')) {
                // Check if the 'name' attribute has changed
                $data->slug = Str::slug($data->name); // Update slug based on new name
            }
        });
    }

    public function storeSubscription()
    {
        return $this->hasOne(StoreSubscription::class, 'store_id');
    }

    public function getPackageRemainingDaysAttribute()
    {
        $subscription = $this->storeSubscription;
        
        if ($subscription && $subscription->end_date) {
            $remainingDays = now()->diffInDays($subscription->end_date, false);
            return $remainingDays > 0 ? $remainingDays : 0; // Return 0 if expired
        }

        return 0; // No subscription found
    }

    public function getLogoImageAttribute()
    {
        return $this->logo ? url(Storage::url($this->logo)) : null;
    }

    public function getDarkLogoImageAttribute()
    {
        return $this->dark_logo ? url(Storage::url($this->dark_logo)) : null;
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function domain()
    {
        // $domain = 'https://' . $this->domain . '.' . parse_url(env('APP_URL'), PHP_URL_HOST) . '.com';
        // $domain = 'https://' . parse_url(env('APP_URL'), PHP_URL_HOST) . '/sites/' . $this->domain;
        if (env('APP_URL') == 'http://127.0.0.1:8000') {
            $domain = 'http://127.0.0.1:8000/sites/' . $this->domain;
        } else {
            $domain = 'https://' . parse_url(env('APP_URL'), PHP_URL_HOST) . '/sites/' . $this->domain;
        }

        return $domain;
    }

    // Scope to check ownership
    public function scopeStoreOwner($query)
    {
        return $query->where('owner_id', auth()->id());
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    public function storeSessions()
    {
        return $this->hasMany(StoreSession::class);
    }

    public function theme()
    {
        return $this->belongsTo(Theme::class);
    }

    public function pages()
    {
        return $this->hasMany(StorePage::class, 'store_id');
    }

    public function widgets()
    {
        return $this->morphMany(Widget::class, 'ref')->where(["type_id" => 3]); // return only section type widget
    }

    public function layouts()
    {
        return $this->morphMany(Widget::class, 'ref')->where(["type_id" => 1]); // return only layout type widget
    }

    public function partials()
    {
        return $this->morphMany(Widget::class, 'ref')->where(["type_id" => 2]); // return only layout type widget
    }

    public function socialMedia()
    {
        return $this->hasMany(StoreSocialMedia::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function brands()
    {
        return $this->hasMany(Brand::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function menus()
    {
        return $this->hasMany(StoreMenu::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function featured_products()
    {
        return $this->hasMany(Product::class)->where('is_featured', true)->orderBy('id', 'desc');
    }

    public function trending_products()
    {
        return $this->hasMany(Product::class)->where('is_trending', true)->orderBy('id', 'desc');
    }

    public function uniqueVisitorsToday()
    {
        return DB::table('store_visitors')
            ->where('store_id', $this->id)
            ->whereDate('visited_at', now()->toDateString())
            ->distinct('ip_address')
            ->count();
    }

    public function visitors()
    {
        return DB::table('store_visitors')
            ->where('store_id', $this->id)
            ->count();
    }

    public function uniqueVisitors()
    {
        return DB::table('store_visitors')
            ->where('store_id', $this->id)
            ->distinct('ip_address')
            ->count();
    }

    public function storeType()
    {
        return $this->belongsTo(StoreType::class, 'store_type_id');
    }

    public function sendWelcomeEmail()
    {
        try {
            if (env('APP_ENV') == 'production' || env('APP_ENV') == 'local') {
                $user = $this->owner;
                $appUrl = config('app.url');

                // Ensure we have a trailing slash
                if (!str_ends_with($appUrl, '/')) {
                    $appUrl .= '/';
                }

                // Get store logo URL
                $logoUrl = null;
                if ($this->logo) {
                    $logoUrl = $appUrl . 'storage/' . $this->logo;
                } else {
                    $logoUrl = $appUrl . 'images/logo-text.png';
                }

                // Get domain
                $domain = null;
                if(env('APP_URL') == 'http://127.0.0.1:8000') {
                    $domain = 'http://127.0.0.1:8000/seller';
                } else {
                    $domain = 'https://' . parse_url(env('APP_URL'), PHP_URL_HOST) . '/seller';
                }

                if ($user && $user->email) {
                    Mail::to($user->email)->send(new WelcomeSellerMail($this, $logoUrl, $domain));
                    return true;
                } else {
                    Log::info('User email not found');
                }
            } else {
                Log::info('Please set APP_ENV to production to send emails');
            }
        } catch (\Exception $e) {
            Log::error('Error sending welcome email: ' . $e->getMessage());
            // return response()->json(['status' => 500, 'message' => 'Error sending welcome email'], 500);
        }
    }

    public function storeShipment()
    {
        return $this->hasMany(StoreShipment::class, 'store_id');
    }

    public function steadfastApi()
    {
        return $this->hasOne(StoreApiCredential::class);
    }


    
}
