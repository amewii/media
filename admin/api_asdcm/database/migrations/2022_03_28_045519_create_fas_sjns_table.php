<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFasSjnsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pen_sjn', function (Blueprint $table) {
            $table->increments("id_pen_sjn");
            $table->string("kod_jenis_fas");
            $table->string("nama_sajian");
            $table->string('status');
            $table->dateTime('masa_mula', $precision = 0);
            $table->dateTime('masa_tamat', $precision = 0);
            $table->integer('statusrekod')->default(1);
            $table->bigInteger('FK_id_pengguna');
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
        Schema::dropIfExists('pen_sjns');
    }
}
