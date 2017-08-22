<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'code', 'name', 'quantity', 'price', 'discount', 'discount_event', 'description'
    ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    protected $casts = [
        'deleted' => 'boolean'
    ];

    public function orders() {
        return $this->belongsToMany('App\Order')
            ->withPivot('quantity', 'price', 'discount')
            ->withTimestamps();
    }
}
