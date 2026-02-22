<?php

namespace Database\Seeders;

use App\Models\BarangayHighlight;
use Illuminate\Database\Seeder;

class BarangayHighlightSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $highlights = [
            [
                'title' => 'Modern Barangay Hall',
                'description' => 'Your community center for all barangay services',
                'category' => 'Infrastructure',
                'image' => 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Community Events',
                'description' => 'Bringing residents together through meaningful activities',
                'category' => 'Community',
                'image' => 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Digital Services',
                'description' => 'Access barangay services anytime, anywhere',
                'category' => 'Technology',
                'image' => 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Health & Wellness',
                'description' => 'Quality healthcare services for every resident',
                'category' => 'Healthcare',
                'image' => 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($highlights as $highlight) {
            BarangayHighlight::create($highlight);
        }
    }
}
