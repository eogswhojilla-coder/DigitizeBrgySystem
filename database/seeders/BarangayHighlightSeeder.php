<?php

namespace Database\Seeders;

use App\Models\BarangayHighlight;
use Illuminate\Database\Seeder;

class BarangayHighlightSeeder extends Seeder
{

    public function run(): void
    {
        $highlights = [
            [
                'title' => 'Eskwelanihan 2026: Handog Gamit Pang-Eskwela para sa mga Batang Kinder',
                'description' => 'Eskwelanihan 2026 is a community outreach program dedicated to providing school supplies to kindergarten students in the barangay. This initiative aims to support young learners by equipping them with essential materials such as notebooks, pencils, crayons, and school bags.',
                'category' => 'Education',
                'image' => 'images/brgy-highlights-4.jpg',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Tulong Handog ng Barangay: Ayuda para sa Mamamayan',
                'description' => 'Tulong Handog ng Barangay is a community assistance program designed to help residents cope with financial difficulties and emergency situations. Through organized and transparent distribution, the barangay ensures fairness and equal opportunity for beneficiaries. This initiative reflects the commitment of local leaders to serve with integrity and care.',
                'category' => 'Community',
                'image' => 'images/brgy-highlights-1.jpg',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Orange Your Day: United to End Violence Against Women',
                'description' => 'This campaign supports the global advocacy movement led by United Nations to eliminate violence against women.',
                'category' => 'Safety',
                'image' => 'images/brgy-highlights-3.jpg',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Clean-Up Drive: Keeping Our Barangay Clean and Green',
                'description' => 'This campaign aims to promote environmental awareness and community involvement by organizing regular clean-up drives in the barangay. Residents are encouraged to participate and contribute to maintaining a clean and green environment.',
                'category' => 'Environment',
                'image' => 'images/brgy-highlights-2.jpg',
                'order' => 4,
                'is_active' => true,
            ],

        ];

        foreach ($highlights as $highlight) {
            BarangayHighlight::create($highlight);
        }
    }
}
