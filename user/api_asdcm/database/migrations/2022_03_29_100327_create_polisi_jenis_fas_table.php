<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePolisiJenisFasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('polisi_jenis_fas', function (Blueprint $table) {
            $table->increments('id_polisi_jenis_fas');
            $table->string('kod_jenis_fas');
            $table->string('fk_id_pengguna');
            $table->string('id_kampuses');
            $table->dateTime('tempoh_tempahan_mula');
            $table->dateTime('tempoh_tempahan_tamat');
            $table->integer('weekend_status');
            $table->string('prebooking_requirement');
            $table->string('cancellation_requirement');
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
        Schema::dropIfExists('polisi_jenis_fas');
    }
}
