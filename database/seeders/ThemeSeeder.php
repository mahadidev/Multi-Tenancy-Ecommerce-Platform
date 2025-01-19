<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemePage;
use App\Models\ThemePageWidget;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ThemeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $themes = [
            [
                'name' => 'Simfy Com',
                'slug' => 'simfy-com',
                'thumbnail' => 'https://placehold.co/600x400',
                'pages' => [
                    [
                        'name' => 'home',
                        'label' => 'Home',
                        'type' => null,
                        'slug' => '/',
                        'title' => 'Home Page',
                        'thumbnail' => 'https://placehold.co/600x400',
                        'widgets' => [
                            [
                                'name' => 'hero',
                                'label' => 'Hero Section',
                                'thumbnail' => 'https://placehold.co/600x400',
                                'inputs' => [
                                    [
                                        'name' => 'carousel',
                                        'label' => 'Hero Carousel',
                                        'type' => 'array',
                                        'required' => true,
                                        'serial' => 1,
                                        'items' => [
                                            [
                                                [
                                                    'name' => 'image',
                                                    'label' => 'Image',
                                                    'value' => 'https://cholgori-com-1.vercel.app/_next/image?url=%2Fimages%2Fhero_banner_1.jpg&w=1920&q=75',
                                                    'type' => 'image',
                                                    'placeholder' => 'Enter your image URL',
                                                    'required' => true,
                                                ],
                                                [
                                                    'name' => 'bg-color',
                                                    'label' => 'Background Color',
                                                    'value' => '#ffc100',
                                                    'type' => 'color',
                                                    'placeholder' => 'Enter background color code',
                                                    'required' => false,
                                                ],
                                            ],
                                            [
                                                [
                                                    'name' => 'image',
                                                    'label' => 'Image',
                                                    'value' => 'https://cholgori-com-1.vercel.app/_next/image?url=%2Fimages%2Fhero_banner_2.jpg&w=1920&q=75',
                                                    'type' => 'image',
                                                    'placeholder' => 'Enter your image URL',
                                                    'required' => true,
                                                ],
                                                [
                                                    'name' => 'bg-color',
                                                    'label' => 'Background Color',
                                                    'value' => '#ffc100',
                                                    'type' => 'color',
                                                    'placeholder' => 'Enter background color code',
                                                    'required' => false,
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                            [
                                'name' => 'offers',
                                'label' => 'Offers',
                                'thumbnail' => 'https://placehold.co/600x400',
                                'inputs' => [
                                    [
                                        'name' => 'offers',
                                        'label' => 'Offers',
                                        'type' => 'array',
                                        'required' => true,
                                        'serial' => 2,
                                        'items' => [
                                            [
                                                [
                                                    'name' => 'title',
                                                    'label' => 'Title',
                                                    'value' => 'Free Delivery',
                                                    'placeholder' => 'Enter your title',
                                                    'required' => true,
                                                ],
                                                [
                                                    'name' => 'description',
                                                    'label' => 'Description',
                                                    'value' => 'Free shipping worldwide',
                                                    'placeholder' => 'Enter your description',
                                                    'required' => true,
                                                ],
                                                [
                                                    'name' => 'icon',
                                                    'label' => 'SVG Icon',
                                                    'value' => '<svg stroke=\"currentColor\" fill=\"none\" stroke-width=\"2\" viewBox=\"0 0 24 24\" stroke-linecap=\"round\" stroke-linejoin=\"round\" height=\"1em\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><desc></desc><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"></path><circle cx=\"7\" cy=\"17\" r=\"2\"></circle><circle cx=\"17\" cy=\"17\" r=\"2\"></circle><path d=\"M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5\"></path><line x1=\"3\" y1=\"9\" x2=\"7\" y2=\"9\"></line></svg>',
                                                    'placeholder' => 'Enter offer icon (svg)',
                                                    'required' => true,
                                                    'type' => 'textarea'
                                                ]
                                               
                                            ],
                                            [
                                                [
                                                    'name' => 'title',
                                                    'label' => 'Title',
                                                    'value' => 'Member Discount',
                                                    'placeholder' => 'Enter your title',
                                                    'required' => true,
                                                ],
                                                [
                                                    'name' => 'description',
                                                    'label' => 'Description',
                                                    'value' => 'Free deals everyweek',
                                                    'placeholder' => 'Enter your description',
                                                    'required' => true,
                                                ],
                                                [
                                                    'name' => 'icon',
                                                    'label' => 'SVG Icon',
                                                    'value' => '<svg stroke=\"currentColor\" fill=\"none\" stroke-width=\"2\" viewBox=\"0 0 24 24\" stroke-linecap=\"round\" stroke-linejoin=\"round\" height=\"1em\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><desc></desc><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"></path><circle cx=\"6\" cy=\"19\" r=\"2\"></circle><circle cx=\"17\" cy=\"19\" r=\"2\"></circle><path d=\"M17 17h-11v-14h-2\"></path><path d=\"M20 6l-1 7h-13\"></path><path d=\"M10 10l6 -6\"></path><circle cx=\"10.5\" cy=\"4.5\" r=\".5\"></circle><circle cx=\"15.5\" cy=\"9.5\" r=\".5\"></circle></svg>',
                                                    'placeholder' => 'Enter offer icon (svg)',
                                                    'required' => true,
                                                    'type' => 'textarea'
                                                ]
                                            ],
                                            [
                                                [
                                                    'name' => 'title',
                                                    'label' => 'Title',
                                                    'value' => 'Secure Payment',
                                                    'placeholder' => 'Enter your title',
                                                    'required' => true,
                                                ],
                                                [
                                                    'name' => 'description',
                                                    'label' => 'Description',
                                                    'value' => 'No transaction fees',
                                                    'placeholder' => 'Enter your description',
                                                    'required' => true,
                                                ],
                                                [
                                                    'name' => 'icon',
                                                    'label' => 'SVG Icon',
                                                    'value' => '<svg stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" viewBox=\"0 0 24 24\" height=\"1em\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" d=\"M0 0h24v24H0z\"></path><path d=\"M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-2 0H3V6h14v8zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm13 0v11c0 1.1-.9 2-2 2H4v-2h17V7h2z\"></path></svg>',
                                                    'placeholder' => 'Enter offer icon (svg)',
                                                    'required' => true,
                                                    'type' => 'textarea'
                                                ]
                                            ],
                                            [
                                                [
                                                    'name' => 'title',
                                                    'label' => 'Title',
                                                    'value' => 'Free Return',
                                                    'placeholder' => 'Enter your title',
                                                    'required' => true,
                                                ],
                                                [
                                                    'name' => 'description',
                                                    'label' => 'Description',
                                                    'value' => 'Refund in 365 days',
                                                    'placeholder' => 'Enter your description',
                                                    'required' => true,
                                                ],
                                                [
                                                    'name' => 'icon',
                                                    'label' => 'SVG Icon',
                                                    'value' => '<svg stroke=\"currentColor\" fill=\"none\" stroke-width=\"2\" viewBox=\"0 0 24 24\" stroke-linecap=\"round\" stroke-linejoin=\"round\" height=\"1em\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><desc></desc><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"></path><circle cx=\"7\" cy=\"17\" r=\"2\"></circle><circle cx=\"17\" cy=\"17\" r=\"2\"></circle><path d=\"M5 17h-2v-11a1 1 0 0 1 1 -1h9v6h-5l2 2m0 -4l-2 2\"></path><line x1=\"9\" y1=\"17\" x2=\"15\" y2=\"17\"></line><path d=\"M13 6h5l3 5v6h-2\"></path></svg>',
                                                    'placeholder' => 'Enter offer icon (svg)',
                                                    'required' => true,
                                                    'type' => 'textarea'
                                                ]
                                            ]
                                        ],
                                    ],
                                ]
                            ]
                        ],
                    ],
                ],
            ],
        ];


        foreach($themes as $key => $theme){

            $newTheme = Theme::updateOrCreate([
                'name' => $theme['name'],
                'slug' => $theme['slug'],
            ], [
                'thumbnail' => $theme['thumbnail'],
            ]);

          
            foreach($theme['pages'] as $page){
                $newThemePage = ThemePage::updateOrCreate(
                    [
                        'slug' => $page['slug'],  // Assuming these two fields should uniquely identify a page
                        'theme_id' => $newTheme->id,
                    ],
                    [
                        'name' => $page['name'],
                        'label' => $page['label'],
                        'type' => $page['type'] ,
                        'title' => $page['title'],
                        'thumbnail' => $page['thumbnail'],
                    ]
                );

                foreach ($page['widgets'] as $widget) {
                    $newThemeWidget = ThemePageWidget::updateorCreate(
                        [
                            'name' => $widget['name'],
                            'theme_page_id' => $newThemePage->id,
                        ],
                        [
                            'thumbnail' => $widget['thumbnail'],
                            'label' => $widget['label'],
                            'inputs' => json_encode($widget['inputs']),
                        ]
                    );
                }
            }

        }
    }
}