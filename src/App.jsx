import React from 'react';
import { useState } from 'react';
import TodoItem from './components/TodoItem';
import useTodos from './hooks/useTodos';

export default function App() {
  const [newTodo, setNewTodo] = useState('');
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newTodo.trim()) {
      return;
    }

    addTodo(newTodo.trim());
    setNewTodo('');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5">
          <h1 className="text-2xl font-bold text-center mb-4">Todo List</h1>

          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo"
              className="flex-1 px-3 py-2 border rounded"
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Add
            </button>
          </form>

          <div className="space-y-1">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
            ))}
          </div>

          {todos.length === 0 && <p className="text-center text-gray-500 mt-4">No todos yet. Add one above!</p>}
        </div>
      </div>
    </div>
  );
}
