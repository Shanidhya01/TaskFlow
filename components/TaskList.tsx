"use client";

import { useState } from "react";

interface Task {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface Props {
  tasks: Task[];
  refresh: () => void;
}

export default function TaskList({ tasks, refresh }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "done" ? "pending" : "done";
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    refresh();
  };

  const deleteTask = async (id: string) => {
    setDeletingId(id);
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    refresh();
    setDeletingId(null);
  };

  const startEdit = (task: Task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const saveEdit = async (id: string) => {
    if (!editTitle.trim()) return;
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle }),
    });
    setEditingId(null);
    setEditTitle("");
    refresh();
  };

  if (!tasks.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-card-foreground mb-1">No tasks yet</h3>
        <p className="text-muted-foreground text-sm">Add your first task above to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end mb-3">
        <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      {tasks.map((task) => (
        <div
          key={task._id}
          className={`group flex items-center justify-between bg-card border rounded-xl p-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-150 animate-slide-in cursor-pointer ${
            task.status === "done"
              ? "border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-950/20"
              : "border-border hover:border-primary/30"
          }`}
        >
          {editingId === task._id ? (
            <form
              className="flex items-center gap-2 flex-1 mr-2"
              onSubmit={(e) => {
                e.preventDefault();
                saveEdit(task._id);
              }}
            >
              <input
                autoFocus
                aria-label="Edit task title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-primary bg-muted/50 text-card-foreground text-sm focus:bg-card focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button
                type="submit"
                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-950/50 transition-colors"
                title="Save"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                title="Cancel"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>
          ) : (
            <>
              <div
                className="flex items-center gap-3 min-w-0 flex-1"
                onClick={() => toggleStatus(task._id, task.status)}
              >
                {/* Checkbox indicator */}
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                  task.status === "done"
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-border hover:border-primary"
                }`}>
                  {task.status === "done" && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                {/* Status color dot */}
                <div className={`w-2 h-2 rounded-full shrink-0 ${task.status === "done" ? "bg-green-500" : "bg-amber-500"}`} />
                <div className="min-w-0">
                  <span className={`block truncate transition-all duration-200 ${
                    task.status === "done"
                      ? "line-through text-muted-foreground"
                      : "text-card-foreground"
                  }`}>{task.title}</span>
                  {task.createdAt && (
                    <span className="text-xs text-muted-foreground mt-0.5 block">
                      {new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  )}
                </div>
              </div>

              <div className="ml-4 shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => startEdit(task)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary-light transition-colors"
                  title="Edit task"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  disabled={deletingId === task._id}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                  title="Delete task"
                >
                  {deletingId === task._id ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
