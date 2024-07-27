'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { nanoid } from 'nanoid';

interface Task {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    tags: string[];
    progress: 'not started' | 'in progress' | 'ready for testing' | 'finished';
    progressPercentage: number;
    completed: boolean;
}

interface List {
    id: string;
    name: string;
    tasks: Task[];
}

const CustomSelect: React.FC<{
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string; color: string }[];
}> = ({ value, onChange, options }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative inline-block w-full pl-3">
            <button
                type="button"
                className={`border rounded p-1 w-full min-w-[${value === 'ready for testing' ? '150' : '75'}px] flex justify-between items-center ${
                    value === 'not started'
                        ? 'border-gray-300'
                        : value === 'in progress'
                          ? 'border-orange-300 bg-orange-300 dark:border-yellow-300 dark:bg-yellow-300 dark:text-black'
                          : value === 'ready for testing'
                            ? 'border-blue-300 bg-blue-300 dark:border-blue-600 dark:bg-blue-600'
                            : value === 'high'
                              ? 'border-destructive bg-destructive'
                              : value === 'medium'
                                ? 'border-primary bg-primary text-white dark:text-black'
                                : value === 'low'
                                  ? 'border-secondary bg-secondary'
                                  : 'border-green-300 bg-green-300 dark:border-green-600 dark:bg-green-600'
                }`}
                onClick={() => setOpen(!open)}
            >
                <span className="text-xs">
                    {options.find((option) => option.value === value)?.label}
                </span>
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    ></path>
                </svg>
            </button>

            {open && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={`p-1 cursor-pointer text-xs ${option.color}`}
                            onClick={() => {
                                onChange(option.value);
                                setOpen(false);
                            }}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export function ToDo() {
    const [lists, setLists] = useState<List[]>([
        {
            id: 'list1',
            name: 'Personal',
            tasks: [
                {
                    id: 'task1',
                    title: 'Grocery shopping',
                    description: 'Buy milk, eggs, and bread',
                    priority: 'high',
                    dueDate: '2023-06-15',
                    tags: ['errands', 'home'],
                    progress: 'in progress',
                    progressPercentage: 33,
                    completed: false,
                },
                {
                    id: 'task2',
                    title: 'Finish report',
                    description: 'Complete the quarterly report for work',
                    priority: 'medium',
                    dueDate: '2023-06-30',
                    tags: ['work', 'office'],
                    progress: 'finished',
                    progressPercentage: 100,
                    completed: false,
                },
                {
                    id: 'task3',
                    title: 'Call girlfriend',
                    description: 'Remember to call your GF this weekend',
                    priority: 'low',
                    dueDate: '2023-06-12',
                    tags: ['personal', 'family'],
                    progress: 'not started',
                    progressPercentage: 0,
                    completed: false,
                },
            ],
        },
        {
            id: 'list2',
            name: 'Work',
            tasks: [
                {
                    id: 'task4',
                    title: 'Prepare presentation',
                    description: 'Create slides for the client meeting',
                    priority: 'high',
                    dueDate: '2023-06-20',
                    tags: ['work', 'presentation'],
                    progress: 'in progress',
                    progressPercentage: 33,
                    completed: false,
                },
                {
                    id: 'task5',
                    title: 'Attend team meeting',
                    description: 'Join the weekly team meeting',
                    priority: 'medium',
                    dueDate: '2023-06-17',
                    tags: ['work', 'meeting'],
                    progress: 'not started',
                    progressPercentage: 0,
                    completed: false,
                },
            ],
        },
    ]);

    const [currentList, setCurrentList] = useState<List>(lists[0]);
    const [newTask, setNewTask] = useState<Partial<Task>>({
        title: '',
        description: '',
        priority: 'low',
        dueDate: '',
        tags: [],
        progress: 'not started',
        progressPercentage: 0,
        completed: false,
    });
    const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});

    const handleAddTask = () => {
        if (newTask.title?.trim() !== '') {
            const newTaskWithId: Task = { ...newTask, id: nanoid() } as Task;
            setCurrentList((prevList) => ({
                ...prevList,
                tasks: [...prevList.tasks, newTaskWithId],
            }));
            setNewTask({
                title: '',
                description: '',
                priority: 'low',
                dueDate: '',
                tags: [],
                progress: 'not started',
                progressPercentage: 0,
                completed: false,
            });
        }
    };

    const handleEditTask = (taskId: string, updatedTask: Partial<Task>) => {
        setCurrentList((prevList) => ({
            ...prevList,
            tasks: prevList.tasks.map((task) =>
                task.id === taskId ? { ...task, ...updatedTask } : task
            ),
        }));
    };

    const handleDeleteTask = (taskId: string) => {
        setCurrentList((prevList) => ({
            ...prevList,
            tasks: prevList.tasks.filter((task) => task.id !== taskId),
        }));
    };

    const handleToggleTaskCompletion = (taskId: string) => {
        setCurrentList((prevList) => ({
            ...prevList,
            tasks: prevList.tasks.map((task) =>
                task.id === taskId
                    ? { ...task, completed: !task.completed }
                    : task
            ),
        }));
    };

    const handleProgressChange = (
        taskId: string,
        progress: Task['progress']
    ) => {
        setCurrentList((prevList) => ({
            ...prevList,
            tasks: prevList.tasks.map((task) => {
                if (task.id === taskId) {
                    let progressPercentage = task.progressPercentage;
                    switch (progress) {
                        case 'not started':
                            progressPercentage = 0;
                            break;
                        case 'in progress':
                            if (progressPercentage < 33) {
                                progressPercentage = 33;
                            }
                            break;
                        case 'ready for testing':
                            if (progressPercentage < 66) {
                                progressPercentage = 66;
                            }
                            break;
                        case 'finished':
                            progressPercentage = 100;
                            break;
                    }
                    return { ...task, progress, progressPercentage };
                }
                return task;
            }),
        }));
    };

    const handleProgressBarClick = (
        taskId: string,
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newProgressPercentage = Math.floor((clickX / rect.width) * 100);
        setCurrentList((prevList) => ({
            ...prevList,
            tasks: prevList.tasks.map((task) => {
                if (
                    task.id === taskId &&
                    task.progress !== 'not started' &&
                    task.progress !== 'finished'
                ) {
                    return {
                        ...task,
                        progressPercentage: newProgressPercentage,
                    };
                }
                return task;
            }),
        }));
    };

    const handleEditIconClick = (taskId: string) => {
        setEditMode((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-full">
            <div className="w-full pt-4 px-6 md:w-64 md:pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">To-Do Lists</h2>
                    <Button
                        size="sm"
                        onClick={() =>
                            setLists([
                                ...lists,
                                { id: nanoid(), name: 'New List', tasks: [] },
                            ])
                        }
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add List
                    </Button>
                </div>
                <div className="space-y-2">
                    {lists.map((list) => (
                        <Button
                            key={list.id}
                            variant={
                                list.id === currentList.id ? 'default' : 'ghost'
                            }
                            className="w-full justify-start"
                            onClick={() => setCurrentList(list)}
                        >
                            {list.name}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="flex-1 p-6 order-last md:order-none">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">{currentList.name}</h1>
                    <div className="flex items-center gap-2">
                        <Input
                            type="text"
                            placeholder="New task"
                            value={newTask.title || ''}
                            onChange={(e) =>
                                setNewTask({
                                    ...newTask,
                                    title: e.target.value,
                                })
                            }
                            className="bg-muted/50 border-none focus:ring-0"
                        />
                        <Button onClick={handleAddTask}>
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Add Task
                        </Button>
                    </div>
                </div>
                <div className="grid gap-4">
                    {currentList.tasks.map((task) => (
                        <Card key={task.id} className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={task.completed}
                                        onCheckedChange={() =>
                                            editMode[task.id] &&
                                            handleToggleTaskCompletion(task.id)
                                        }
                                        disabled={!editMode[task.id]}
                                    />

                                    {editMode[task.id] ? (
                                        <Input
                                            value={task.title}
                                            onChange={(e) =>
                                                handleEditTask(task.id, {
                                                    title: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        <h3
                                            className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                                        >
                                            {task.title}
                                        </h3>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {editMode[task.id] ? (
                                        <CustomSelect
                                            value={task.priority}
                                            onChange={(value) =>
                                                handleEditTask(task.id, {
                                                    priority:
                                                        value as Task['priority'],
                                                })
                                            }
                                            options={[
                                                {
                                                    value: 'low',
                                                    label: 'Low',
                                                    color: 'bg-secondary dark:bg-black',
                                                },
                                                {
                                                    value: 'medium',
                                                    label: 'Medium',
                                                    color: 'bg-primary text-white dark:text-black',
                                                },
                                                {
                                                    value: 'high',
                                                    label: 'High',
                                                    color: 'bg-destructive',
                                                },
                                            ]}
                                        />
                                    ) : (
                                        <Badge
                                            variant={
                                                task.priority === 'high'
                                                    ? 'destructive'
                                                    : task.priority === 'medium'
                                                      ? 'default'
                                                      : 'secondary'
                                            }
                                        >
                                            {task.priority}
                                        </Badge>
                                    )}
                                    {editMode[task.id] ? (
                                        <CustomSelect
                                            value={task.progress}
                                            onChange={(value) =>
                                                handleProgressChange(
                                                    task.id,
                                                    value as Task['progress']
                                                )
                                            }
                                            options={[
                                                {
                                                    value: 'not started',
                                                    label: 'Not Started',
                                                    color: 'bg-white dark:bg-slate-900',
                                                },
                                                {
                                                    value: 'in progress',
                                                    label: 'In Progress',
                                                    color: 'bg-orange-300 dark:bg-yellow-300 dark:text-black',
                                                },
                                                {
                                                    value: 'ready for testing',
                                                    label: 'Ready For Testing',
                                                    color: 'bg-blue-300 dark:bg-blue-600',
                                                },
                                                {
                                                    value: 'finished',
                                                    label: 'Finished',
                                                    color: 'bg-green-300 dark:bg-green-600',
                                                },
                                            ]}
                                        />
                                    ) : (
                                        <span
                                            className={`text-xs rounded p-1 dark:font-semibold ${
                                                task.progress === 'not started'
                                                    ? 'border-gray-300'
                                                    : task.progress ===
                                                        'in progress'
                                                      ? 'border-orange-300 bg-orange-300 dark:border-yellow-300 dark:bg-yellow-300 dark:text-black'
                                                      : task.progress ===
                                                          'ready for testing'
                                                        ? 'border-blue-300 bg-blue-300 dark:border-blue-600 dark:bg-blue-600'
                                                        : 'border-green-300 bg-green-300 dark:border-green-600 dark:bg-green-600'
                                            }`}
                                        >
                                            {task.progress}
                                        </span>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={
                                            editMode[task.id]
                                                ? 'bg-gray-200 dark:bg-gray-900 p-2'
                                                : ''
                                        }
                                        onClick={() =>
                                            handleEditIconClick(task.id)
                                        }
                                    >
                                        <FilePenIcon className="w-4 h-4" />
                                        <span className="sr-only">
                                            Edit task
                                        </span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            handleDeleteTask(task.id)
                                        }
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        <span className="sr-only">
                                            Delete task
                                        </span>
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-2 text-muted-foreground">
                                <p>{task.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>
                                        Due:{' '}
                                        {task.dueDate
                                            ? format(
                                                  new Date(task.dueDate),
                                                  'MMM d, yyyy'
                                              )
                                            : 'No due date'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <TagIcon className="w-4 h-4" />
                                    <div className="flex flex-wrap gap-2">
                                        {task.tags.map((tag) => (
                                            <Badge key={tag} variant="outline">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <ActivityIcon className="w-4 h-4" />
                                    <div
                                        className={`w-full bg-muted rounded-full h-2 ${
                                            editMode[task.id] &&
                                            task.progress !== 'not started' &&
                                            task.progress !== 'finished'
                                                ? 'cursor-pointer'
                                                : ''
                                        }`}
                                        onClick={(e) =>
                                            editMode[task.id] &&
                                            task.progress !== 'not started' &&
                                            task.progress !== 'finished'
                                                ? handleProgressBarClick(
                                                      task.id,
                                                      e
                                                  )
                                                : null
                                        }
                                    >
                                        <div
                                            className={`bg-primary rounded-full h-2 ${
                                                task.progress ===
                                                    'not started' ||
                                                task.progress === 'finished'
                                                    ? 'pointer-events-none'
                                                    : 'pointer-events-auto'
                                            }`}
                                            style={{
                                                width: `${task.progressPercentage}%`,
                                            }}
                                        />
                                    </div>
                                    <span>{task.progressPercentage}%</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
        </svg>
    );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
        </svg>
    );
}

function FilePenIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
        </svg>
    );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    );
}

function TagIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
            <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
        </svg>
    );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}
