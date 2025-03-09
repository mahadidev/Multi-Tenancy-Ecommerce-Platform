<?php

namespace Database\Seeders;

use App\Models\Subscription;
use App\Models\SubscriptionFeature;
use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    public function run()
    {
        $subscriptions = [
            [
                'name' => 'Starter',
                'title' => 'Starter features',
                'price_monthly' => 9.99,
                'is_trend' => false,
                'features' => [
                    ['name' => '1 Website', 'is_available' => true],
                    ['name' => '1GB Storage', 'is_available' => true],
                    ['name' => 'Basic Templates', 'is_available' => true],
                    ['name' => 'Custom Domain', 'is_available' => false],
                    ['name' => 'E-commerce Features', 'is_available' => false],
                    ['name' => 'Standard Security', 'is_available' => true],
                    ['name' => 'Community Support', 'is_available' => true],
                    ['name' => 'SEO Tools', 'is_available' => false],
                    ['name' => 'Analytics Dashboard', 'is_available' => false],
                    ['name' => 'API Access', 'is_available' => false],
                    ['name' => 'Ad-Free Experience', 'is_available' => false],
                    ['name' => 'Multilingual Support', 'is_available' => false],
                    ['name' => 'User Roles & Permissions', 'is_available' => false],
                ],
            ],
            [
                'name' => 'Pro',
                'title' => 'Pro features',
                'price_monthly' => 19.99,
                'is_trend' => true,
                'features' => [
                    ['name' => '5 Websites', 'is_available' => true],
                    ['name' => '10GB Storage', 'is_available' => true],
                    ['name' => 'Premium Templates', 'is_available' => true],
                    ['name' => 'Custom Domain', 'is_available' => true],
                    ['name' => 'E-commerce Features', 'is_available' => false],
                    ['name' => 'Enhanced Security', 'is_available' => true],
                    ['name' => 'Email Support', 'is_available' => true],
                    ['name' => 'Advanced SEO Tools', 'is_available' => true],
                    ['name' => 'Basic Analytics Dashboard', 'is_available' => true],
                    ['name' => 'API Access', 'is_available' => false],
                    ['name' => 'Ad-Free Experience', 'is_available' => true],
                    ['name' => 'Multilingual Support', 'is_available' => false],
                    ['name' => 'User Roles & Permissions', 'is_available' => true],
                ],
            ],
            [
                'name' => 'Business',
                'title' => 'Business features',
                'price_monthly' => 49.99,
                'is_trend' => false,
                'features' => [
                    ['name' => 'Unlimited Websites', 'is_available' => true],
                    ['name' => '100GB Storage', 'is_available' => true],
                    ['name' => 'Premium Templates', 'is_available' => true],
                    ['name' => 'Custom Domain', 'is_available' => true],
                    ['name' => 'E-commerce Features', 'is_available' => true],
                    ['name' => 'Priority Security', 'is_available' => true],
                    ['name' => 'Live Chat Support', 'is_available' => true],
                    ['name' => 'Full SEO Suite', 'is_available' => true],
                    ['name' => 'Advanced Analytics Dashboard', 'is_available' => true],
                    ['name' => 'API Access', 'is_available' => true],
                    ['name' => 'Blogging Tools', 'is_available' => true],
                    ['name' => 'Mobile Optimization', 'is_available' => true],
                    ['name' => 'Ad-Free Experience', 'is_available' => true],
                    ['name' => 'Multilingual Support', 'is_available' => true],
                    ['name' => 'User Roles & Permissions', 'is_available' => true],
                ],
            ],
        ];

        foreach ($subscriptions as $data) {
            // Create or update the subscription
            $subscription = Subscription::updateOrCreate(
                ['name' => $data['name']], // Condition to find existing record
                [
                    'title' => $data['title'],
                    'price_monthly' => $data['price_monthly'],
                    'is_trend' => $data['is_trend'],
                ]
            );

            // Sync features for this subscription
            foreach ($data['features'] as $featureData) {
                SubscriptionFeature::updateOrCreate(
                    [
                        'subscription_id' => $subscription->id,
                        'name' => $featureData['name'],
                    ],
                    [
                        'is_available' => $featureData['is_available'],
                    ]
                );
            }
        }
    }
}
