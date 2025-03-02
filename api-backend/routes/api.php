<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AuthController;

Route::middleware('auth:api')->group(function () {
    Route::apiResource('users', UserController::class);
    Route::apiResource('activities', ActivityController::class);
    
    Route::get('reports/recent-users', [ReportController::class, 'recentUsers']);
    Route::get('reports/active-users', [ReportController::class, 'activeUsers']);
    Route::get('reports/user-actions', [ReportController::class, 'userActions']);
    Route::get('reports/activity-metrics', [ReportController::class, 'activityMetrics']);
    Route::get('/api-docs.json', function () {
        return response()->file(storage_path('api-docs/api-docs.json'));
    });
    Route::get('/test', function () {
        return response()->json(['message' => 'API working']);
    });
});

Route::middleware('auth:api')->post('/refresh', [AuthController::class, 'refresh']);
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('user', [AuthController::class, 'user'])->middleware('auth:api');
