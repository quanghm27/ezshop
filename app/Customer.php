<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    //
    protected $fillable = [
        'name', 'phone_number', 'email', 'facebook_link', 'address', 'note'
    ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    protected $casts = [
        'deleted' => 'boolean'
    ];

    public function orders() {
        return $this->hasMany('App\Order');
    }
}
