<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::first();
if ($user) {
    $user->password = \Illuminate\Support\Facades\Hash::make('password123');
    $user->save();
    echo "Password successfully reset to password123\n";
} else {
    echo "User not found\n";
}
