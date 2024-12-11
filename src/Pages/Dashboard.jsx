import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '../components/StrictModeDroppable';
import LayoutWithSidebar from '../layouts/LayoutWithSidebar';
import { RiDragMove2Fill, RiDeleteBin6Line } from "react-icons/ri";
import { IoWarningOutline } from "react-icons/io5";
import Toast from '../components/Toast';
import { decryptData } from '../utils/encryption';
import { Client, Databases, Query, ID } from "appwrite";
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
const databases = new Databases(client);

const getUserId = () => {
    const encryptedId = localStorage.getItem('userId');
    if (!encryptedId) return null;
    
    return decryptData(encryptedId);
};




const Dashboard = () => {
    const [tasks, setTasks] = useState({
        todo: [],
        inProgress: [],
        done: [],
        trash: []
    });
    const [newTask, setNewTask] = useState('');
    const [toast, setToast] = useState(null);
    const [apiLoading, setApiLoading] = useState(true);
    
    const userId = getUserId();

    const fetchTasks = async () => {
        if (!userId) return;

        try {
            const response = await databases.listDocuments(
                '67455f1a0025877bd7ef',
                '67458824002968b1c460',
                [
                    Query.equal('user_id', userId),
                    Query.orderDesc('position')
                ]
            );

            const organizedTasks = {
                todo: [],
                inProgress: [],
                done: [],
                trash: []
            };

            response.documents.forEach(doc => {
                const task = {
                    id: doc.$id,
                    content: doc.task_details,
                    completed: false,
                    position: doc.position
                };
                
                const status = doc.status === 'to_do' ? 'todo' : doc.status === 'in_progress' ? 'inProgress' : doc.status === 'done' ? 'done' : 'trash';
                if (organizedTasks[status]) {
                    organizedTasks[status].push(task);
                }
            });

            Object.keys(organizedTasks).forEach(status => {
                organizedTasks[status].sort((a, b) => a.position - b.position);
            });

            setTasks(organizedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            showToast(
                'Failed to load tasks. Please try again later.',
                <IoWarningOutline />,
                'danger'
            );
        } finally {
            setApiLoading(false);
        }
    };


    

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        
        const totalTasks = Object.entries(tasks)
            .filter(([listId]) => listId !== 'trash')
            .reduce((sum, [_, taskList]) => sum + taskList.length, 0);

        if (totalTasks >= 15) {
            showToast(
                'You can only have 15 active tasks at a time. Please clear some tasks from the trash to add more.',
                null,
                'danger',
            );
            return;
        }
        
        try {
            const highestPosition = tasks.todo.length > 0 
                ? Math.max(...tasks.todo.map(task => task.position || 0)) 
                : 0;

            const response = await databases.createDocument(
                '67455f1a0025877bd7ef',
                '67458824002968b1c460',
                ID.unique(),
                {
                    task_details: newTask,
                    status: 'to_do',
                    user_id: userId,
                    position: highestPosition + 1
                }
            );

            setTasks(prev => ({
                ...prev,
                todo: [...prev.todo, { 
                    id: response.$id, 
                    content: newTask,
                    completed: false,
                    position: highestPosition + 1
                }]
            }));
            setNewTask('');
            showToast(
                'Task added successfully',
                null,
                'success'
            );
        } catch (error) {
            console.error('Error adding task:', error);
            showToast(
                'Failed to add task. Please try again.',
                <IoWarningOutline />,
                'danger'
            );
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        
        const { source, destination } = result;
        
        if (source.droppableId === 'trash' && destination.droppableId !== 'trash') {
            const totalTasks = Object.entries(tasks)
                .filter(([listId]) => listId !== 'trash')
                .reduce((sum, [_, taskList]) => sum + taskList.length, 0);

            if (totalTasks >= 15) {
                showToast(
                    'You can only have 15 active tasks at a time. Please clear some tasks from the trash to add more.',
                    null,
                    'danger'
                );
                return;
            }
        }

        try {
            const sourceList = tasks[source.droppableId];
            const destList = tasks[destination.droppableId];
            const [removed] = sourceList.splice(source.index, 1);
            destList.splice(destination.index, 0, removed);

            const updatedDestList = destList.map((task, index) => ({
                ...task,
                position: index + 1
            }));

            const apiStatus = destination.droppableId === 'todo' ? 'to_do' : destination.droppableId === 'inProgress' ? 'in_progress' : destination.droppableId === 'done' ? 'done' : 'trash';

            await databases.updateDocument(
                '67455f1a0025877bd7ef',
                '67458824002968b1c460',
                removed.id,
                {
                    status: apiStatus,
                    position: destination.index + 1
                }
            );

            const updatePromises = updatedDestList.map((task, index) => 
                databases.updateDocument(
                    '67455f1a0025877bd7ef',
                    '67458824002968b1c460',
                    task.id,
                    { position: index + 1 }
                )
            );

            await Promise.all(updatePromises);

            setTasks({
                ...tasks,
                [source.droppableId]: sourceList.map((task, index) => ({
                    ...task,
                    position: index + 1
                })),
                [destination.droppableId]: updatedDestList
            });

            // fetchTasks();
            showToast(
                'Task updated successfully',
                null,
                'success'
            );
        } catch (error) {
            console.error('Error updating task:', error);
            showToast(
                'Failed to update task. Please try again.',
                <IoWarningOutline />,
                'danger'
            );
        }
        
    };

    useEffect(() => {
        console.log('User ID:', userId);
        if (userId) {
            fetchTasks();
        }
    }, []);

    console.log(tasks);

    const clearTrash = async () => {
        try {
            const deletePromises = tasks.trash.map(task => 
                databases.deleteDocument(
                    '67455f1a0025877bd7ef',
                    '67458824002968b1c460',
                    task.id
                )
            );
            
            await Promise.all(deletePromises);
            
            setTasks(prev => ({
                ...prev,
                trash: []
            }));
            
            showToast(
                'Trash cleared successfully',
                null,
                'success'
            );
        } catch (error) {
            console.error('Error clearing trash:', error);
            showToast(
                'Failed to clear trash. Please try again.',
                <IoWarningOutline />,
                'danger'
            );
        }
    };

    const showToast = (message, icon, type = 'info') => {
        setToast({ message, icon, type });
    };

    return (
        <LayoutWithSidebar>
            {apiLoading ? <div className="pageLoadApi flex justify-center items-center">
                <div className="loading loading-spinner loading-lg"></div> 
            </div> : 
            <div className="p-1 md:p-4 xl:p-6">
                <h1 className="text-2xl font-bold mb-2 md:mb-6">Dashboard</h1>
                
                {/* Task Input Form */}
                <form onSubmit={handleAddTask} className="mb-6">
                    <div className="form-control">
                        <div className="input-group gap-2 flex items-center flex-1">
                            <input
                                type="text"
                                placeholder="Add a new task..."
                                className="input input-bordered w-full"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                            />
                            <button className="btn btn-primary flex-shrink-0" type="submit">
                                Add Task
                            </button>
                        </div>
                    </div>
                </form>

                {/* Tabs */}
                {/* <div className="tabs tabs-boxed mb-4">
                    <a className="tab tab-active">To Do</a>
                    <a className="tab">In Progress</a>
                    <a className="tab">Done</a>
                    <a className="tab">Trash</a>
                </div> */}

                {/* Task Lists */}
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                        {Object.entries(tasks).map(([listId, taskList]) => (
                            <StrictModeDroppable 
                                key={listId} 
                                droppableId={listId}
                            >
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="bg-base-200 p-4 rounded-lg min-h-[200px]"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="font-bold capitalize">{listId}</h2>
                                            {listId === 'trash' && taskList.length > 0 && (
                                                <button 
                                                    onClick={clearTrash}
                                                    className="btn btn-ghost btn-sm"
                                                    title="Clear trash"
                                                >
                                                    <RiDeleteBin6Line className="text-error" />
                                                </button>
                                            )}
                                        </div>
                                        {taskList.map((task, index) => (
                                            <Draggable
                                                key={task.id}
                                                draggableId={task.id}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-base-100 p-3 rounded mb-2 flex items-center shadow-sm gap-2 dragContent"
                                                    >
                                                        <span className='dragText text-ellipsis' title={task.content}>{task.content}</span>
                                                        <span className='cursor-grab dragIcon'><RiDragMove2Fill /></span>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </StrictModeDroppable>
                        ))}
                    </div>
                </DragDropContext>
                {tasks.todo.length === 0 && tasks.inProgress.length === 0 && tasks.done.length === 0 && (
                    <div className="flex justify-center items-center h-full mt-10">
                        <h2 className="text-2xl font-bold">Add some tasks to get started!</h2>
                    </div>
                )}
                {tasks.todo.length !== 0 && tasks.inProgress.length === 0 && tasks.done.length === 0 && (
                    <div className="flex justify-center items-center h-full mt-10">
                        <p className="text-sm">Drag between tabs to change the status of a task</p>
                    </div>
                )}
                {toast && (
                    <Toast
                        message={toast.message}
                        icon={toast.icon}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
            }
        </LayoutWithSidebar>
    );
};

export default Dashboard;