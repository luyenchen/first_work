<?php
// 成為老師
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BeTeacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'subject_id',
        'available_time',
        'hourly_rate',
        'city_id',
        'district_ids',
        'details',
        'user_id',
        'status',

    ];

    protected $casts = [
        
        'district_ids' => 'array',

    ];
    const STATUS_PUBLISHED = 'published';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    protected $attributes = [
        'status' => self::STATUS_PUBLISHED,
    ];

    public static function getStatusOptions()
    {
        return [
            self::STATUS_PUBLISHED => '發布中',
            self::STATUS_IN_PROGRESS => '進行中',
            self::STATUS_COMPLETED => '完成',
            self::STATUS_CANCELLED => '取消',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function districts()
    {
        return $this->belongsToMany(District::class);
    }

    // 定義與 FavoriteStudent 的關聯
    public function favorites()
    {
        return $this->hasMany(FavoriteStudent::class, 'be_teachers_id');
    }

    public function contactTeacher()
    {
        return $this->hasMany(ContactTeacher::class, 'be_teacher_id');
    }
}