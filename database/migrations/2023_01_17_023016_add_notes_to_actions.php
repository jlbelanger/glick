<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() : void
	{
		Schema::table('actions', function (Blueprint $table) {
			$table->text('notes')->nullable()->after('value');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() : void
	{
		Schema::table('actions', function (Blueprint $table) {
			$table->dropColumn('notes');
		});
	}
};
