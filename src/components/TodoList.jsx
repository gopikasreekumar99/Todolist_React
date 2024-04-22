import React, { useState, useEffect } from "react";
import "../css/Todo.css";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  //Additional
  const [error, setError] = useState(null);
  //.....

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:3001/todos");
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      setTodos(data);
      setError(null);  //Additional
    } catch (error) {
      console.error("Error fetching todos:", error);
      //Additional
      setError("Failed to fetch todos. Please try again later.");
      //
    }
  };

  const addTodo = async () => {
    if (inputValue.trim() !== "") {
      try {
        const response = await fetch("http://localhost:3001/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: inputValue,
            checked: false,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to add todo");
        }
        const data = await response.json();
        setTodos([...todos, data]);
        setInputValue("");
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    } else {
      alert("You must write something!");
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleChecked = async (id, checked) => {
    try {
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checked: !checked,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to toggle todo");
      }
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, checked: !checked } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const clearCompleted = async () => {
    try {
      const completedTodos = todos.filter((todo) => todo.checked);
      for (const todo of completedTodos) {
        const response = await fetch(`http://localhost:3001/todos/${todo.id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to clear completed todos");
        }
      }
      const updatedTodos = todos.filter((todo) => !todo.checked);
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error clearing completed todos:", error);
    }
  };

  const removeAll = async () => {
    try {
      for (const todo of todos) {
        const response = await fetch(`http://localhost:3001/todos/${todo.id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to remove all todos");
        }
      }
      setTodos([]);
    } catch (error) {
      console.error("Error removing all todos:", error);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="container">
      <h1 className="header">Todo List</h1>
      {error && <div className="error-message">{error}</div>} 
      <div className="btn-div">
        <input
          type="text"
          placeholder="Enter a new todo..."
          value={inputValue}
          onChange={handleInputChange}
        />
        <button className="addBtn" onClick={addTodo}>
          Add
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.checked ? "checked" : ""}>
            <span onClick={() => toggleChecked(todo.id, todo.checked)}>
              {todo.text}
            </span>
            <span className="close" onClick={() => deleteTodo(todo.id)}>
              &times;
            </span>
          </li>
        ))}
      </ul>
      <div className="btn-div">
        <button className="actionBtn clearAll-btn" onClick={clearCompleted}>
          Clear Completed
        </button>
        <button className="actionBtn removeAll-btn" onClick={removeAll}>
          Remove All
        </button>
      </div>
    </div>
  );
};

export default Todo;
