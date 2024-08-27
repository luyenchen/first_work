<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    // 指定資料表名稱
    protected $table = 'districts';

    // 指定主鍵
    protected $primaryKey = 'id';

    // 避免 Laravel 嘗試自動增加 `created_at` 和 `updated_at` 欄位
    public $timestamps = false;

    // 指定可填充的欄位
    protected $fillable = ['district_name', 'cities_id'];

    protected $foreignKey = 'cities_id';

    /**
     * 取得該區域所屬的城市
     */
    public function city()
    {
        return $this->belongsTo(City::class, 'cities_id', 'id');
    }

    /**
     * 取得該區域的名稱
     */
    public function getDistrictNameAttribute()
    {
        return $this->attributes['district_name'];
    }

    
    
}
