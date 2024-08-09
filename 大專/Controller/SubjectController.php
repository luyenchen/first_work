<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\JsonResponse;

class SubjectController extends Controller
{
    /**
     * 獲取所有科目列表
     *
     * @return JsonResponse
     */
    public function index()
{
    return Subject::select('id', 'name')->get();
}
}