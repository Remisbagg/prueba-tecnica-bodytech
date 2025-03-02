<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * @OA\Tag(
 *     name="Reports",
 *     description="Endpoints para reportes y métricas"
 * )
 */
class ReportController extends Controller
{
    /**
     * Obtener los usuarios recientes.
     *
     * @OA\Get(
     *     path="/api/reports/recent-users",
     *     summary="Obtener los usuarios registrados recientemente",
     *     tags={"Reports"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de usuarios recientes",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/User"))
     *     )
     * )
     */
    public function recentUsers()
    {
        $users = User::recent()->get();
        return response()->json($users);
    }

    /**
     * Obtener los usuarios más activos.
     *
     * @OA\Get(
     *     path="/api/reports/active-users",
     *     summary="Obtener los usuarios con más actividad",
     *     tags={"Reports"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de usuarios ordenados por número de actividades",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/User"))
     *     )
     * )
     */
    public function activeUsers()
    {
        $activeUsers = User::withCount('activities')->orderBy('activities_count', 'desc')->get();
        return response()->json($activeUsers);
    }

    /**
     * Obtener el número de acciones por usuario.
     *
     * @OA\Get(
     *     path="/api/reports/user-actions",
     *     summary="Obtener la cantidad de acciones realizadas por cada usuario",
     *     tags={"Reports"},
     *     @OA\Response(
     *         response=200,
     *         description="Número de acciones agrupadas por usuario",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="user_id", type="integer", example=1),
     *                 @OA\Property(property="action_count", type="integer", example=25)
     *             )
     *         )
     *     )
     * )
     */
    public function userActions()
    {
        $actionsCount = Activity::select('user_id', DB::raw('count(*) as action_count'))
            ->groupBy('user_id')
            ->get();

        return response()->json($actionsCount);
    }

    /**
     * Obtener métricas generales de actividades.
     *
     * @OA\Get(
     *     path="/api/reports/activity-metrics",
     *     summary="Obtener métricas generales de actividades",
     *     tags={"Reports"},
     *     @OA\Response(
     *         response=200,
     *         description="Métricas de actividad",
     *         @OA\JsonContent(
     *             @OA\Property(property="total_activities", type="integer", example=500),
     *             @OA\Property(property="most_active_user", type="string", example="John Doe"),
     *             @OA\Property(property="most_common_action", type="string", example="login")
     *         )
     *     )
     * )
     */
    public function activityMetrics()
    {
        $totalActivities = Activity::count();
        $mostActiveUser = User::withCount('activities')->orderBy('activities_count', 'desc')->first();
        $mostCommonAction = Activity::select('action', DB::raw('count(*) as count'))
            ->groupBy('action')
            ->orderByDesc('count')
            ->first();

        return response()->json([
            'total_activities' => $totalActivities,
            'most_active_user' => $mostActiveUser ? $mostActiveUser->name : null,
            'most_common_action' => $mostCommonAction ? $mostCommonAction->action : null,
        ]);
    }
}
