<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFasKdnsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pen_kdn', function (Blueprint $table) {
            $table->increments("id_pen_kdn");
            $table->string("kod_jenis_fas");
            $table->string("plat_no");
            $table->string("jenama");
            $table->string("model");
            $table->string("tahun_keluaran");
            $table->string("warna");
            $table->integer("pax");
            $table->string('status');
            $table->integer("statusrekod")->default(1);
            $table->string("gambar");
            $table->string("fk_id_pengguna");
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
        Schema::dropIfExists('pen_kdns');
    }
}
