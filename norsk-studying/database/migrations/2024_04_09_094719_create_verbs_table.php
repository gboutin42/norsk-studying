<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('verbs', function (Blueprint $table) {
            $table->id();
            $table->string("translation")->nullable(false);
            $table->string("infinitiv")->nullable(false);
            $table->string("present")->nullable(false);
            $table->string("preteritum")->nullable()->default(null);
            $table->string("perfektum")->nullable()->default(null);
            $table->boolean("status")->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('verbs');
    }
};
