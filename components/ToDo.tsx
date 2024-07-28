'use client';

import React, { useState, useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

import { format } from 'date-fns';

import { nanoid } from 'nanoid';

import { v4 as uuidv4 } from 'uuid';

import { DatePickerWithPresets } from '@/components/DatePicker';

import axios from 'axios';

import debounce from 'lodash.debounce';

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';

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
                className={`border border-rounded rounded p-1 w-full min-w-[${value === 'ready for testing' ? '150' : '75'
                    }px] flex justify-between items-center ${value === 'not started'
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
                <ul className="absolute z-10 w-full bg-white mt-1">
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
    const [lists, setLists] = useState<List[]>([]);

    const [currentList, setCurrentList] = useState<List | null>(null);

    const [listEditMode, setListEditMode] = useState<{
        [key: string]: boolean;
    }>({});

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

    const [editTitle, setEditTitle] = useState<{ [key: string]: string }>({});

    const [editDescription, setEditDescription] = useState<{
        [key: string]: string;
    }>({});

    const [editTags, setEditTags] = useState<{ [key: string]: string[] }>({});

    const [isDragging, setIsDragging] = useState(false);

    const [currentDraggingTaskId, setCurrentDraggingTaskId] = useState<
        string | null
    >(null);

    const progressBarRef = useRef<HTMLDivElement | null>(null);

    const endpointLists = process.env.NEXT_PUBLIC_ENDPOINT_LISTS as string;

    const [deleteConfirmationPopup, setDeleteConfirmationPopup] =
        useState(false);

    const [deleteAllTasksPopup, setDeleteAllTasksPopup] = useState(false);

    const [deleteAllListsPopup, setDeleteAllListsPopup] = useState(false);

    const [deleteTaskPopup, setDeleteTaskPopup] = useState(false);

    const [deleteListPopup, setDeleteListPopup] = useState(false);

    const [taskIdForDeletingTask, setTaskIdForDeletingTask] = useState('');

    const [listIdForDeletingList, setListIdForDeletingList] = useState('');

    const [showLists, setShowLists] = useState(true);

    const [isDeletingAllLists, setIsDeletingAllLists] = useState(false);

    const [isGeneratingTemplates, setIsGeneratingTemplates] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const handleGenerateTemplateLists = async () => {
        setIsGeneratingTemplates(true);
        const personalList = {
            id: nanoid(),
            name: 'Personal',
            tasks: [
                {
                    id: nanoid(),
                    title: 'Grocery shopping',
                    description: 'Buy milk, eggs, and bread',
                    priority: 'high' as 'high',
                    dueDate: '2023-06-15',
                    tags: ['errands', 'home'],
                    progress: 'in progress' as 'in progress',
                    progressPercentage: 33,
                    completed: false,
                },
                {
                    id: nanoid(),
                    title: 'Finish report',
                    description: 'Complete the quarterly report for work',
                    priority: 'medium' as 'medium',
                    dueDate: '2023-06-30',
                    tags: ['work', 'office'],
                    progress: 'finished' as 'finished',
                    progressPercentage: 100,
                    completed: false,
                },
                {
                    id: nanoid(),
                    title: 'Call girlfriend',
                    description: 'Remember to call your GF this weekend',
                    priority: 'low' as 'low',
                    dueDate: '2023-06-12',
                    tags: ['personal', 'family'],
                    progress: 'not started' as 'not started',
                    progressPercentage: 0,
                    completed: false,
                },
            ],
        };

        const workList = {
            id: uuidv4(),
            name: 'Work',
            tasks: [
                {
                    id: nanoid(),
                    title: 'Prepare presentation',
                    description: 'Create slides for the client meeting',
                    priority: 'high' as 'high',
                    dueDate: '2023-06-20',
                    tags: ['work', 'presentation'],
                    progress: 'in progress' as 'in progress',
                    progressPercentage: 33,
                    completed: false,
                },
                {
                    id: nanoid(),
                    title: 'Attend team meeting',
                    description: 'Join the weekly team meeting',
                    priority: 'medium' as 'medium',
                    dueDate: '2023-06-17',
                    tags: ['work', 'meeting'],
                    progress: 'not started' as 'not started',
                    progressPercentage: 0,
                    completed: false,
                },
            ],
        };

        try {
            const personalResponse = await axios.post(
                endpointLists,
                personalList
            );
            console.log('Personal List Response:', personalResponse.data);

            if (personalResponse.data) {
                const workResponse = await axios.post(endpointLists, workList);
                console.log('Work List Response:', workResponse.data);

                if (workResponse.data) {
                    const createdLists = [
                        personalResponse.data,
                        workResponse.data,
                    ];
                    setLists(createdLists);
                    setCurrentList(createdLists[0]);
                } else {
                    console.error(
                        'Work list did not return properly:',
                        workResponse.data
                    );
                }
            } else {
                console.error(
                    'Personal list did not return properly:',
                    personalResponse.data
                );
            }
        } catch (error) {
            console.error('Error generating template lists:', error);
        } finally {
            setIsGeneratingTemplates(false);
        }
    };

    useEffect(() => {
        axios
            .get(endpointLists)
            .then((response) => {
                setLists(response.data);
                console.log('useEffect setting lists');
                if (response.data.length > 0) {
                    setCurrentList(response.data[0]);
                    console.log('useEffect setting current list');
                }
            })
            .catch((error) => {
                console.error('Error fetching lists:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [endpointLists]);

    const handleAddTask = async () => {
        if (newTask.title?.trim() !== '') {
            const newTaskWithId: Task = {
                ...newTask,
                id: nanoid(),
                dueDate: newTask.dueDate
                    ? new Date(newTask.dueDate).toISOString().split('T')[0]
                    : '',
            } as Task;
            const updatedList = {
                ...currentList,
                tasks: [newTaskWithId, ...(currentList as List).tasks],
            };
            axios
                .put(`${endpointLists}/${currentList?.id}`, updatedList)
                .then((response) => {
                    setCurrentList(response.data);
                    setLists((prevLists) =>
                        prevLists.map((list) =>
                            list.id === currentList?.id ? response.data : list
                        )
                    );
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
                    setEditMode((prev) => ({
                        ...prev,
                        [newTaskWithId.id]: true,
                    }));
                })
                .catch((error) => {
                    console.error('Error adding task:', error);
                });
        }
    };

    const handleEditTaskDebounced = debounce((listId, updatedList) => {
        axios
            .put(`${endpointLists}/${listId}`, updatedList)
            .then((response) => {
                setLists((prevLists) =>
                    prevLists.map((list) =>
                        list.id === listId ? response.data : list
                    )
                );
                if (currentList?.id === listId) {
                    setCurrentList(response.data);
                }
            })
            .catch((error) => {
                console.error('Error updating task:', error);
            });
    }, 300);

    const handleEditTask = async (
        taskId: string,
        updatedTask: Partial<Task>
    ) => {
        setCurrentList((prevList) => {
            const updatedTasks = (prevList as List).tasks.map((task) => {
                if (task.id === taskId) {
                    if (updatedTask.dueDate) {
                        const localDate = new Date(updatedTask.dueDate);
                        if (!isNaN(localDate.getTime())) {
                            localDate.setDate(localDate.getDate());
                            localDate.setMinutes(
                                localDate.getMinutes() -
                                localDate.getTimezoneOffset()
                            );
                            updatedTask.dueDate = localDate
                                .toISOString()
                                .split('T')[0];
                        }
                    }
                    return { ...task, ...updatedTask };
                }
                return task;
            });
            const updatedList = { ...(prevList as List), tasks: updatedTasks };

            handleEditTaskDebounced((prevList as List).id, updatedList);

            setLists((prevLists) =>
                prevLists.map((list) =>
                    list.id === (prevList as List).id ? updatedList : list
                )
            );

            return updatedList;
        });
    };

    const handleDeleteTask = async (taskId: string) => {
        setCurrentList((prevList) => {
            if (!prevList) return prevList;

            const updatedTasks = prevList.tasks.filter(
                (task) => task.id !== taskId
            );
            const updatedList = { ...prevList, tasks: updatedTasks };

            axios
                .put(`${endpointLists}/${prevList.id}`, updatedList)
                .then(() => {
                    setLists((prevLists) =>
                        prevLists.map((list) =>
                            list.id === prevList.id ? updatedList : list
                        )
                    );
                    console.log('Task deleted successfully');
                })
                .catch((error) => {
                    console.error('Error deleting task:', error);
                });

            return updatedList;
        });
    };

    const handleToggleTaskCompletion = async (taskId: string) => {
        setCurrentList((prevList) => ({
            ...(prevList as List),
            tasks: (prevList as List).tasks.map((task) =>
                task.id === taskId
                    ? { ...task, completed: !task.completed }
                    : task
            ),
        }));
    };

    const handleProgressChange = async (
        taskId: string,
        progress: Task['progress']
    ) => {
        setCurrentList((prevList) => ({
            ...(prevList as List),
            tasks: (prevList as List).tasks.map((task) => {
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

    const handleProgressBarMouseDown = async (
        taskId: string,
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        setIsDragging(true);
        setCurrentDraggingTaskId(taskId);
        progressBarRef.current = e.currentTarget as HTMLDivElement;
        updateProgress(taskId, e);
    };

    const handleProgressBarMouseUp = async () => {
        setIsDragging(false);
        setCurrentDraggingTaskId(null);
    };

    const updateProgress = (
        taskId: string,
        e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        const bar = progressBarRef.current;
        if (!bar) return;

        const rect = bar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newProgressPercentage = Math.min(
            Math.max(Math.floor((clickX / rect.width) * 100), 0),
            100
        );

        setCurrentList((prevList) => {
            const updatedTasks = (prevList as List).tasks.map((task) => {
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
            });

            const updatedList = { ...(prevList as List), tasks: updatedTasks };

            axios
                .put(`${endpointLists}/${(prevList as List).id}`, updatedList)
                .catch((error) => {
                    console.error('Error updating task progress:', error);
                });
            console.log('Put a change in progressPercentage.');
            return updatedList;
        });
    };

    useEffect(() => {
        const handleMouseUp = () => handleProgressBarMouseUp();

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && currentDraggingTaskId) {
                updateProgress(currentDraggingTaskId, e);
            }
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, currentDraggingTaskId, updateProgress]);

    const handleEditIconClick = async (
        taskId: string,
        title: string,
        description: string,
        tags: string[]
    ) => {
        setEditTitle((prev) => ({ ...prev, [taskId]: title }));
        setEditDescription((prev) => ({ ...prev, [taskId]: description }));
        setEditTags((prev) => ({ ...prev, [taskId]: tags }));
        setEditMode((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
    };

    const handleTitleChange = async (taskId: string, newTitle: string) => {
        setEditTitle((prev) => ({ ...prev, [taskId]: newTitle }));
        handleEditTask(taskId, { title: newTitle });
    };

    const handleDescriptionChange = async (
        taskId: string,
        newDescription: string
    ) => {
        setEditDescription((prev) => ({ ...prev, [taskId]: newDescription }));
        handleEditTask(taskId, { description: newDescription });
    };

    const handleTagsChange = (taskId: string, newTags: string[]) => {
        setEditTags((prev) => ({ ...prev, [taskId]: newTags }));
        handleEditTask(taskId, { tags: newTags });
    };

    const handleAddList = async () => {
        const newList = {
            id: nanoid(),
            name: 'New List'.slice(0, 15),
            tasks: [],
        };
        axios
            .post(endpointLists, newList)
            .then((response) => {
                setLists([...lists, response.data]);
                setCurrentList(response.data);
                setListEditMode((prev) => ({
                    ...prev,
                    [response.data.id]: true,
                }));
            })
            .catch((error) => {
                console.error('Error adding list:', error);
            });
    };

    const handleDeleteList = async (listId: string) => {
        axios
            .delete(`${endpointLists}/${listId}`)
            .then(() => {
                setLists((prevLists) =>
                    prevLists.filter((list) => list.id !== listId)
                );
                if (currentList?.id === listId) {
                    setCurrentList(null);
                }
            })
            .catch((error) => {
                console.error('Error deleting list:', error);
            });
    };

    const handleDeleteAllTasks = async () => {
        const updatedList = { ...(currentList as List), tasks: [] };
        axios
            .put(`${endpointLists}/${currentList?.id}`, updatedList)
            .then(() => {
                setCurrentList(updatedList);
            })
            .catch((error) => {
                console.error('Error deleting all tasks:', error);
            });
    };

    const handleDeleteAllTasksPopup = async () => {
        setDeleteAllTasksPopup(true);
        setDeleteConfirmationPopup(true);
    };

    const handleDeleteAllLists = async () => {
        setIsDeletingAllLists(true);
        try {
            const response = await axios.get(endpointLists);
            const listsToDelete = response.data;

            await Promise.all(
                listsToDelete.map((list: List) =>
                    axios.delete(`${endpointLists}/${list.id}`)
                )
            );

            setLists([]);
            setCurrentList(null);
            console.log('All lists deleted successfully');
        } catch (error) {
            console.error('Error deleting all lists:', error);
        } finally {
            setIsDeletingAllLists(false);
            setDeleteConfirmationPopup(false);
            setDeleteAllListsPopup(false);
        }
    };

    const handleDeleteAllListsPopup = async () => {
        setDeleteAllListsPopup(true);
        setDeleteConfirmationPopup(true);
    };

    const handleDeleteTaskPopup = async () => {
        setDeleteTaskPopup(true);
        setDeleteConfirmationPopup(true);
    };

    const handleDeleteListPopup = async () => {
        setDeleteListPopup(true);
        setDeleteConfirmationPopup(true);
    };

    return (
        <div className="flex flex-col xl:flex-row h-screen w-full">
            <div className="pt-8 py-4 pl-8">
                <Button
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 dark:bg-blue-300 dark:hover:bg-blue-400 dark:active:bg-blue-500"
                    onClick={() => setShowLists(!showLists)}
                >
                    {showLists ? 'Hide Lists' : 'Show Lists'}
                </Button>
            </div>
            {showLists && (
                <div className="w-full pt-4 px-8 xl:w-[440px] lg:pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold flex-1 mr-2">
                            To-Do Lists
                        </h2>
                        {window.innerWidth >= 440 && (
                            <>
                                <Button
                                    size="sm"
                                    className="flex-1 mr-2 bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-transparent dark:border dark:border-red-400 dark:hover:border-red-500 dark:active:border-red-600 dark:text-red-400 dark:hover:text-red-500 dark:active:text-red-600"
                                    onClick={handleDeleteAllListsPopup}
                                >
                                    <TrashIcon className="w-4 h-4 mr-2 dark:text-red-400 dark:hover:text-red-500 dark:active:text-red-600" />
                                    Delete All Lists
                                </Button>
                                <Button size="sm" onClick={handleAddList}>
                                    <PlusIcon className="flex-1 w-4 h-4 mr-2" />
                                    Add List
                                </Button>
                            </>
                        )}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        {window.innerWidth < 440 && (
                            <>
                                <Button
                                    size="sm"
                                    className="flex-1 mr-2 bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-transparent dark:border dark:border-red-400 dark:hover:border-red-500 dark:active:border-red-600 dark:text-red-400 dark:hover:text-red-500 dark:active:text-red-600"
                                    onClick={handleDeleteAllListsPopup}
                                >
                                    <TrashIcon className="w-4 h-4 mr-2 dark:text-red-400 dark:hover:text-red-500 dark:active:text-red-600" />
                                    Delete All Lists
                                </Button>
                                <Button size="sm" onClick={handleAddList}>
                                    <PlusIcon className="flex-1 w-4 h-4 mr-2" />
                                    Add List
                                </Button>
                            </>
                        )}
                    </div>
                    {lists.length === 0 ? (
                        isLoading || isGeneratingTemplates ? (
                            <div className="flex justify-center mt-4">
                                <svg
                                    className="animate-spin h-8 w-8 text-blue-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l-2.293 2.293a1 1 0 001.414 1.414L8 18.414A8.001 8.001 0 016 17.291z"
                                    ></path>
                                </svg>
                            </div>
                        ) : (
                            <Button onClick={handleGenerateTemplateLists}>
                                Generate Template Lists
                            </Button>
                        )
                    ) : (
                        <div className="space-y-2">
                            {lists.map((list) => (
                                <div
                                    key={list.id}
                                    className="flex items-center gap-4"
                                >
                                    {listEditMode[list.id] ? (
                                        <Input
                                            value={list.name.slice(0, 15)}
                                            onChange={(e) => {
                                                const updatedName =
                                                    e.target.value.slice(0, 15);
                                                setLists((prevLists) =>
                                                    prevLists.map((prevList) =>
                                                        prevList.id === list.id
                                                            ? {
                                                                ...prevList,
                                                                name: updatedName,
                                                            }
                                                            : prevList
                                                    )
                                                );
                                                if (
                                                    currentList?.id === list.id
                                                ) {
                                                    setCurrentList(
                                                        (prevList) =>
                                                            prevList
                                                                ? {
                                                                    ...prevList,
                                                                    name: updatedName,
                                                                }
                                                                : prevList
                                                    );
                                                }
                                            }}
                                            onBlur={() => {
                                                setListEditMode((prev) => ({
                                                    ...prev,
                                                    [list.id]: false,
                                                }));
                                                const updatedList = lists.find(
                                                    (prevList) =>
                                                        prevList.id === list.id
                                                );
                                                if (updatedList) {
                                                    axios
                                                        .put(
                                                            `${endpointLists}/${list.id}`,
                                                            updatedList
                                                        )
                                                        .catch((error) => {
                                                            console.error(
                                                                'Error updating list name:',
                                                                error
                                                            );
                                                        });
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    setListEditMode((prev) => ({
                                                        ...prev,
                                                        [list.id]: false,
                                                    }));
                                                    const updatedList =
                                                        lists.find(
                                                            (prevList) =>
                                                                prevList.id ===
                                                                list.id
                                                        );
                                                    if (updatedList) {
                                                        axios
                                                            .put(
                                                                `${endpointLists}/${list.id}`,
                                                                updatedList
                                                            )
                                                            .catch((error) => {
                                                                console.error(
                                                                    'Error updating list name:',
                                                                    error
                                                                );
                                                            });
                                                    }
                                                }
                                            }}
                                            autoFocus
                                            className="flex-grow"
                                        />
                                    ) : (
                                        <Button
                                            variant={
                                                list.id === currentList?.id
                                                    ? 'default'
                                                    : 'ghost'
                                            }
                                            className="flex-grow justify-start"
                                            onClick={() => setCurrentList(list)}
                                        >
                                            {list.name}
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={
                                            listEditMode[list.id]
                                                ? 'bg-gray-200 dark:bg-slate-800 px-3'
                                                : 'px-3'
                                        }
                                        onClick={() =>
                                            setListEditMode((prev) => ({
                                                ...prev,
                                                [list.id]: !prev[list.id],
                                            }))
                                        }
                                    >
                                        <FilePenIcon className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="px-3"
                                        onClick={() => {
                                            setListIdForDeletingList(list.id);
                                            handleDeleteListPopup();
                                        }}
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <div
                className={`flex-1 ${window.innerWidth >= 350 ? 'p-6' : 'py-6 px-1'} order-last lg:order-none`}
            >
                <div className="flex items-center justify-between mb-4 px-2">
                    <h1 className="text-xl sm:text-2xl font-bold pr-2">
                        {currentList && currentList.name}
                    </h1>
                    {currentList && (
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
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddTask();
                                    }
                                }}
                                className="bg-muted/50 border-none focus:ring-0"
                            />
                            <Button
                                onClick={handleAddTask}
                                disabled={!newTask.title?.trim()}
                            >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Add Task
                            </Button>
                        </div>
                    )}
                </div>
                <div className="grid gap-4">
                    {currentList &&
                        currentList.tasks.map((task) => (
                            <Card key={task.id} className="p-4">
                                <div className="md:flex items-center justify-between hidden">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={task.completed}
                                            onCheckedChange={() =>
                                                editMode[task.id] &&
                                                handleToggleTaskCompletion(
                                                    task.id
                                                )
                                            }
                                            disabled={!editMode[task.id]}
                                        />
                                        {editMode[task.id] ? (
                                            <div className="relative">
                                                <Input
                                                    value={
                                                        editTitle[task.id] ||
                                                        task.title
                                                    }
                                                    onChange={(e) =>
                                                        handleTitleChange(
                                                            task.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            setEditMode(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [task.id]:
                                                                        false,
                                                                })
                                                            );
                                                        }
                                                    }}
                                                    className="w-full sm:w-auto"
                                                />
                                            </div>
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
                                                        : task.priority ===
                                                            'medium'
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
                                                className={`text-xs rounded p-1 dark:font-semibold ${task.progress ===
                                                        'not started'
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
                                                handleEditIconClick(
                                                    task.id,
                                                    task.title,
                                                    task.description,
                                                    task.tags
                                                )
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
                                            onClick={() => {
                                                setTaskIdForDeletingTask(
                                                    task.id
                                                );
                                                handleDeleteTaskPopup();
                                            }}
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                            <span className="sr-only">
                                                Delete task
                                            </span>
                                        </Button>
                                    </div>
                                </div>

                                <div className="md:hidden flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={task.completed}
                                            onCheckedChange={() =>
                                                editMode[task.id] &&
                                                handleToggleTaskCompletion(
                                                    task.id
                                                )
                                            }
                                            disabled={!editMode[task.id]}
                                        />
                                        {editMode[task.id] ? (
                                            <div className="relative">
                                                <Input
                                                    value={
                                                        editTitle[task.id] ||
                                                        task.title
                                                    }
                                                    onChange={(e) =>
                                                        handleTitleChange(
                                                            task.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            setEditMode(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [task.id]:
                                                                        false,
                                                                })
                                                            );
                                                        }
                                                    }}
                                                    className="w-full sm:w-auto"
                                                />
                                            </div>
                                        ) : (
                                            <h3
                                                className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                                            >
                                                {task.title}
                                            </h3>
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
                                                handleEditIconClick(
                                                    task.id,
                                                    task.title,
                                                    task.description,
                                                    task.tags
                                                )
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
                                            onClick={() => {
                                                setTaskIdForDeletingTask(
                                                    task.id
                                                );
                                                handleDeleteTaskPopup();
                                            }}
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                            <span className="sr-only">
                                                Delete task
                                            </span>
                                        </Button>
                                    </div>
                                </div>

                                <div className="md:hidden flex items-center justify-between pt-2 pl-3">
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
                                                        : task.priority ===
                                                            'medium'
                                                            ? 'default'
                                                            : 'secondary'
                                                }
                                            >
                                                {task.priority}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="md:hidden flex items-center justify-between pt-2 pl-3">
                                    <div className="flex items-center gap-2">
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
                                                className={`text-xs rounded p-1 dark:font-semibold ${task.progress ===
                                                        'not started'
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
                                    </div>
                                </div>

                                <div className="mt-2 text-muted-foreground">
                                    {editMode[task.id] ? (
                                        <Input
                                            placeholder="Description"
                                            value={
                                                editDescription[task.id] ||
                                                task.description
                                            }
                                            onChange={(e) =>
                                                handleDescriptionChange(
                                                    task.id,
                                                    e.target.value
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    setEditMode((prev) => ({
                                                        ...prev,
                                                        [task.id]: false,
                                                    }));
                                                }
                                            }}
                                            className="w-full"
                                        />
                                    ) : (
                                        <p>{task.description}</p>
                                    )}
                                    <div className="flex items-center gap-2 mt-2">
                                        {editMode[task.id] ? (
                                            <DatePickerWithPresets
                                                date={new Date(task.dueDate)}
                                                onChange={(newDate) =>
                                                    handleEditTask(task.id, {
                                                        dueDate:
                                                            newDate &&
                                                            newDate
                                                                .toISOString()
                                                                .split('T')[0],
                                                    })
                                                }
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 mt-2">
                                                <CalendarIcon className="w-4 h-4" />
                                                <span>
                                                    Due:{' '}
                                                    {task.dueDate
                                                        ? format(
                                                            new Date(
                                                                task.dueDate
                                                            ),
                                                            'MMM d, yyyy'
                                                        )
                                                        : 'No due date'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mt-2">
                                        <TagIcon className="w-4 h-4" />
                                        {editMode[task.id] ? (
                                            <Input
                                                placeholder="Tags"
                                                value={
                                                    editTags[task.id]?.join(
                                                        ', '
                                                    ) || task.tags.join(', ')
                                                }
                                                onChange={(e) =>
                                                    handleTagsChange(
                                                        task.id,
                                                        e.target.value.split(
                                                            ','
                                                        )
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        setEditMode((prev) => ({
                                                            ...prev,
                                                            [task.id]: false,
                                                        }));
                                                    }
                                                }}
                                                className="w-full"
                                            />
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {task.tags.map((tag) => (
                                                    <Badge
                                                        key={tag}
                                                        variant="outline"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mt-2">
                                        <ActivityIcon className="w-4 h-4" />
                                        <div
                                            className={`w-full bg-muted rounded-full h-2 ${editMode[task.id] &&
                                                    task.progress !==
                                                    'not started' &&
                                                    task.progress !== 'finished'
                                                    ? 'cursor-pointer'
                                                    : ''
                                                }`}
                                            onMouseDown={(e) =>
                                                editMode[task.id] &&
                                                    task.progress !==
                                                    'not started' &&
                                                    task.progress !== 'finished'
                                                    ? handleProgressBarMouseDown(
                                                        task.id,
                                                        e
                                                    )
                                                    : null
                                            }
                                            onClick={(e) =>
                                                editMode[task.id] &&
                                                    task.progress !==
                                                    'not started' &&
                                                    task.progress !== 'finished'
                                                    ? updateProgress(task.id, e)
                                                    : null
                                            }
                                        >
                                            <div
                                                className={`bg-primary rounded-full h-2 ${task.progress ===
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
                <AlertDialog
                    open={deleteConfirmationPopup}
                    onOpenChange={setDeleteConfirmationPopup}
                >
                    <AlertDialogTrigger asChild>
                        <button className="hidden">Open</button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogTitle>
                            <span className="flex justify-center">
                                {`Are you sure you want to delete
                                    ${deleteTaskPopup ? 'the task?' : ''}
                                    ${deleteListPopup ? 'the list?' : ''}
                                    ${deleteAllTasksPopup ? 'all tasks?' : ''}
                                    ${deleteAllListsPopup ? 'all lists?' : ''}`}
                            </span>
                        </AlertDialogTitle>
                        {isDeletingAllLists ? (
                            <div className="flex justify-center mt-4">
                                <div className="w-full h-2 bg-gray-200 rounded-full">
                                    <div className="h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between gap-2 px-10">
                                <AlertDialogAction
                                    className="flex-1 mr-2 py-1 bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-300 dark:hover:bg-red-400 dark:active:bg-red-500"
                                    onClick={() => {
                                        deleteTaskPopup &&
                                            handleDeleteTask(
                                                taskIdForDeletingTask
                                            );
                                        deleteListPopup &&
                                            handleDeleteList(
                                                listIdForDeletingList
                                            );
                                        deleteAllTasksPopup &&
                                            handleDeleteAllTasks();
                                        deleteAllListsPopup &&
                                            handleDeleteAllLists();
                                        setDeleteConfirmationPopup(false);
                                        setDeleteTaskPopup(false);
                                        setDeleteListPopup(false);
                                        setDeleteAllTasksPopup(false);
                                        setDeleteAllListsPopup(false);
                                    }}
                                >
                                    Yes
                                </AlertDialogAction>
                                <AlertDialogAction
                                    className="flex-1 py-1"
                                    onClick={() => {
                                        setDeleteConfirmationPopup(false);
                                        setDeleteTaskPopup(false);
                                        setDeleteListPopup(false);
                                        setDeleteAllTasksPopup(false);
                                        setDeleteAllListsPopup(false);
                                    }}
                                >
                                    No
                                </AlertDialogAction>
                            </div>
                        )}
                    </AlertDialogContent>
                </AlertDialog>
                <br />
                {currentList && currentList.tasks.length > 0 && (
                    <Button
                        size="sm"
                        className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-transparent dark:border dark:border-red-400 dark:hover:border-red-500 dark:active:border-red-600 dark:text-red-400 dark:hover:text-red-500 dark:active:text-red-600"
                        onClick={handleDeleteAllTasksPopup}
                    >
                        <TrashIcon className="w-4 h-4 mr-2 dark:text-red-400 dark:hover:text-red-500 dark:active:text-red-600" />
                        Delete All Tasks
                    </Button>
                )}
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
