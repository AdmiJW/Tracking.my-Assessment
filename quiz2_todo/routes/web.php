<?php

use App\Http\Controllers\ChirpController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;
// Request
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


Route::get('/dashboard', function (Request $request) {
    $todolist = $request->user()->todos()->latest()->get();
    
    $total_completed = $todolist->where('completed', true)->count();
    $total_incomplete = $todolist->where('completed', false)->count();

    return view('dashboard', [
        'count' => $todolist->count(),
        'total_completed' => $total_completed,
        'total_incomplete' => $total_incomplete
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');



Route::patch('/todo/{todo}/toggle-complete', [TodoController::class, 'toggleComplete'])
    ->name('todo.toggle-complete')
    ->middleware(['auth', 'verified']);
Route::resource('todo', TodoController::class)
    ->only(['index', 'store', 'edit', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
