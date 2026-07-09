<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusChanged extends Notification
{
    use Queueable;

    protected $transaction;
    protected $message;

    public function __construct($transaction, $message)
    {
        $this->transaction = $transaction;
        $this->message = $message;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'transaction_id' => $this->transaction->id,
            'receipt_number' => $this->transaction->receipt_number,
            'status' => $this->transaction->status,
            'message' => $this->message,
            'icon' => $this->getIcon(),
        ];
    }

    protected function getIcon()
    {
        $icons = [
            'pending' => 'clock',
            'washing' => 'waves',
            'ironing' => 'star',
            'done' => 'check-circle',
            'delivered' => 'package',
        ];
        return $icons[$this->transaction->status] ?? 'bell';
    }
}
