<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFasAsrsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pen_asr', function (Blueprint $table) {
            $table->increments("id_pen_asr");
            $table->string("kod_jenis_fas");
            $table->string("nama_asrama");
            $table->string("lokasi");
            $table->string('status');
            $table->integer("statusrekod")->default(1);
            $table->string("nama_pic");
            $table->string("notel_pic");
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
        Schema::dropIfExists('pen_asrs');
    }
}
