<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFasAsrBiliksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pen_asr_bilik', function (Blueprint $table) {
            $table->increments('id_pen_asr_bilik');
            $table->string('id_pen_asr');
            $table->string('id_pen_asr_blok');
            $table->string('no_bilik');
            $table->string('level');
            $table->string('kapasiti');
            $table->string('id_jenis_bilik_asrama');
            $table->string('layout');
            $table->string('keluasan');
            $table->string('status');
            $table->integer('statusrekod')->default(1);
            $table->string('gambar');
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
        Schema::dropIfExists('pen_asr_biliks');
    }
}
