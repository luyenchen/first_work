<?php
// 成為老師
namespace App\Http\Controllers;
use App\Models\BeTeacher;
use Illuminate\Http\Request;
use App\Models\City;
use App\Models\District;
use App\Models\Subject;
use Illuminate\Support\Facades\DB;

class BeTeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function create()
    {
        $cities = City::all();
        $subjects = Subject::all();
        return view('beteacher', compact('cities', 'subjects'));
    }

    public function store(Request $request)
{
    $validatedData = $request->validate([
        'title' => 'required|string|max:255',
        'subject_id' => 'required|exists:subject,id',
        'available_time' => 'required|array',
        'hourly_rate' => 'required|numeric|min:0',
        'city_id' => 'required|exists:cities,id',
        'districts' => 'required|array',
        'districts.*' => 'exists:districts,id',
        'details' => 'required|string',
    ]);

    // $validatedData['available_time'] = json_encode($validatedData['available_time']);
    $validatedData['district_ids'] = ($validatedData['districts']);
    $validatedData['user_id'] = auth()->id();
    $validatedData['status'] = BeTeacher::STATUS_PUBLISHED;  // 設置初始狀態為發布中
    $validatedData['available_time'] = implode(', ', $validatedData['available_time']);

    // 移除 districts，因為它不是表的直接列
    unset($validatedData['districts']);

    $beTeacher = BeTeacher::create($validatedData);

    return response()->json(['message' => '老師資料已成功提交！'], 201);
}
    public function updateStatus(Request $request, $id)
    {
    $request->validate([
    'status' => 'required|in:' . implode(',', array_keys(BeTeacher::getStatusOptions())),
    ]);

    $beTeacher = BeTeacher::findOrFail($id);
    $beTeacher->status = $request->status;
    $beTeacher->save();

    return response()->json(['message' => '狀態已成功更新', 'status' => $beTeacher->status]);
    }

    public function getCities()
    {
        $cities = City::all();
        return response()->json($cities);
    }

    public function getDistricts($cityId)
    {
        $districts = District::where('city_id', $cityId)->get();
        return response()->json($districts);
    }

    public function getSubjects()
    {
        $subjects = Subject::all();
        return response()->json($subjects);
    }
}
