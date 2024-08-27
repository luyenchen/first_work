<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    // 指定資料表名稱
    protected $table = 'subject';

    // 指定主鍵
    protected $primaryKey = 'id';

    // 避免 Laravel 嘗試自動增加 `created_at` 和 `updated_at` 欄位
    public $timestamps = false;

    // 指定可填充的欄位
    protected $fillable = ['name'];
}