<?php

namespace App\Http\Controllers;

use App\Http\Requests\WordRequest;
use App\Models\Verb;
use App\Models\Word;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class WordController extends Controller
{
    const TYPE_ALL = 1;
    const TYPE_VERB = 2;
    const TYPE_WORD = 3;
    const TYPE_SENTENCE = 4;

    private const WORD_TYPE = [
        ["value" => '3', "label" => 'Mot'],
        ["value" => '4', "label" => 'Phrase'],
    ];

    private const SWITCH_OPTIONS = [
        ["value" => '1', "label" => 'Actif'],
        ["value" => '0', "label" => 'Inactif']
    ];

    /**
     * Display a listing of the resource.
     */
    public function index(): \Illuminate\Http\JsonResponse
    {
        try {
            $words = Word::all();
            if ($words->count() > 0)
                return response()->json([
                    "success" => true,
                    "code" => 200,
                    "message" => null,
                    "data" => $words->toArray()
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
     * Display a word to translate.
     *
     * @param integer $id
     * @param integer $type
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(int $id = 0, int $type): \Illuminate\Http\JsonResponse
    {
        if ($type)
            return response()->json([
                "success" => true,
                "code" => 200,
                "message" => null,
                "data" => [
                    "word" => $this->getNextRandomWord($id ?? 0, $type),
                    "lang" => Arr::random(['norwegian', 'french'])
                ]
            ], 200);

        return response()->json([
            "success" => false,
            "code" => 500,
            "message" => "A type is necessary",
            "data" => null
        ], 500);
    }

    /**
     * Get the next random word to display from a type and a previous id.
     *
     * @param integer $previousId
     * @param integer $type
     * @return \App\Models\Verb|\App\Models\Word|null
     */
    private function getNextRandomWord(int $previousId = 0, int $type = 1): \App\Models\Verb|\App\Models\Word|null
    {
        if ($type === self::TYPE_VERB) {
            $ids = Verb::whereStatus(1)->pluck("id")->toArray();
        } else {
            $ids = $type === self::TYPE_ALL
                ? Word::whereStatus(1)->pluck("id")->toArray()
                : Word::whereStatus(1)->where("type", $type)->pluck("id")->toArray();
        }

        if (count($ids) > 0) {
            $random = Arr::random($ids);
            while ($random === $previousId)
                $random = Arr::random($ids);
            $word = $this->getOne($random, $type);

            return $word ?? $this->getNextRandomWord($previousId, $type);
        }

        return null;
    }


    /**
     * Checks the answer
     *
     * @param Request $r
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkAnswer(Request $r): \Illuminate\Http\JsonResponse
    {
        $inputs = (object)$r->all();
        $toTrim = " \n\r\t\v\x00.!?";

        $langToCheck = $inputs->lang === 'norwegian' ? 'french' : 'norwegian';
        $answer = trim($inputs->answer, $toTrim);

        $wordOrigin = $this->getOne($inputs->id, $inputs->type);
        $words = explode('/', $wordOrigin->{$langToCheck});

        $isMatch = false;
        foreach ($words as $word) {
            if (Str::lower(trim($word, $toTrim)) === Str::lower($answer))
                $isMatch = true;
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
                    "data" => $wordOrigin,
                    "success" => false,
                    "code" => 400
                ]
            );
    }

    /**
     * Get model by id and type or return null if nothing's found.
     *
     * @param integer $id
     * @param integer $type
     * @return \App\Models\Verb|\App\Models\Word|null
     */
    private function getOne(int $id, int $type = 1): \App\Models\Verb|\App\Models\Word|null
    {
        if ($type === self::TYPE_VERB) {
            $result = Verb::whereStatus(1)->whereId($id)->first();
        } else {
            $result = $type === self::TYPE_ALL
                ? Word::whereStatus(1)->whereId($id)->first()
                : Word::whereStatus(1)->where("type", $type)->whereId($id)->first();
        }

        return $result;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(WordRequest $request)
    {
        try {
            $validated = (object)$request->validated();
            Word::create([
                'norwegian' => $validated->norwegian,
                'french' => $validated->french,
                'type' => $validated->type,
                'help' => $validated->help ?? null,
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
     * @param WordRequest $r
     * @param Word $word
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(WordRequest $r, Word $word): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = (object)$r->validated();

            if ($word) {
                $word->norwegian = $validated->norwegian;
                $word->french = $validated->french;
                $word->help = $validated->help;
                $word->type = $validated->type;
                $word->status = $validated->status;

                if ($word->isDirty()) {
                    if ($word->save())
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
     * Remove the specified resource from storage.
     *
     * @param Word $word
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Word $word): \Illuminate\Http\JsonResponse
    {
        try {
            if ($word) {
                if ($word->delete())
                    return response()->json([
                        'data' => $word,
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
     * Disables or enables the word
     *
     * @param Word $word
     * @return \Illuminate\Http\JsonResponse
     */
    public function disable(Word $word): \Illuminate\Http\JsonResponse
    {
        try {
            if ($word) {
                $word->status = !$word->status;
                if ($word->save())
                    return response()->json([
                        "data" => $word,
                        "message" => "",
                        "success" => true,
                        "code" => 200
                    ]);

                return response()->json([
                    "data" => $word,
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
     * Gets form to create a new row in words table
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getForm(): \Illuminate\Http\JsonResponse
    {
        try {
            $fields = [
                [
                    "key" => 'norwegian',
                    "label" => 'Norvégien',
                    "type" => 'text',
                    "rules" => [
                        "required" => true
                    ]
                ],
                [
                    "key" => 'french',
                    "label" => 'Français',
                    "type" => 'text',
                    "rules" => [
                        "required" => true
                    ]
                ],
                [
                    "key" => 'help',
                    "label" => 'Aide',
                    "type" => 'text',
                ],
                [
                    "key" => 'type',
                    "label" => 'Type',
                    "type" => "select",
                    "value" => self::WORD_TYPE[0]['value'],
                    "options" => self::WORD_TYPE,
                    "xs" => 12,
                    "sm" => 6,
                    "rules" => [
                        "required" => true
                    ]

                ],
                [
                    "key" => 'status',
                    "label" => 'Statut',
                    "type" => 'toggleRadio',
                    "value" => self::SWITCH_OPTIONS[0]["value"],
                    "options" => self::SWITCH_OPTIONS,
                    "xs" => 12,
                    "sm" => 6
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
     * Gets form to update a row in words table
     *
     * @param Word $word
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFormEdit(Word $word): \Illuminate\Http\JsonResponse
    {
        try {
            if ($word) {
                $fields = [
                    [
                        "key" => 'norwegian',
                        "label" => 'Norvégien',
                        "type" => 'text',
                        "value" => $word->norwegian,
                        "rules" => [
                            "required" => true
                        ]
                    ],
                    [
                        "key" => 'french',
                        "label" => 'Français',
                        "type" => 'text',
                        "value" => $word->french,
                        "rules" => [
                            "required" => true
                        ]
                    ],
                    [
                        "key" => 'help',
                        "label" => 'Aide',
                        "type" => 'text',
                        "value" => $word->help
                    ],
                    [
                        "key" => 'type',
                        "label" => 'Type',
                        "type" => "select",
                        "value" => (string)$word->type,
                        "options" => self::WORD_TYPE,
                        "xs" => 12,
                        "sm" => 6,
                        "rules" => [
                            "required" => true
                        ]

                    ],
                    [
                        "key" => 'status',
                        "label" => 'Statut',
                        "type" => 'toggleRadio',
                        "value" => (string)$word->status,
                        "options" => self::SWITCH_OPTIONS,
                        "xs" => 12,
                        "sm" => 6
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
