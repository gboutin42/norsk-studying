<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('word_types', function (Blueprint $table) {
            $table->id();
            $table->string("type");
            $table->timestamps();
        });
        $types = ["Tout", "Verbes", "Mots", "Phrases"];
        foreach ($types as $type) {
            DB::table('word_types')->insert(["type" => $type, "created_at" => now(), "updated_at" => now()]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('word_types');
    }
};
