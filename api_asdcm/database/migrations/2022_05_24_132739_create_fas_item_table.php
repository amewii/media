<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFasItemTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pen_item', function (Blueprint $table) {
            $table->increments('id_pen_item');
            $table->string('flag_jenis_peralatan');
            $table->string('nama_peralatan');
            $table->string('kuantiti');
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
        Schema::dropIfExists('pen_item');
    }
}
