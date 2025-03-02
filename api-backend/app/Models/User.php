<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

/**
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     title="Usuario",
 *     description="Modelo de usuario",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Juan Pérez"),
 *     @OA\Property(property="email", type="string", format="email", example="juan@example.com"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-02-28T12:34:56Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-02-28T12:34:56Z")
 * )
 */
class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password'];

    protected $hidden = ['password', 'remember_token'];

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    public function scopeRecent($query)
    {
        return $query->where('created_at', '>=', now()->subDays(30));
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->email = strtolower($model->email);
        });
    }

    
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
