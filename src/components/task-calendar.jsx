'use client';

import {
  Calendar as CalendarIcon,
  List,
  Plus,
  MoreHorizontal,
  Trash2,
  Pencil,
  Info,
} from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from './ui/button.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table.jsx';
import { Badge } from './ui/badge.jsx';
import { format } from 'date-fns';
import { TaskForm } from './task-form.jsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu.jsx';
import { Calendar } from './ui/calendar.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs.jsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip.jsx';


const initialTasks = [
    { id: 'task-1', title: 'Finalize Q3 marketing budget', description: 'Review and approve the budget proposal from the marketing team.', deadline: new Date(new Date().setDate(new Date().getDate() + 5)), priority: 'Urgent', dependencies: [] },
    { id: 'task-2', title: 'Develop new homepage design', description: 'Collaborate with the UI/UX team to create mockups for the new homepage.', deadline: new Date(new Date().setDate(new Date().getDate() + 10)), priority: 'High', dependencies: ['task-3'] },
    { id: 'task-3', title: 'User research for homepage redesign', description: 'Conduct surveys and interviews to gather user feedback.', deadline: new Date(new Date().setDate(new Date().getDate() + 2)), priority: 'High', dependencies: [] },
    { id: 'task-4', title: 'Update backend API for new feature', description: 'Implement new endpoints for the upcoming feature release.', deadline: new Date(new Date().setDate(new Date().getDate() + 12)), priority: 'Medium', dependencies: ['task-2'] },
    { id: 'task-5', title: 'Plan team offsite event', description: 'Organize logistics for the annual team offsite.', deadline: new Date(new Date().setDate(new Date().getDate() + 25)), priority: 'Low', dependencies: [] },
    { id: 'task-6', title: 'Fix login authentication bug', description: 'A critical bug is preventing some users from logging in.', deadline: new Date(new Date().setDate(new Date().getDate() + 1)), priority: 'Urgent', dependencies: [] },
    { id: 'task-7', title: 'Write documentation for API', description: 'Document all public endpoints for external developers.', deadline: new Date(new Date().setDate(new Date().getDate() + 18)), priority: 'Medium', dependencies: ['task-4'] },
];

const priorityConfig = {
  Urgent: {
    className: 'border-transparent bg-red-500/10 text-red-500 hover:bg-red-500/20',
    dotClassName: 'bg-red-500',
  },
  High: {
    className: 'border-transparent bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
    dotClassName: 'bg-orange-500',
  },
  Medium: {
    className: 'border-transparent bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
    dotClassName: 'bg-yellow-500',
  },
  Low: {
    className: 'border-transparent bg-green-500/10 text-green-500 hover:bg-green-500/20',
    dotClassName: 'bg-green-500',
  },
};

export function TaskCalendar() {
  const [tasks, setTasks] = useState(initialTasks);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const allTaskOptions = useMemo(() => tasks.map(t => ({ value: t.id, label: t.title })), [tasks]);
  
  const tasksByDay = useMemo(() => {
    return tasks.reduce((acc, task) => {
        const day = format(task.deadline, 'yyyy-MM-dd');
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(task);
        return acc;
    }, {});
  }, [tasks]);

  const tasksForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];
    const day = format(selectedDate, 'yyyy-MM-dd');
    return tasksByDay[day] || [];
  }, [selectedDate, tasksByDay]);


  const handleAddTask = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleDeleteTask = (task) => {
    setDeletingTask(task);
  };

  const confirmDelete = () => {
    if (deletingTask) {
      setTasks(tasks.filter(t => t.id !== deletingTask.id));
      setDeletingTask(null);
      toast({
        title: 'Task deleted',
        description: `"${deletingTask.title}" has been removed.`,
      });
    }
  };

  const handleFormSubmit = (taskData) => {
    if (editingTask) {
      // Update
      setTasks(
        tasks.map(t =>
          t.id === editingTask.id ? { ...t, ...taskData } : t
        )
      );
      toast({ title: 'Task updated!', description: `"${taskData.title}" has been saved.`});
    } else {
      // Create
      const newId = `task-${Date.now()}`;
      setTasks([...tasks, { ...taskData, id: newId }]);
      toast({ title: 'Task created!', description: `"${taskData.title}" has been added.`});
    }
    setFormOpen(false);
    setEditingTask(null);
  };

  const renderTaskRow = (task) => (
    <TableRow key={task.id}>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{task.title}</span>
          {task.dependencies.length > 0 && (
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 cursor-help">
                            <Info className="h-3 w-3" />
                            <span>{task.dependencies.length} {task.dependencies.length > 1 ? 'dependencies' : 'dependency'}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="font-medium">Dependencies:</p>
                        <ul className="list-disc pl-4">
                            {task.dependencies.map(depId => {
                                const depTask = tasks.find(t => t.id === depId);
                                return <li key={depId}>{depTask ? depTask.title : `Unknown task: ${depId}`}</li>;
                            })}
                        </ul>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={cn('capitalize', priorityConfig[task.priority].className)}
        >
          {task.priority}
        </Badge>
      </TableCell>
      <TableCell>{format(task.deadline, 'MMM d, yyyy')}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEditTask(task)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteTask(task)}
              className="text-red-500 focus:text-red-500"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="flex h-full flex-col">
      <TaskForm
        isOpen={isFormOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        task={editingTask}
        taskOptions={allTaskOptions}
      />
      <AlertDialog
        open={!!deletingTask}
        onOpenChange={() => setDeletingTask(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              task "{deletingTask?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Tabs defaultValue="list" className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b px-6 py-3">
          <TabsList>
            <TabsTrigger value="list"><List className="mr-2 h-4 w-4" />List</TabsTrigger>
            <TabsTrigger value="month"><CalendarIcon className="mr-2 h-4 w-4" />Month</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button onClick={handleAddTask}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        <TabsContent value="list" className="flex-1 overflow-auto p-6">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {tasks.length > 0 ? (
                    tasks.map(renderTaskRow)
                ) : (
                    <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">
                        No tasks yet. Add one to get started!
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </TabsContent>
        <TabsContent value="month" className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card>
                        <CardContent className="p-0">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="w-full"
                            components={{
                                DayContent: ({ date }) => {
                                    const day = format(date, 'yyyy-MM-dd');
                                    const dayTasks = tasksByDay[day] || [];
                                    if (dayTasks.length === 0) return <div className="relative h-full w-full">{date.getDate()}</div>;
                                    
                                    const hasUrgent = dayTasks.some(t => t.priority === 'Urgent');
                                    const dotColor = hasUrgent ? priorityConfig['Urgent'].dotClassName : priorityConfig[dayTasks[0].priority].dotClassName;

                                    return (
                                        <div className="relative flex h-full w-full items-center justify-center">
                                            {date.getDate()}
                                            <span className={cn("absolute bottom-1 h-1.5 w-1.5 rounded-full", dotColor)}></span>
                                        </div>
                                    );
                                },
                            }}
                        />
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Tasks for {selectedDate ? format(selectedDate, 'MMM d, yyyy') : '...'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {tasksForSelectedDay.length > 0 ? (
                                <ul className="space-y-3">
                                    {tasksForSelectedDay.map(task => (
                                        <li key={task.id} className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                <span className={cn("mt-1.5 h-2 w-2 rounded-full shrink-0", priorityConfig[task.priority].dotClassName)}></span>
                                                <div className='flex flex-col'>
                                                  <span className="font-medium">{task.title}</span>
                                                  <span className="text-sm text-muted-foreground">{task.description}</span>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                                  <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditTask(task)}>
                                                  <Pencil className="mr-2 h-4 w-4" />
                                                  Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                  onClick={() => handleDeleteTask(task)}
                                                  className="text-red-500 focus:text-red-500"
                                                >
                                                  <Trash2 className="mr-2 h-4 w-4" />
                                                  Delete
                                                </DropdownMenuItem>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">No tasks scheduled for this day.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
