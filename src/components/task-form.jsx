'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';
import { Textarea } from './ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Check, ChevronsUpDown, X } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"
import { Badge } from './ui/badge';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().optional(),
  deadline: z.date({
    required_error: 'A deadline is required.',
  }),
  priority: z.enum(['Urgent', 'High', 'Medium', 'Low']),
  dependencies: z.array(z.string()).optional(),
  reminderEmail: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
});

export function TaskForm({
  isOpen,
  onOpenChange,
  onSubmit,
  task,
  taskOptions,
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'Medium',
      dependencies: [],
      reminderEmail: '',
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || '',
        deadline: task.deadline,
        priority: task.priority,
        dependencies: task.dependencies || [],
        reminderEmail: task.reminderEmail || '',
      });
    } else {
      form.reset({
        title: '',
        description: '',
        deadline: undefined,
        priority: 'Medium',
        dependencies: [],
        reminderEmail: '',
      });
    }
  }, [task, form, isOpen]);

  const handleSubmit = (values) => {
    onSubmit({
      ...values,
      dependencies: values.dependencies || [],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            {task
              ? 'Update the details of your task.'
              : 'Fill out the form to create a new task.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Launch new feature" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add more details about the task..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Deadline</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={'outline'}
                            className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                            )}
                            >
                            {field.value ? (
                                format(field.value, 'PPP')
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
              control={form.control}
              name="reminderEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reminder Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g., user@example.com" {...field} />
                  </FormControl>
                   <FormDescription>Enter an email for a task reminder (optional).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dependencies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dependencies</FormLabel>
                  <MultiSelect
                    options={taskOptions.filter(option => option.value !== task?.id)}
                    selected={field.value || []}
                    onChange={field.onChange}
                  />
                  <FormDescription>Select tasks that must be completed before this one.</FormDescription>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Task</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// MultiSelect Component
  function MultiSelect({ options, selected, onChange }) {
    const [open, setOpen] = useState(false);
  
    const handleSelect = (value) => {
      onChange([...selected, value]);
    };
  
    const handleDeselect = (value) => {
      onChange(selected.filter((s) => s !== value));
    };
  
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto"
          >
            <div className="flex gap-1 flex-wrap">
              {selected.length === 0 && <span className='font-normal text-muted-foreground'>Select dependencies...</span>}
              {selected
                .map(value => options.find(option => option.value === value))
                .filter(Boolean)
                .map(option => (
                  <Badge
                    variant="secondary"
                    key={option.value}
                    className="mr-1 mb-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeselect(option.value);
                    }}
                  >
                    {option.label}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search tasks..." />
            <CommandList>
                <CommandEmpty>No tasks found.</CommandEmpty>
                <CommandGroup>
                {options.map((option) => (
                    <CommandItem
                    key={option.value}
                    onSelect={() => {
                        if (selected.includes(option.value)) {
                            handleDeselect(option.value);
                        } else {
                            handleSelect(option.value);
                        }
                    }}
                    >
                    <Check
                        className={cn(
                        "mr-2 h-4 w-4",
                        selected.includes(option.value) ? "opacity-100" : "opacity-0"
                        )}
                    />
                    {option.label}
                    </CommandItem>
                ))}
                </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
