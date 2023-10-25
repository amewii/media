<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFasJenamaKdnTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pen_jenama_kdn', function (Blueprint $table) {
            $table->increments('id_pen_jenama_kdn');
            $table->string('jenama');
            $table->bigInteger('FK_kampus');
            $table->string('statusrekod');
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
        Schema::dropIfExists('pen_jenama_kdn');
    }
}
