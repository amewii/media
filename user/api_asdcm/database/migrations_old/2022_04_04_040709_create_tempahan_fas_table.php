<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTempahanFasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tempahan_fas', function (Blueprint $table) {
            $table->increments('id_tempahan_fas');
            $table->string('kod_program');
            $table->string('nama_program');
            $table->date('tarikh_mula');
            $table->date('tarikh_tamat');
            $table->string('kampus');
            $table->string('nama_pic');
            $table->string('notel_pic');
            $table->string('status');
            $table->integer('statusrekod')->default(1);
            $table->string('catatan_batal');
            $table->string('status_batal');
            $table->string('status_tempahan');
            $table->string('lokasi');
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
        Schema::dropIfExists('tempahan_fas');
    }
}
