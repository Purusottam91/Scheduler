/**
 * @typedef {'Urgent' | 'High' | 'Medium' | 'Low'} TaskPriority
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {Date} deadline
 * @property {TaskPriority} priority
 * @property {string[]} dependencies
 * @property {string} [reminderEmail]
 */
