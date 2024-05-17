<?php

namespace App\Http\Controllers;

use App\Http\Requests\VerbRequest;
use App\Models\Verb;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class VerbController extends Controller
{
    private const SWITCH_OPTIONS = [
        ["value" => '1', "label" => 'Actif'],
        ["value" => '0', "label" => 'Inactif']
    ];

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): \Illuminate\Http\JsonResponse
    {
        try {
            $verbs = Verb::all();
            if ($verbs->count() > 0)
                return response()->json([
                    "success" => true,
                    "code" => 200,
                    "message" => null,
                    "data" => $verbs->toArray()
                ], 200);

            return response()->json([
                "success" => false,
                "code" => 500,
                "message" => "No datas",
                "data" => null
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "code" => $th->getCode(),
                "message" => $th->getMessage(),
                "data" => null
            ], $th->getCode);
        }
    }

    /**
     * Display a verb to translate.
     *
     * @param integer $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(int $id = 0): \Illuminate\Http\JsonResponse
    {
        try {
            $verb = $this->getNextRandomVerb($id ?? 0);

            if ($verb) {
                $whichDisplayed = $this->getFieldToDisplay();

                while ($verb->{$whichDisplayed} === null)
                    $whichDisplayed = $this->getFieldToDisplay();

                return response()->json([
                    "success" => true,
                    "code" => 200,
                    "message" => null,
                    "data" => [
                        "verb" => $verb,
                        "whichDisplayed" => $whichDisplayed
                    ]
                ], 200);
            }

            return response()->json([
                "success" => false,
                "code" => 404,
                "message" => "Empty data",
                "data" => null

            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "code" => $th->getCode(),
                "message" => $th->getMessage(),
                "data" => null

            ]);
        }
    }

    /**
     * Gets a random field to display
     *
     * @return mixed
     */
    private function getFieldToDisplay(): mixed
    {
        return Arr::random([
            "translation",
            "infinitiv",
            "present",
            "preteritum",
            "perfektum"
        ]);
    }

    /**
     * Get the next random verb to display from a previous id.
     *
     * @param integer $previousId
     * @return \App\Models\Verb|null
     */
    private function getNextRandomVerb(int $previousId = 0): \App\Models\Verb|null
    {
        $verbIds = Verb::whereStatus(1)->pluck("id")->toArray();

        if (count($verbIds) > 0) {
            $random = Arr::random($verbIds);
            while ($random === $previousId)
                $random = Arr::random($verbIds);
            $verb = $this->getOne($random);

            return $verb ?? $this->getNextRandomWord($previousId);
        }

        return null;
    }

    /**
     * Get model by an id and return it or return null if nothing's found.
     *
     * @param integer $id
     * @return \App\Models\Verb|null
     */
    private function getOne(int $id): \App\Models\Verb|null
    {
        return Verb::whereStatus(1)->whereId($id)->first();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param VerbRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(VerbRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = (object)$request->validated();
            Verb::create([
                'translation' => $validated->translation,
                'infinitiv' => $validated->infinitiv,
                'present' => $validated->present,
                'preteritum' => $validated->preteritum ?? null,
                'perfektum' => $validated->perfektum ?? null,
                'status' => $validated->status ? 1 : 0
            ]);

            return response()->json([
                "success" => true,
                "code" => 201,
                "message" => "Entry create with success",
                "data" => (array)$validated
            ], 201);
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
     * Update the specified resource in storage.
     *
     * @param VerbRequest $r
     * @param integer $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(VerbRequest $r, int $id): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = (object)$r->validated();
            $verb = Verb::find($id);

            if ($verb) {
                $verb->translation = $validated->translation;
                $verb->infinitiv = $validated->infinitiv;
                $verb->present = $validated->present;
                $verb->preteritum = $validated->preteritum;
                $verb->perfektum = $validated->perfektum;
                $verb->status = $validated->status;

                if ($verb->isDirty()) {
                    if ($verb->save())
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
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'An error has occured' . $e->getMessage(),
                'success' => false,
                'code' => $e->getCode()
            ], $e->getCode());
        }
    }

    /**
     * Remove the specified resource from database
     *
     * @param Verb $verb
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Verb $verb): \Illuminate\Http\JsonResponse
    {
        try {
            if ($verb) {
                if ($verb->delete())
                    return response()->json([
                        'data' => $verb,
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
                'message' => 'Row not found',
                'success' => false,
                'code' => 404
            ], 404);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'success' => false,
                'code' => 500
            ], 500);
        }
    }

    /**
     * Undocumented function
     *
     * @param Request $r
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkAnswer(Request $r): \Illuminate\Http\JsonResponse
    {
        try {
            $inputs = (object)$r->all();

            $id = $inputs->id;
            $answers = $inputs->answers;
            $verbOrigin = $this->getOne($id);
            $isMatch = true;
            foreach ($answers as $key => $answer) {
                $answer = Str::lower(trim($answer, " \n\r\t\v\x00.!?"));

                if ($verbOrigin->{$key} && Str::contains('/', $verbOrigin->{$key})) {
                    $originKeyArrays = explode('/', $verbOrigin->{$key});
                    if (count($originKeyArrays) > 0 && !in_array($answer, $originKeyArrays)) {
                        $isMatch = false;
                        $errors[$key] = true;
                    }
                } else if ($verbOrigin->{$key} && $answer !== $verbOrigin->{$key}) {
                    $isMatch = false;
                    $errors[$key] = true;
                }
            }

            return $isMatch
                ? response()->json(
                    [
                        "success" => true,
                        "code" => 200
                    ]
                )
                : response()->json(
                    [
                        "data" => $errors,
                        "success" => false,
                        "code" => 400
                    ]
                );
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage(),
                'success' => false,
                'code' => 500
            ], 500);
        }
    }

    /**
     * Disables or enables the verb
     *
     * @param Verb $verb
     * @return \Illuminate\Http\JsonResponse
     */
    public function disable(Verb $verb): \Illuminate\Http\JsonResponse
    {
        try {
            if ($verb) {
                $verb->status = !$verb->status;
                if ($verb->save())
                    return response()->json([
                        "data" => $verb,
                        "message" => "",
                        "success" => true,
                        "code" => 200
                    ]);

                return response()->json([
                    "data" => $verb,
                    "message" => "Something wrong happend during the disabling process",
                    "success" => false,
                    "code" => 500
                ]);
            }

            return response()->json([
                'message' => 'Row not found',
                'success' => false,
                'code' => 404
            ], 404);
        } catch (\Throwable $th) {
            return response()->json([
                "data" => null,
                "message" => $th->getMessage(),
                "success" => false,
                "code" => $th->getCode()
            ]);
        }
    }

    /**
     * Gets form to create a new row in verbs table
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getForm(): \Illuminate\Http\JsonResponse
    {
        try {
            $fields = [
                [
                    "key" => 'translation',
                    "label" => 'Français',
                    "type" => 'text',
                    "rules" => [
                        "required" => true
                    ]
                ],
                [
                    "key" => 'infinitiv',
                    "label" => 'Infinitif',
                    "type" => 'text',
                    "rules" => [
                        "required" => true
                    ]
                ],
                [
                    "key" => 'present',
                    "label" => 'Présent',
                    "type" => 'text',
                    "rules" => [
                        "required" => true
                    ]
                ],
                [
                    "key" => 'preteritum',
                    "label" => 'Preteritum',
                    "type" => 'text',
                ],
                [
                    "key" => 'perfektum',
                    "label" => 'Perfectum',
                    "type" => 'text',
                ],
                [
                    "key" => 'status',
                    "label" => 'Statut',
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
     * Gets form to update a row in verbs table
     *
     * @param Verb $verb
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFormEdit(Verb $verb): \Illuminate\Http\JsonResponse
    {
        try {
            if ($verb) {
                $fields = [

                    [
                        "key" => 'translation',
                        "label" => 'Français',
                        "type" => 'text',
                        "value" => $verb->translation,
                        "rules" => [
                            "required" => true
                        ]
                    ],
                    [
                        "key" => 'infinitiv',
                        "label" => 'Infinitif',
                        "type" => 'text',
                        "value" => $verb->infinitiv,
                        "rules" => [
                            "required" => true
                        ]
                    ],
                    [
                        "key" => 'present',
                        "label" => 'Présent',
                        "type" => 'text',
                        "value" => $verb->present,
                        "rules" => [
                            "required" => true
                        ]
                    ],
                    [
                        "key" => 'preteritum',
                        "label" => 'Preteritum',
                        "type" => 'text',
                        "value" => $verb->preteritum ?? null,
                    ],
                    [
                        "key" => 'perfektum',
                        "label" => 'Perfectum',
                        "type" => 'text',
                        "value" => $verb->perfektum ?? null,
                    ],
                    [
                        "key" => 'status',
                        "label" => 'Statut',
                        "type" => 'toggleRadio',
                        "value" => (string)$verb->status,
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
                "message" => $th->getMessage(),
                "code" => $th->getCode(),
                "success" => false
            ], 500);
        }
    }
}
