<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFasBlksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pen_blk', function (Blueprint $table) {
            $table->increments("id_pen_blk");
            $table->string("kod_jenis_fas");
            $table->string("nama_bilik");
            $table->integer("kapasiti");
            $table->string("layout");
            $table->string("keluasan");
            $table->string('status');
            $table->integer('statusrekod')->default(1);
            $table->string("gambar");
            $table->string("lokasi");
            $table->bigInteger("FK_id_pengguna");
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
        Schema::dropIfExists('pen_blks');
    }
}
