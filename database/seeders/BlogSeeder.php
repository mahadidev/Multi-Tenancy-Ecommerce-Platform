<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\Category;
use App\Models\Blog;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ["type" => "post", "name" => "Technology", "slug" => "technology"],
            ["type" => "post", "name" => "Fashion", "slug" => "fashion"],
            ["type" => "post", "name" => "Food & Recipes", "slug" => "food-recipes"],
            ["type" => "post", "name" => "Health & Fitness", "slug" => "health-fitness"],
            ["type" => "post", "name" => "Travel & Adventure", "slug" => "travel-adventure"],
            ["type" => "post", "name" => "Parenting & Family", "slug" => "parenting-family"],
            ["type" => "post", "name" => "Personal Development", "slug" => "personal-development"],
            ["type" => "post", "name" => "Finance & Investing", "slug" => "finance-investing"],
            ["type" => "post", "name" => "DIY & Crafts", "slug" => "diy-crafts"],
        ];

        $blogs = [
            ["title" => "Tech Trends in 2025", "slug" => "tech-trends-2025", "image" => "seeders/blogs/placeholder.png", "content" => "Exploring the top tech innovations.", "status" => "active", "category_slug" => "technology"],
            ["title" => "Styling Tips for Summer", "slug" => "styling-tips-summer", "image" => "seeders/blogs/placeholder.png", "content" => "Summer fashion ideas for everyone.", "status" => "active", "category_slug" => "fashion"],
            ["title" => "10 Quick Recipes to Try", "slug" => "quick-recipes", "image" => "seeders/blogs/placeholder.png", "content" => "Delicious meals in under 30 minutes.", "status" => "active", "category_slug" => "food-recipes"],
            ["title" => "Fitness Goals Made Easy", "slug" => "fitness-goals", "image" => "seeders/blogs/placeholder.png", "content" => "Stay motivated and healthy!", "status" => "active", "category_slug" => "health-fitness"],
            ["title" => "Top Travel Destinations", "slug" => "top-travel-destinations", "image" => "seeders/blogs/placeholder.png", "content" => "Plan your next adventure!", "status" => "active", "category_slug" => "travel-adventure"],
            ["title" => "Parenting Tips for Toddlers", "slug" => "parenting-tips-toddlers", "image" => "seeders/blogs/placeholder.png", "content" => "Make parenting easier with these tips.", "status" => "active", "category_slug" => "parenting-family"],
            ["title" => "How to Improve Yourself", "slug" => "self-improvement", "image" => "seeders/blogs/placeholder.png", "content" => "Simple steps to personal growth.", "status" => "active", "category_slug" => "personal-development"],
            ["title" => "Financial Planning Basics", "slug" => "financial-planning", "image" => "seeders/blogs/placeholder.png", "content" => "Start your journey to financial freedom.", "status" => "active", "category_slug" => "finance-investing"],
            ["title" => "Fun DIY Craft Ideas", "slug" => "diy-craft-ideas", "image" => "seeders/blogs/placeholder.png", "content" => "Unleash your creativity with these ideas.", "status" => "active", "category_slug" => "diy-crafts"],
        ];

        $store = Store::where('slug', 'goody-bro')->orWhere('domain', 'goody-bro')->first();

        if ($store) {
            // Seed categories
            foreach ($categories as $category) {
                $categoryRecord = Category::updateOrCreate(
                    [
                        'name' => $category['name'],
                        'slug' => $category['slug'],
                        'store_id' => $store->id,
                    ],
                    [
                        'type' => $category['type'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
                $categoryMap[$category['slug']] = $categoryRecord->id; // Map category slug to its ID
            }

            // Seed blogs
            foreach ($blogs as $blog) {
                $categoryId = $categoryMap[$blog['category_slug']] ?? null;

                if ($categoryId) {
                    Blog::updateOrCreate(
                        [
                            'slug' => $blog['slug'],
                            'store_id' => $store->id,
                            'user_id' => $store->owner->id,
                        ],
                        [
                            'title' => $blog['title'],
                            'image' => $blog['image'],
                            'content' => $blog['content'],
                            'status' => $blog['status'],
                            'category_id' => $categoryId, // Assign the category ID
                        ]
                    );
                }
            }
        }
    }
}
