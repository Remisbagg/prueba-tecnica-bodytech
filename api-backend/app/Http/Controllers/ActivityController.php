<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Activities",
 *     description="Endpoints relacionados con actividades de los usuarios"
 * )
 */
class ActivityController extends Controller
{
    /**
     * Listar actividades con filtros opcionales.
     *
     * @OA\Get(
     *     path="/api/activities",
     *     summary="Obtener listado de actividades",
     *     tags={"Activities"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="user_id",
     *         in="query",
     *         description="Filtrar por ID de usuario",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="action",
     *         in="query",
     *         description="Filtrar por acción (ej. login, logout)",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="from_date",
     *         in="query",
     *         description="Fecha de inicio (YYYY-MM-DD)",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Parameter(
     *         name="to_date",
     *         in="query",
     *         description="Fecha de fin (YYYY-MM-DD)",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Listado de actividades paginado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Activity")),
     *             @OA\Property(property="current_page", type="integer"),
     *             @OA\Property(property="total", type="integer")
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $activities = Activity::with('user')
            ->when($request->has('user_id'), function ($query) use ($request) {
                return $query->where('user_id', $request->user_id);
            })
            ->when($request->has('action'), function ($query) use ($request) {
                return $query->where('action', 'like', '%' . $request->action . '%');
            })
            ->when($request->has('from_date') && $request->has('to_date'), function ($query) use ($request) {
                return $query->whereBetween('created_at', [$request->from_date, $request->to_date]);
            })
            ->paginate(10);

        return response()->json($activities);
    }

    /**
     * Registrar una nueva actividad.
     *
     * @OA\Post(
     *     path="/api/activities",
     *     summary="Registrar una nueva actividad",
     *     tags={"Activities"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"user_id", "action"},
     *             @OA\Property(property="user_id", type="integer", example=1),
     *             @OA\Property(property="action", type="string", example="login"),
     *             @OA\Property(property="description", type="string", example="Usuario inició sesión")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Actividad creada exitosamente",
     *         @OA\JsonContent(ref="#/components/schemas/Activity")
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'action' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $activity = Activity::create($validated);
        return response()->json($activity, 201);
    }

    /**
     * Actualizar una actividad.
     *
     * @OA\Put(
     *     path="/api/activities/{id}",
     *     summary="Actualizar una actividad",
     *     tags={"Activities"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la actividad a actualizar",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"action"},
     *             @OA\Property(property="action", type="string", example="logout"),
     *             @OA\Property(property="description", type="string", example="Usuario cerró sesión")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Actividad actualizada exitosamente",
     *         @OA\JsonContent(ref="#/components/schemas/Activity")
     *     )
     * )
     */
    public function update(Request $request, Activity $activity)
    {
        $validated = $request->validate([
            'action' => 'sometimes|required|string',
            'description' => 'sometimes|nullable|string',
        ]);

        $activity->update($validated);
        return response()->json($activity);
    }

    /**
     * Eliminar una actividad.
     *
     * @OA\Delete(
     *     path="/api/activities/{id}",
     *     summary="Eliminar una actividad",
     *     tags={"Activities"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la actividad a eliminar",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Actividad eliminada correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Actividad eliminada correctamente.")
     *         )
     *     )
     * )
     */
    public function destroy(Activity $activity)
    {
        try {
            $activity->delete();
            return response()->json([
                'message' => 'Actividad eliminada correctamente.'
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error eliminando actividad: ' . $e->getMessage());
            return response()->json(['error' => 'Error eliminando actividad'], 500);
        }
    }
}