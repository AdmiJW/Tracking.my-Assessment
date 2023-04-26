<x-app-layout>
    <div class="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">

        <!-- Add todo section -->
        <form method="POST" action="{{ route('todo.store') }}">
            @csrf
            <textarea
                name="title"
                placeholder="{{ __('What are you going to do today?') }}"
                class="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
            >{{ old('title') }}</textarea>

            <x-input-error :messages="$errors->get('title')" class="mt-2" />

            <x-primary-button class="mt-4">{{ __('Add Todo') }}</x-primary-button>
        </form>

        
        <!-- Todo List -->
        <div class="mt-6 bg-white shadow-sm rounded-lg divide-y">

            @foreach ($todos as $todo)
                <div class="p-3 flex items-center space-x-2">
                    <!-- Left Logo -->
                    <span class='text-xl'>👉</span>

                    <!-- Todo Content -->
                    <div class="flex-1 p-1">

                        <div class="flex justify-between items-center">
                            <!-- Created at -->
                            <small class="text-xs text-gray-600">
                                {{ $todo->created_at->format('j M Y, g:i a') }}
                            </small>

                            <!-- Controls -->
                            <div class='flex gap-2'>
                                <a title='Edit' href="{{ route('todo.edit', $todo) }}">
                                    ✏️
                                </a>

                                <form method="POST" action="{{ route('todo.destroy', $todo) }}">
                                    @csrf
                                    @method('delete')
                                    <button title='Delete' onclick="event.preventDefault(); this.closest('form').submit();">
                                        🗑️
                                    </button>
                                </form>
                            </div>
                        </div>
                        
                        <!-- Todo -->
                        <div class='flex justify-between mt-3'>
                            <p class="text-lg font-bold {{ $todo->completed ? 'line-through text-green-500': '' }}">
                                {{ $todo->title }}
                            </p>
                            
                            <!-- checkbox -->
                            <form method="POST" action="{{ route('todo.toggle-complete', $todo) }}">
                                @csrf
                                @method('patch')
                                <input
                                    type="checkbox"
                                    name="completed"
                                    class="form-checkbox h-5 w-5 text-indigo-600"
                                    {{ $todo->completed ? 'checked' : '' }}
                                    onchange="this.closest('form').submit()"
                                >
                            </form>
                        </div>
                    </div>
                </div>
            @endforeach

        </div>

    </div>
</x-app-layout>