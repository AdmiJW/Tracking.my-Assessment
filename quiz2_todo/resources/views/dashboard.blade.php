<x-app-layout>

    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white shadow-sm sm:rounded-lg text-center">
                
                <p class='text-3xl p-6 font-bold'>
                    Hi, {{ Auth::user()->name }}! 👋
                </p>

                <p class='p-6 text-lg'>
                    You have a total of <b>{{ $count }}</b> todos. 📝
                    <br>
                    <b>{{ $total_completed }}</b> of them are completed. ✅
                    <br>
                    <b>{{ $total_incomplete }}</b> to go! 🏃‍♂️
                </p>

                <div class="p-6 pb-2 text-gray-900">
                    {{ __("Start creating todos!") }}
                </div>

                <button class="m-6 mt-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    <a href="{{ route('todo.index') }}">
                        {{ __("My Todos") }}
                    </a>
                </button>
            </div>
        </div>
    </div>
</x-app-layout>
