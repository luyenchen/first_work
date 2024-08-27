<?php

namespace App\Http\Controllers;

use App\Models\TeacherRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeacherController extends Controller
{
    public function storeRequest(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'subject_id' => 'required|exists:subject,id',
                'available_time' => 'required|array',
                'expected_date' => 'required|date',
                'hourly_rate_min' => 'required|integer|min:0',
                'hourly_rate_max' => 'required|integer|gte:hourly_rate_min',
                'city_id' => 'required|exists:cities,id',
                'districts' => 'required|array',
                'details' => 'required|string',
            ]);

            $validatedData['user_id'] = auth()->id();
            $validatedData['district_ids'] = json_encode($validatedData['districts']);
            unset($validatedData['districts']);
            $validatedData['available_time'] = implode(', ', $validatedData['available_time']);
            $validatedData['status'] = TeacherRequest::STATUS_PUBLISHED;

            $id = DB::table('teacher_requests')->insertGetId($validatedData);

            return response()->json(['message' => '成功送出', 'id' => $id]);
        } catch (\Exception $e) {
            \Log::error('Error in storeRequest: ' . $e->getMessage());
            return response()->json(['error' => '服務器錯誤，請稍後再試'], 500);
        }
    }
}