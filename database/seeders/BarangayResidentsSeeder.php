<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class BarangayResidentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $faker = Faker::create();

        for ($i = 1; $i <= 100; $i++) {
            DB::table('barangay_residents')->insert([
                'position'       => $faker->randomElement(['Barangay Captain', 'Kagawad', 'Resident']),
                'startDate'      => $faker->date(),
                'endDate'        => $faker->date(),
                'voters'         => $faker->randomElement(['Yes', 'No']),
                'dateOfBirth'    => $faker->date('Y-m-d', '2005-01-01'),
                'placeOfBirth'   => $faker->city,
                'pwd'            => $faker->randomElement(['Yes', 'No']),
                'singleParent'   => $faker->randomElement(['Yes', 'No']),
                'firstName'      => $faker->firstName,
                'middleName'     => $faker->lastName,
                'lastName'       => $faker->lastName,
                'suffix'         => $faker->randomElement([null, 'Jr.', 'Sr.', 'III']),
                'gender'         => $faker->randomElement(['Male', 'Female']),
                'civilStatus'    => $faker->randomElement(['Single', 'Married', 'Widowed']),
                'religion'       => $faker->randomElement(['Catholic', 'Christian', 'Muslim', 'Iglesia']),
                'nationality'    => 'Filipino',

                'municipality'   => 'San Carlos City',
                'zip'            => '6127',
                'barangay'       => 'Barangay ' . $faker->numberBetween(1, 20),
                'houseNumber'    => $faker->buildingNumber,
                'street'         => $faker->streetName,
                'address'        => $faker->address,
                'contactNumber'  => $faker->phoneNumber,
                'emailAddress'   => $faker->unique()->safeEmail,

                'fatherName'     => $faker->name('male'),
                'motherName'     => $faker->name('female'),
                'guardianName'   => $faker->randomElement([$faker->name, null]),
                'guardianContact'=> $faker->phoneNumber,

                'username'       => $faker->userName,
                'password'       => Hash::make('password123'),
                'confirmPassword'=> Hash::make('password123'),

                'image'          => null,
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);
        }
    }
}
