<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    // 指定資料表名稱
    protected $table = 'cities';

    // 指定主鍵
    protected $primaryKey = 'id';

    // 避免 Laravel 嘗試自動增加 `created_at` 和 `updated_at` 欄位
    public $timestamps = false;

    // 指定可填充的欄位
    protected $fillable = ['city'];

    // 自訂屬性名稱方法
    public function getCityAttribute()
    {
        return $this->attributes['city'];
    }
}
