<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $importFile = fopen(public_path('imports/import-verbs-1.csv'), 'r');
        $table = DB::table('verbs');
        while (($buffer = fgets($importFile, 4096)) !== false) {
            $explodeString = explode(';', trim($buffer));
            $table->insert([
                "translation" => trim($explodeString[0]),
                "infinitiv" => trim($explodeString[1]),
                "present" => trim($explodeString[2]),
                "preteritum" => $explodeString[3] && trim($explodeString[3]) !== "" ? trim($explodeString[3]) : null,
                "created_at" => now('Europe/Paris'),
                "updated_at" => now('Europe/Paris')
            ]);
        }
        fclose($importFile);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('verbs', function (Blueprint $table) {
            //
        });
    }
};
