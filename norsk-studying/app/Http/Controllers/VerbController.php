<?php

namespace App\Http\Controllers;

use App\Http\Requests\VerbRequest;
use App\Models\Verb;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class VerbController extends Controller
{
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
        $verb = $this->getNextRandomVerb($id ?? 0);
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
        $verbs = Verb::whereStatus(1)->get();
        $length = $verbs->count();
        if ($length >= 1) {
            $random = random_int(1, $length);
            while ($random === $previousId) {
                $random = random_int(1, $length);
            }
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
                            'status' => 200
                        ], 200);

                    return response()->json([
                        'message' => 'Impossible to save',
                        'success' => false,
                        'status' => 500
                    ], 500);
                }

                return response()->json([
                    'message' => 'Nothing to change',
                    'success' => true,
                    'status' => 200
                ], 200);
            }

            return response()->json([
                'message' => 'Row not found',
                'success' => true,
                'status' => 404
            ], 404);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'An error has occured' . $e->getMessage(),
                'success' => false,
                'status' => $e->getCode()
            ], $e->getCode());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $verb = Verb::find($id);
            if ($verb) {
                if ($verb->delete())
                    return response()->json([
                        'data' => ['id' => $id],
                        'success' => true,
                        'status' => 200
                    ], 200);

                return response()->json([
                    'message' => 'Impossible to delete this row',
                    'success' => false,
                    'status' => 500
                ], 500);
            }

            return response()->json([
                'message' => 'Row not found',
                'success' => false,
                'status' => 404
            ], 404);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'success' => false,
                'status' => 500
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
                if ($verbOrigin->{$key} && Str::lower(trim($answer, " \n\r\t\v\x00.?")) !== $verbOrigin->{$key}) {
                    $isMatch = false;
                    $errors[$key] = true;
                }
            }

            return $isMatch
                ? response()->json(
                    [
                        "success" => true,
                        "status" => 200
                    ]
                )
                : response()->json(
                    [
                        "data" => $errors,
                        "success" => false,
                        "status" => 400
                    ]
                );
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage(),
                'success' => false,
                'status' => 500
            ], 500);
        }
    }

    public function getForm()
    {
        try {

            $fields = [
                [
                    "key" => 'norwegian',
                    "label" => 'Norvégien',
                    "type" => 'text',
                    "xs" => 12,
                    "sm" => 6,
                    "rules" => [
                        "required" => true
                    ]
                ],
                [
                    "key" => 'french',
                    "label" => 'Français',
                    "type" => 'text',
                    "xs" => 12,
                    "sm" => 6,
                    "rules" => [
                        "required" => true
                    ]
                ],
                [
                    "key" => 'help',
                    "label" => 'Aide',
                    "type" => 'text',
                    "xs" => 12,
                    "sm" => 6
                ],
                [
                    "key" => 'type',
                    "label" => 'Prénom',
                    "type" => "select",
                    "value" => self::WORD_TYPE[0]['value'],
                    "options" => self::WORD_TYPE,
                    "rules" => [
                        "required" => true
                    ]

                ],
                [
                    "key" => 'status',
                    "label" => 'Email',
                    "type" => 'toggleRadio',
                    "value" => self::SWITCH_OPTIONS[1]["value"],
                    "options" => self::SWITCH_OPTIONS,
                    "rules" => [
                        "required" => true
                    ]
                ]
            ];


            return response()->json([
                "data" => $fields,
                "success" => true,
                "message" => null
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

    public function getFormEdit(int $id)
    {
        try {
            //code...
        } catch (\Throwable $th) {
            //throw $th;
        }
    }
}
