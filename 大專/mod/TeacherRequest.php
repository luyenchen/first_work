<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TeacherRequest extends Model
{
    protected $fillable = [
        'title', 'subject_id', 'available_time', 'expected_date',
        'hourly_rate_min', 'hourly_rate_max', 'city_id',
        'district_ids', 'details', 'status','user_id'
    ];

    protected $casts = [
        'available_time' => 'array',
        'district_ids' => 'array',
        'expected_date' => 'date',
    ];

    // 定義狀態常量
    const STATUS_PUBLISHED = 'published';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    protected $attributes = [
        'status' => self::STATUS_PUBLISHED,
    ];

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function districts()
    {
        return $this->belongsToMany(District::class, 'teacher_request_district');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public static function getStatusOptions()
    {
        return [
            self::STATUS_PUBLISHED => '發布中',
            self::STATUS_IN_PROGRESS => '進行中',
            self::STATUS_COMPLETED => '完成',
            self::STATUS_CANCELLED => '取消',
        ];
    }

    public function isPublished()
    {
        return $this->status === self::STATUS_PUBLISHED;
    }

    public function isInProgress()
    {
        return $this->status === self::STATUS_IN_PROGRESS;
    }

    public function isCompleted()
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function isCancelled()
    {
        return $this->status === self::STATUS_CANCELLED;
    }

    public function updateStatus($newStatus)
    {
        if (in_array($newStatus, array_keys(self::getStatusOptions()))) {
            $this->status = $newStatus;
            $this->save();
            return true;
        }
        return false;
    }
    use HasFactory;

    // 定義與 `favorites` 表的多對多關聯
    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites', 'teacher_request_id', 'user_id');
    }
}