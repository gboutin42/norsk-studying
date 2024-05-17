<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Word extends Model
{
    use HasFactory;

    public $timestamps = true;

	protected $fillable = [
		'norwegian',
		'french',
		'help',
		'type',
		'status'
	];
}
