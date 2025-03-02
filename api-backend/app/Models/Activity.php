<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Activity",
 *     type="object",
 *     title="Actividad",
 *     description="Modelo de actividad del usuario",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="user_id", type="integer", example=10),
 *     @OA\Property(property="action", type="string", example="login"),
 *     @OA\Property(property="description", type="string", example="El usuario inició sesión"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-02-28T12:34:56Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-02-28T12:34:56Z")
 * )
 */
class Activity extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'action', 'description'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
