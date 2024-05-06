<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $users = User::all();
            return "coucou";
            return response()->json([
                "success" => true,
                "code" => 200,
                "message" => null,
                "data" => $users->toArray()
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'An error has occured' . $e->getMessage(),
                'success' => false,
                'status' => $e->getCode()
            ], $e->getCode());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $user = User::find($id);
            if ($user) {
                return response()->json([
                    "success" => true,
                    "code" => 200,
                    "message" => null,
                    "data" => $user
                ], 200);
            } else {
                return response()->json([
                    "success" => true,
                    "code" => 200,
                    "message" => "No user found",
                    "data" => null
                ], 200);
            }
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'An error has occured' . $e->getMessage(),
                'success' => false,
                'status' => $e->getCode()
            ], $e->getCode());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
