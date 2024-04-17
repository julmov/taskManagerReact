import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPenSquare,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import "../App.css";

const TodoList = () => {
  const [newItem, setNewItem] = useState("");
  const [todos, setTodos] = useState(() => {
    const localTodos = localStorage.getItem("todos")
    return localTodos ? JSON.parse(localTodos) : []
  });


  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem.trim()) {
      return;
    }
    const newTodo = {
      id: crypto.randomUUID(),
      title: newItem,
      completed: false,
      isEditing: false,
    };
    setTodos((currentTodos) => [...currentTodos, newTodo]);
    setNewItem(""); // Clear the input after adding a todo
  };

  const toggleTodo = (id, completed) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id, newTitle) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, title: newTitle } : todo
      )
    );
  };

  const handleEditClick = (id) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  const handleCheckClick = (id, updatedTitle) => {
    editTodo(id, updatedTitle); // Update the title
    handleEditClick(id); // Toggle isEditing
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="my-todo-form">
        <label htmlFor="item">
          <h1 className="header">Todo list</h1>
        </label>
        <div className="writeTaskRow">
          <input
            className="input-for-white-task"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            type="text"
            id="item"
            placeholder="Say me what to do..."
          />
          <button className="btnAdd">Add</button>
        </div>
      </form>

      <ul className="list">
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.isEditing ? (
              // Render the edit mode UI
              <div className="edit-task-row">
                <input
                  className="editInput"
                  type="text"
                  value={todo.title}
                  onChange={(e) => editTodo(todo.id, e.target.value)}
                />
                <FontAwesomeIcon
                  icon={faCheck}
                  className="iconCheck"
                  onClick={(e) => {
                    e.stopPropagation(); // Stop event propagation
                    handleCheckClick(todo.id, todo.title); // Save changes and toggle isEditing
                  }}
                />
              </div>
            ) : (
              // Render the normal mode UI
              <>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) => toggleTodo(todo.id, e.target.checked)}
                  />
                  {todo.title}
                </label>
                <div>
                  <FontAwesomeIcon
                    icon={faPenSquare}
                    className="ChangeAndDelIcon"
                    onClick={() => handleEditClick(todo.id)} // Switch to edit mode
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="ChangeAndDelIcon"
                    onClick={() => deleteTodo(todo.id)}
                  />
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default TodoList;
