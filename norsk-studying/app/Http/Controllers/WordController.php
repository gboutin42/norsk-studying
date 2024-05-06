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
            $words = Verb::whereStatus(1)->get();
        } else {
            $words = $type === self::TYPE_ALL
                ? Word::whereStatus(1)->get()
                : Word::whereStatus(1)->whereType($type)->get();
        }
        $length = $words->count();
        if ($length >= 1) {
            $random = random_int(1, $length);
            while ($random === $previousId) {
                $random = random_int(1, $length);
            }
            $word = $this->getOne($random, $type);

            return $word ?? $this->getNextRandomWord($previousId);
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

        $langToCheck = $inputs->lang === 'norwegian' ? 'french' : 'norwegian';
        $answer = trim($inputs->answer, " \n\r\t\v\x00.?");

        $wordOrigin = $this->getOne($inputs->id, $inputs->type);
        $words = explode('/', $wordOrigin->{$langToCheck});

        $isMatch = false;
        foreach ($words as $word) {
            if (Str::lower(trim($word, " \n\r\t\v\x00.?")) === Str::lower($answer))
                $isMatch = true;
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
                    "data" => $wordOrigin,
                    "success" => false,
                    "status" => 400
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
                : Word::whereStatus(1)->whereType($type)->whereId($id)->first();
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
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(WordRequest $r, string $id): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = (object)$r->validated();
            $word = Word::find($id);

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
            $word = Word::find($id);
            if ($word) {
                if ($word->delete())
                    return response()->json([
                        'id' => $id,
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
}
