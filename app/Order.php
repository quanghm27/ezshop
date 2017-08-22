<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    //
    protected $fillable = [
        'customer_id', 'total_price', 'note'
    ];

    protected $hidden = [
        'updated_at'
    ];

    protected $casts = [
        'deleted' => 'boolean'
    ];

    public function customer() {
        return $this->belongsTo('App\Customer');
    }

    public function products() {
        return $this->belongsToMany('App\Product')
            ->withPivot('quantity', 'price', 'discount')
            ->withTimestamps();
    }
}