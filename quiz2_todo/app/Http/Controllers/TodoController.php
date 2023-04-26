<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): View {
        return view('todo.index', [
            'todos' => $request->user()->todos()->latest()->get()
        ]);
    }


    public function toggleComplete(Todo $todo): RedirectResponse {
        $this->authorize('update', $todo);

        $todo->update([
            'completed' => !$todo->completed
        ]);

        return redirect()->route('todo.index');
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse {
        $validated = $request->validate([
            'title' => 'required|max:255',
        ]);

        $request->user()->todos()->create($validated);

        return redirect()->route('todo.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Todo $todo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Todo $todo)
    {
        $this->authorize('update', $todo);

        return view('todo.edit', [
            'todo' => $todo
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Todo $todo)
    {
        $this->authorize('update', $todo);

        $validated = $request->validate([
            'title' => 'required|max:255',
        ]);

        $todo->update($validated);

        return redirect()->route('todo.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Todo $todo)
    {
        $this->authorize('delete', $todo);

        $todo->delete();

        return redirect()->route('todo.index');
    }
}
