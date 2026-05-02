<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\MessageController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [PublicController::class, 'index'])->name('home');
Route::post('/contact', [PublicController::class, 'storeMessage'])->name('contact.store');

Route::middleware(['auth', 'verified'])->prefix('dashboard')->group(function () {
    Route::get('/', function () {
        $projectsCount = \App\Models\Project::count();
        $messagesCount = \App\Models\Message::count();
        return Inertia::render('Dashboard', [
            'projectsCount' => $projectsCount,
            'messagesCount' => $messagesCount,
        ]);
    })->name('dashboard');

    Route::resource('projects', ProjectController::class);
    Route::resource('messages', MessageController::class)->only(['index', 'show', 'destroy']);
    Route::post('messages/{message}/read', [MessageController::class, 'markAsRead'])->name('messages.mark_read');
    Route::post('messages/{message}/reply', [MessageController::class, 'reply'])->name('messages.reply');

    // Videos
    Route::get('videos', [\App\Http\Controllers\Admin\VideoController::class, 'index'])->name('admin.videos.index');
    Route::post('videos', [\App\Http\Controllers\Admin\VideoController::class, 'store'])->name('admin.videos.store');
    Route::delete('videos/{video}', [\App\Http\Controllers\Admin\VideoController::class, 'destroy'])->name('admin.videos.destroy');

    // Wallpapers
    Route::get('wallpapers', [\App\Http\Controllers\Admin\WallpaperController::class, 'index'])->name('admin.wallpapers.index');
    Route::post('wallpapers/folders', [\App\Http\Controllers\Admin\WallpaperController::class, 'storeFolder'])->name('admin.wallpapers.storeFolder');
    Route::delete('wallpapers/folders/{folder}', [\App\Http\Controllers\Admin\WallpaperController::class, 'destroyFolder'])->name('admin.wallpapers.destroyFolder');
    Route::post('wallpapers/items', [\App\Http\Controllers\Admin\WallpaperController::class, 'storeWallpaper'])->name('admin.wallpapers.storeWallpaper');
    Route::delete('wallpapers/items/{wallpaper}', [\App\Http\Controllers\Admin\WallpaperController::class, 'destroyWallpaper'])->name('admin.wallpapers.destroyWallpaper');

    // Shows
    Route::get('shows', [\App\Http\Controllers\Admin\ShowController::class, 'index'])->name('admin.shows.index');
    Route::post('shows', [\App\Http\Controllers\Admin\ShowController::class, 'store'])->name('admin.shows.store');
    Route::post('shows/{show}', [\App\Http\Controllers\Admin\ShowController::class, 'update'])->name('admin.shows.update');
    Route::delete('shows/{show}', [\App\Http\Controllers\Admin\ShowController::class, 'destroy'])->name('admin.shows.destroy');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
