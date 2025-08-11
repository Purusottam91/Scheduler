'use server';

import { smartSort } from '@/ai/flows/smart-sort';

export async function getPrioritizedTasks(tasks) {
  const input = {
    tasks: tasks.map(task => ({
      ...task,
      description: task.description || '',
      deadline: task.deadline.toISOString(),
      dependencies: task.dependencies || [],
    })),
  };

  try {
    const { prioritizedTasks } = await smartSort(input);
    if (!prioritizedTasks) {
      throw new Error('AI failed to return prioritized tasks.');
    }
    return prioritizedTasks.map(task => ({
      ...task,
      deadline: new Date(task.deadline),
    }));
  } catch (error) {
    console.error('Error in smart sort:', error);
    throw new Error('Failed to prioritize tasks due to an internal error.');
  }
}