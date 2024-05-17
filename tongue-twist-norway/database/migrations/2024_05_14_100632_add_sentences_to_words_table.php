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
        $importFile = fopen(public_path('imports/import-sentences-1.csv'), 'r');
        $table = DB::table('words');
        while (($buffer = fgets($importFile, 4096)) !== false) {
            $explodeString = explode(';', trim($buffer));
            $table->insert([
                "norwegian" => $explodeString[0],
                "french" => $explodeString[1],
                "help" => $explodeString[2] ?? null,
                "type" => 4,
                "status" => 1,
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
        Schema::table('words', function (Blueprint $table) {
            //
        });
    }
};
