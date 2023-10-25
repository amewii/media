<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFasAsrBlokTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pen_asr_blok', function (Blueprint $table) {
            $table->increments('id_pen_asr_blok');
            $table->string('id_pen_asr');
            $table->string('blok');
            $table->string('bil_level');
            $table->integer('statusrekod')->default(1);
            $table->string('created_by');
            $table->string('updated_by');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pen_asr_blok');
    }
}
