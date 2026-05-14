import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/tasks?search=${search}&status=${status}&sort=${sort}`,
      {
        headers: {
          authorization: token,
        },
      }
    );

    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, [search, status, sort]);

  const createTask = async () => {
    await axios.post(
      "http://localhost:5000/api/tasks",
      {
        title,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );

    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/tasks/${id}`,
      {
        headers: {
          authorization: token,
        },
      }
    );

    fetchTasks();
  };

  const toggleTask = async (id) => {
    await axios.patch(
      `http://localhost:5000/api/tasks/${id}/toggle`,
      {},
      {
        headers: {
          authorization: token,
        },
      }
    );

    fetchTasks();
  };

  return (
    <div>
      <h1>Task Manager</h1>

      <input
        placeholder="Create Task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={createTask}>
        Add
      </button>

      <br /><br />

      <input
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
      />

      <select onChange={(e) => setStatus(e.target.value)}>
        <option value="">All</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>

      <select onChange={(e) => setSort(e.target.value)}>
        <option value="">Sort</option>
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </select>

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.title}

            {task.completed ? " ✅" : " ❌"}

            <button onClick={() => toggleTask(task._id)}>
              Toggle
            </button>

            <button onClick={() => deleteTask(task._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;