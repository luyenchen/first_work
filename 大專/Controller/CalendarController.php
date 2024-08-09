<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Calendar;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    public function index()
    {
        return view('calendar');
    }

    public function getCities()
    {
        $cities = City::with('districts')->get();
        return response()->json($cities);
    }

    public function storeEvent(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'date' => 'required|date',
                'time' => 'required',
                'text' => 'required|string',
                'city' => 'required|string',
                'district' => 'required|string',
                'detail_address' => 'required|string',
                'hourly_rate' => 'required|numeric',
            ]);

            $calendar = Calendar::create($validatedData);

            return response()->json(['message' => '事件已成功儲存', 'id' => $calendar->id]);
        } catch (\Exception $e) {
            \Log::error('Error in storeEvent: ' . $e->getMessage());
            return response()->json(['error' => '服務器錯誤，請稍後再試'], 500);
        }
    }

    // public function getEvents()
    // {
    //     $events = Calendar::all();
    //     return response()->json($events);
    // }

    public function deleteEvent($id)
    {
        $event = Calendar::findOrFail($id);
        $event->delete();
        return response()->json(null, 204);
    }
    public function submitEvents(Request $request)
{
    try {
        $events = $request->input('events');
        
        foreach ($events as $eventData) {
            $validatedData = $this->validateEvent($eventData);
            Calendar::create($validatedData);
        }

        return response()->json(['success' => true, 'message' => '所有事件已成功保存']);
    } catch (\Exception $e) {
        \Log::error('Error in submitEvents: ' . $e->getMessage());
        return response()->json(['error' => '服務器錯誤，請稍後再試'], 500);
    }
}

private function validateEvent($eventData)
{
    return validator($eventData, [
        'date' => 'required|date',
        'time' => 'required',
        'text' => 'required|string',
        'city' => 'required|string',
        'district' => 'required|string',
        'detail_address' => 'required|string',
        'hourly_rate' => 'required|numeric',
    ])->validate();
}
}