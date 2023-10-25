<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class MedAsadi extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('med_asadi', function (Blueprint $table) {
            $table->increments('id_med_asadi');
            $table->string('nama');
            $table->string('lokasi');
            $table->integer('statusrekod')->default(1);
            $table->string('updated_by');
            $table->string('created_by');
            $table->timestamps();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
