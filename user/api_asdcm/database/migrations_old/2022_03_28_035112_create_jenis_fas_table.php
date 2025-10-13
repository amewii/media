<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJenisFasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('jenis_fas', function (Blueprint $table) {
            $table->increments("id_jenis_fas");
            $table->string("kod_jenis_fas");
            $table->string("jenis_fas");
            $table->string('status');
            $table->integer('statusrekod')->default(1);
            $table->string('prebooking_requirement');
            $table->string('cancellation_requirement');
            $table->string('tempoh_tempahan');
            $table->integer('weekend_status');
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
        Schema::dropIfExists('jenis_fas');
    }
}
