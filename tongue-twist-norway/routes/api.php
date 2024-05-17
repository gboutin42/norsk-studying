<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VerbController;
use App\Http\Controllers\WordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    /** Logout route */
    Route::post('/logout', [AuthController::class, 'logout']);

    /**
     * Users routes
     */
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/form', [UserController::class, 'getForm']);
        Route::prefix('{user}')->group(function () {
            Route::get('/', [UserController::class, 'show']);
            Route::patch('/', [UserController::class, 'update']);
            Route::delete('/', [UserController::class, 'destroy']);
            Route::patch('/admin', [UserController::class, 'changeAdmin']);
            Route::get('/form', [UserController::class, 'getFormEdit']);
        });
    });

    /**
     * Verbs routes
     */
    Route::prefix('verbs')->group(function () {
        Route::get('/', [VerbController::class, 'index']);
        Route::post('/', [VerbController::class, 'store']);
        Route::post('/check-answer', [VerbController::class, 'checkAnswer']);
        Route::get('/form', [VerbController::class, 'getForm']);
        Route::prefix('{verb}')->group(function () {
            Route::get('/form', [VerbController::class, 'getFormEdit']);
            Route::patch('/', [VerbController::class, 'update']);
            Route::patch('/disable', [VerbController::class, 'disable']);
            Route::delete('/', [VerbController::class, 'destroy']);
        });
        Route::get('/{id?}', [VerbController::class, 'show']);
    });

    /**
     * Words routes
     */
    Route::prefix('words')->group(function () {
        Route::get('/', [WordController::class, 'index']);
        Route::post('/', [WordController::class, 'store']);
        Route::post('/check-answer', [WordController::class, 'checkAnswer']);
        Route::get('/form', [WordController::class, 'getForm']);
        Route::prefix('{word}')->group(function () {
            Route::get('/form', [WordController::class, 'getFormEdit']);
            Route::patch('/', [WordController::class, 'update']);
            Route::patch('/disable', [WordController::class, 'disable']);
            Route::delete('/', [WordController::class, 'destroy']);
        });
        Route::get('/{id?}/{type?}', [WordController::class, 'show']);
    });
});

/**
 * Auth routes
 */
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
