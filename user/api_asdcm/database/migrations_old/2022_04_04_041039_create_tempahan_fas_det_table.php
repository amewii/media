<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTempahanFasDetTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tempahan_pen_det', function (Blueprint $table) {
            $table->increments('id_tempahan_pen_det');
            $table->string('id_tempahan_fas');
            $table->string('kod_jenis_fas');
            $table->string('status_pengesahan');
            $table->string('catatan');
            $table->string('status');
            $table->integer('statusrekod')->default(1);
            $table->string('catatan_batal');
            $table->string('status_batal');
            $table->string('updated_by');
            $table->string('created_by');
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
        Schema::dropIfExists('tempahan_pen_det');
    }
}
