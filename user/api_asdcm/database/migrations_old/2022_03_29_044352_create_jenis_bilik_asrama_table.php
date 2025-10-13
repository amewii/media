<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJenisBilikAsramaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('jenis_bilik_asrama', function (Blueprint $table) {
            $table->increments('id_jenis_bilik_asrama');
            $table->string('kod_jenis_bilik_asrama');
            $table->string('jenis_bilik_asrama');
            $table->string('status');
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
        Schema::dropIfExists('jenis_bilik_asrama');
    }
}
