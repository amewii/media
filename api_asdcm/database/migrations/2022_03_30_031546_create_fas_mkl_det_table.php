<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFasMklDetTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pen_mkl_det', function (Blueprint $table) {
            $table->increments('id_pen_mkl_det');
            $table->string('id_pen_mkl');
            $table->string('item');
            $table->integer('bilangan');
            $table->string('jenama');
            $table->string('status');
            $table->integer('statusrekod')->default(1);
            $table->string('gambar');
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
        Schema::dropIfExists('pen_mkl_det');
    }
}
