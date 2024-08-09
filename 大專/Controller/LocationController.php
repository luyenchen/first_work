<?php
// app/Http/Controllers/LocationController.php
namespace App\Http\Controllers;

use App\Models\City;
use App\Models\District;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function getCities()
    {
        $cities = City::all();
        return response()->json($cities);
    }

    public function getDistricts($cityId)
    {
        $districts = District::where('cities_id', $cityId)->get();
        return response()->json($districts);
    }
}