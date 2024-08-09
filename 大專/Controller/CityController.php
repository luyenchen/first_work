<?php

namespace App\Http\Controllers;

use App\Models\City;

class CityController extends Controller
{
    public function index()
    {
        $cities = City::select('id', 'city')->get();
        return response()->json($cities);
    }
}
