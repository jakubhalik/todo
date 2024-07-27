'use client';

import { useState } from 'react';
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
    progress: number;
    completed: boolean;
}

interface List {
    id: string;
    name: string;
    tasks: Task[];
}

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
                    progress: 50,
                    completed: false,
                },
                {
                    id: 'task2',
                    title: 'Finish report',
                    description: 'Complete the quarterly report for work',
                    priority: 'medium',
                    dueDate: '2023-06-30',
                    tags: ['work', 'office'],
                    progress: 80,
                    completed: false,
                },
                {
                    id: 'task3',
                    title: 'Call mom',
                    description: 'Remember to call mom this weekend',
                    priority: 'low',
                    dueDate: '2023-06-12',
                    tags: ['personal', 'family'],
                    progress: 0,
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
                    progress: 30,
                    completed: false,
                },
                {
                    id: 'task5',
                    title: 'Attend team meeting',
                    description: 'Join the weekly team meeting',
                    priority: 'medium',
                    dueDate: '2023-06-17',
                    tags: ['work', 'meeting'],
                    progress: 0,
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
        progress: 0,
        completed: false,
    });

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
                progress: 0,
                completed: false,
            });
        }
    };

    const handleEditTask = (taskId: string, updatedTask: Task) => {
        setCurrentList((prevList) => ({
            ...prevList,
            tasks: prevList.tasks.map((task) =>
                task.id === taskId ? updatedTask : task
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

    return (
        <div className="flex h-screen w-full">
            <div className="bg-muted w-64 border-r p-4">
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
            <div className="flex-1 p-6">
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
                                            handleToggleTaskCompletion(task.id)
                                        }
                                    />
                                    <h3
                                        className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                                    >
                                        {task.title}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={
                                            task.priority === 'high'
                                                ? 'destructive'
                                                : task.priority === 'medium'
                                                    ? 'secondary'
                                                    : 'default'
                                        }
                                    >
                                        {task.priority}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            handleEditTask(task.id, task)
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
                                        {format(
                                            new Date(task.dueDate),
                                            'MMM d, yyyy'
                                        )}
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
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-primary rounded-full h-2"
                                            style={{
                                                width: `${task.progress}%`,
                                            }}
                                        />
                                    </div>
                                    <span>{task.progress}%</span>
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
