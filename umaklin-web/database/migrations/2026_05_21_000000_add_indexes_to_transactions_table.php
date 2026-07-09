<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Index on date for time-series queries
            $table->index('date');

            // Index on user_id for filtering user transactions
            $table->index('user_id');

            // Index on service_id for service filtering
            $table->index('service_id');

            // Index on payment_status for filtering unpaid/paid transactions
            $table->index('payment_status');

            // Composite index on user_id and date for common queries
            $table->index(['user_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex('transactions_date_index');
            $table->dropIndex('transactions_user_id_index');
            $table->dropIndex('transactions_service_id_index');
            $table->dropIndex('transactions_payment_status_index');
            $table->dropIndex('transactions_user_id_date_index');
        });
    }
};
