<?php

namespace App\Http\Controllers;

use App\Models\District;

class DistrictController extends Controller
{
    public function getDistricts($cityId)
    {
        $districts = District::where('cities_id', $cityId)->get();
        return response()->json($districts);
    }
}
