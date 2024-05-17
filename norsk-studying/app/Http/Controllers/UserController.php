<?php

namespace App\Http\Controllers;

use App\Http\Requests\SignupRequest;
use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    private const SWITCH_OPTIONS = [
        ["value" => '1', "label" => 'Oui'],
        ["value" => '0', "label" => 'Non']
    ];

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $users = User::all();
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
                'code' => $e->getCode()
            ], $e->getCode());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SignupRequest $request)
    {
        try {
            $validated = (object)$request->validated();

            /** @var \App\Models\User */
            $user = User::create([
                'first_name' => $validated->first_name,
                'last_name' => $validated->last_name,
                'email' => $validated->email,
                'password' => Hash::make($validated->password)
            ]);

            if ($user) {
                return response()->json([
                    "success" => true,
                    "code" => 201,
                    "message" => "Entry create with success",
                    "data" => $user
                ], 201);
            }

            return response()->json([
                "success" => false,
                "code" => 500,
                "message" => "Impossible to create this user",
                "data" => $validated
            ], 500);
        } catch (\Throwable $e) {
            return response()->json([
                "success" => false,
                "code" => $e->getCode(),
                "message" => $e->getMessage(),
                "data" => $request->all()
            ], $e->getCode());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        try {
            if ($user)
                return response()->json([
                    "success" => true,
                    "code" => 200,
                    "message" => null,
                    "data" => $user
                ], 200);

            return response()->json([
                "success" => false,
                "code" => 404,
                "message" => "No user found",
                "data" => null
            ], 404);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'An error has occured' . $e->getMessage(),
                'success' => false,
                'code' => $e->getCode()
            ], $e->getCode());
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UserRequest $request
     * @param User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UserRequest $r, User $user): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = (object)$r->validated();

            if ($user) {
                $user->first_name = $validated->first_name;
                $user->last_name = $validated->last_name;
                $user->email = $validated->email;
                $user->admin = $validated->admin;

                if ($user->isDirty()) {
                    if ($user->save())
                        return response()->json([
                            'message' => 'Row update with success',
                            'success' => true,
                            'code' => 200
                        ], 200);

                    return response()->json([
                        'message' => 'Impossible to save',
                        'success' => false,
                        'code' => 500
                    ], 500);
                }

                return response()->json([
                    'message' => 'Nothing to change',
                    'success' => true,
                    'code' => 200
                ], 200);
            }

            return response()->json([
                'message' => 'Row not found',
                'success' => true,
                'code' => 404
            ], 404);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'An error has occured' . $th->getMessage(),
                'success' => false,
                'code' => $th->getCode()
            ], $th->getCode());
        }
    }

    public function changeAdmin(User $user): \Illuminate\Http\JsonResponse
    {
        try {
            if ($user) {
                $user->admin = !$user->admin;

                if ($user->save())
                    return response()->json([
                        "data" => $user,
                        "success" => true,
                        "code" => 200,
                        "message" => null
                    ], 200);

                return response()->json([
                    "data" => $user,
                    "success" => false,
                    "code" => 500,
                    "message" => "Something wrong happend during the changing process"
                ], 500);
            }

            return response()->json([
                "data" => null,
                "success" => false,
                "code" => 404,
                "message" => "Row not found"
            ], 404);
        } catch (\Throwable $th) {
            return response()->json([
                "data" => null,
                "success" => false,
                "code" => $th->getCode(),
                "message" => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): \Illuminate\Http\JsonResponse
    {
        try {
            if ($user) {
                if ($user->delete())
                    return response()->json([
                        'data' => $user,
                        'success' => true,
                        'code' => 200
                    ], 200);

                return response()->json([
                    'message' => 'Impossible to delete this row',
                    'success' => false,
                    'code' => 500
                ], 500);
            }

            return response()->json([
                "data" => null,
                "message" => "Row not found",
                "code" => 404,
                "success" => false
            ], 404);
        } catch (\Throwable $th) {
            return response()->json([
                "data" => null,
                "message" => $th->getMessage(),
                "code" => $th->getCode(),
                "success" => false
            ], 500);
        }
    }

    /**
     * Undocumented function
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getForm(): \Illuminate\Http\JsonResponse
    {
        try {
            $fields = [
                [
                    "key" => 'first_name',
                    "label" => 'Prénom',
                    "type" => 'text',
                    "xs" => 12,
                    "sm" => 6,
                    "rules" => [
                        "required" => true
                    ]
                ],
                [
                    "key" => 'last_name',
                    "label" => 'Nom',
                    "type" => 'text',
                    "xs" => 12,
                    "sm" => 6,
                    "rules" => [
                        "required" => true
                    ]
                ],
                [
                    "key" => 'email',
                    "label" => 'email',
                    "type" => 'text',
                    "rules" => [
                        "required" => true
                    ]
                ],
                [
                    "key" => 'password',
                    "label" => 'Mot de passe',
                    "type" => 'text',
                    "xs" => 12,
                    "sm" => 6,
                    "rules" => [
                        "required" => true
                    ]
                ],
                [
                    "key" => 'password_confirmation',
                    "label" => 'Confirmation du mot de passe',
                    "type" => 'text',
                    "xs" => 12,
                    "sm" => 6,
                    "rules" => [
                        "required" => true
                    ]
                ],
                [
                    "key" => 'admin',
                    "label" => 'Admin',
                    "type" => 'toggleRadio',
                    "value" => self::SWITCH_OPTIONS[0]["value"],
                    "options" => self::SWITCH_OPTIONS
                ]
            ];

            return response()->json([
                "fields" => $fields,
                "success" => true,
                "message" => null,
                "code" => 200
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                "data" => null,
                "message" => "An error has occured: " . $th->getMessage(),
                "success" => false,
                "code" => $th->getCode()
            ], 500);
        }
    }

    /**
     * Undocumented function
     *
     * @param User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFormEdit(User $user): \Illuminate\Http\JsonResponse
    {
        try {
            if ($user) {
                $fields = [
                    [
                        "key" => 'last_name',
                        "label" => 'Nom',
                        "type" => 'text',
                        "value" => $user->last_name,
                        "xs" => 12,
                        "sm" => 6,
                        "rules" => [
                            "required" => true
                        ]
                    ],
                    [
                        "key" => 'first_name',
                        "label" => 'Prénom',
                        "type" => 'text',
                        "value" => $user->first_name,
                        "xs" => 12,
                        "sm" => 6,
                        "rules" => [
                            "required" => true
                        ]
                    ],
                    [
                        "key" => 'email',
                        "label" => 'Email',
                        "type" => 'text',
                        "value" => $user->email,
                        "xs" => 12,
                        "sm" => 6,
                        "rules" => [
                            "required" => true
                        ]
                    ],
                    [
                        "key" => 'admin',
                        "label" => 'Admin',
                        "type" => 'toggleRadio',
                        "xs" => 12,
                        "sm" => 6,
                        "value" => (string)$user->admin,
                        "options" => self::SWITCH_OPTIONS
                    ]
                ];

                return response()->json([
                    "fields" => $fields,
                    "success" => true,
                    "message" => null,
                    "code" => 200
                ], 200);
            }

            return response()->json([
                'message' => 'Row not found',
                'success' => false,
                'code' => 404
            ], 404);
        } catch (\Throwable $th) {
            return response()->json([
                "data" => null,
                "message" => "An error has occured: " . $th->getMessage(),
                "success" => false,
                "code" => $th->getCode()
            ], 500);
        }
    }
}
