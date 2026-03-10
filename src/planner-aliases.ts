/**
 * Snake_case Planner tool aliases.
 *
 * The generated client (src/generated/client.ts) is gitignored and rebuilt from
 * the OpenAPI spec. Custom snake_case aliases live here so they survive regeneration.
 * These are merged with api.endpoints in graph-tools.ts.
 */
import { z } from 'zod';
import type { Endpoint } from './generated/endpoint-types.js';

const plannerAssignments = z.object({}).passthrough();

const plannerTaskDetails = z
  .object({
    description: z.string().nullish(),
    checklist: z.record(z.any()).nullish(),
    references: z.record(z.any()).nullish(),
    previewType: z.string().nullish(),
  })
  .passthrough();

const plannerTaskBody = z.object({
  planId: z.string().describe('Plan ID the task belongs to.').optional(),
  title: z.string().describe('Title of the task.').optional(),
  bucketId: z.string().describe('Bucket ID to place the task in.').nullish(),
  dueDateTime: z
    .string()
    .describe('Due date in ISO 8601 UTC format, e.g. 2025-12-31T00:00:00Z')
    .nullish(),
  startDateTime: z.string().describe('Start date in ISO 8601 UTC format.').nullish(),
  percentComplete: z
    .number()
    .int()
    .gte(0)
    .lte(100)
    .describe('Completion percentage 0-100.')
    .nullish(),
  priority: z
    .number()
    .int()
    .describe('Priority: 0=unset, 1=urgent, 3=important, 5=medium, 9=low.')
    .nullish(),
  assignments: plannerAssignments.optional(),
});

export const plannerAliasEndpoints: Endpoint[] = [
  {
    method: 'get',
    path: '/me/planner/plans',
    alias: 'list_planner_plans',
    description: 'List all Planner plans the current user has access to. Returns plan ID, title, and group ID.',
    requestFormat: 'json',
    parameters: [
      { name: '$top', type: 'Query', schema: z.number().int().gte(0).describe('Show only the first n items').optional() },
      { name: '$skip', type: 'Query', schema: z.number().int().gte(0).describe('Skip the first n items').optional() },
      { name: '$filter', type: 'Query', schema: z.string().describe('Filter items by property values').optional() },
      { name: '$select', type: 'Query', schema: z.array(z.string()).describe('Select properties to be returned').optional() },
      { name: '$orderby', type: 'Query', schema: z.array(z.string()).describe('Order items by property values').optional() },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/planner/plans/:plannerPlanId',
    alias: 'get_planner_plan',
    description: 'Get details of a specific Planner plan including title and owner group ID.',
    requestFormat: 'json',
    parameters: [
      { name: 'plannerPlanId', type: 'Path', schema: z.string().describe('The Planner plan ID.') },
      { name: '$select', type: 'Query', schema: z.array(z.string()).describe('Select properties to be returned').optional() },
      { name: '$expand', type: 'Query', schema: z.array(z.string()).describe('Expand related entities').optional() },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/planner/plans/:plannerPlanId/buckets',
    alias: 'list_planner_buckets',
    description: 'List all buckets in a Planner plan. Returns bucket ID, name, and orderHint.',
    requestFormat: 'json',
    parameters: [
      { name: 'plannerPlanId', type: 'Path', schema: z.string().describe('The Planner plan ID.') },
      { name: '$top', type: 'Query', schema: z.number().int().gte(0).describe('Show only the first n items').optional() },
      { name: '$filter', type: 'Query', schema: z.string().describe('Filter items by property values').optional() },
      { name: '$select', type: 'Query', schema: z.array(z.string()).describe('Select properties to be returned').optional() },
      { name: '$orderby', type: 'Query', schema: z.array(z.string()).describe('Order items by property values').optional() },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/planner/plans/:plannerPlanId/tasks',
    alias: 'list_planner_tasks',
    description:
      'List all tasks in a Planner plan. Supports $filter for assignee (assignments/any(a:a/userId eq \'USER_ID\')) and completion status (percentComplete eq 0). Returns task ID, title, bucketId, assignee, dueDateTime, percentComplete, and priority.',
    requestFormat: 'json',
    parameters: [
      { name: 'plannerPlanId', type: 'Path', schema: z.string().describe('The Planner plan ID.') },
      { name: '$top', type: 'Query', schema: z.number().int().gte(0).describe('Show only the first n items').optional() },
      { name: '$skip', type: 'Query', schema: z.number().int().gte(0).describe('Skip the first n items').optional() },
      {
        name: '$filter',
        type: 'Query',
        schema: z
          .string()
          .describe(
            "Filter tasks. Examples: \"percentComplete eq 0\" for incomplete; \"assignments/any(a:a/userId eq 'USER_ID')\" for assignee."
          )
          .optional(),
      },
      { name: '$select', type: 'Query', schema: z.array(z.string()).describe('Select properties to be returned').optional() },
      { name: '$orderby', type: 'Query', schema: z.array(z.string()).describe('Order items by property values').optional() },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/planner/tasks/:plannerTaskId',
    alias: 'get_planner_task',
    description:
      'Get a Planner task by ID. Returns title, bucketId, planId, assignments, dueDateTime, percentComplete, and priority. NOTE: Call get-planner-task-details for description and checklist. Use includeHeaders=true to get the ETag for update_planner_task.',
    requestFormat: 'json',
    parameters: [
      { name: 'plannerTaskId', type: 'Path', schema: z.string().describe('The Planner task ID.') },
      { name: '$select', type: 'Query', schema: z.array(z.string()).describe('Select properties to be returned').optional() },
      { name: '$expand', type: 'Query', schema: z.array(z.string()).describe('Expand related entities').optional() },
    ],
    response: z.void(),
  },
  {
    method: 'post',
    path: '/planner/tasks',
    alias: 'create_planner_task',
    description:
      'Create a new Planner task. Required: planId, title. Optional: bucketId, assignments, dueDateTime, priority (0=unset, 1=urgent, 3=important, 5=medium, 9=low), percentComplete, startDateTime.',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        description: 'Task to create. planId and title are required.',
        type: 'Body',
        schema: plannerTaskBody,
      },
    ],
    response: z.void(),
  },
  {
    method: 'patch',
    path: '/planner/tasks/:plannerTaskId',
    alias: 'update_planner_task',
    description:
      'Update a Planner task. REQUIRES If-Match header with the task ETag — call get_planner_task with includeHeaders=true first. Supports: title, bucketId, dueDateTime, startDateTime, percentComplete, priority, assignments.',
    requestFormat: 'json',
    parameters: [
      { name: 'plannerTaskId', type: 'Path', schema: z.string().describe('The Planner task ID.') },
      {
        name: 'body',
        description: 'Task fields to update.',
        type: 'Body',
        schema: plannerTaskBody,
      },
      {
        name: 'If-Match',
        type: 'Header',
        schema: z
          .string()
          .describe('ETag from get_planner_task with includeHeaders=true. Required for all updates.'),
      },
    ],
    response: z.void(),
  },
  {
    method: 'delete',
    path: '/planner/tasks/:plannerTaskId',
    alias: 'delete_planner_task',
    description:
      'Delete a Planner task permanently. REQUIRES If-Match header with the task ETag — call get_planner_task with includeHeaders=true first.',
    requestFormat: 'json',
    parameters: [
      { name: 'plannerTaskId', type: 'Path', schema: z.string().describe('The Planner task ID.') },
      {
        name: 'If-Match',
        type: 'Header',
        schema: z
          .string()
          .describe('ETag from get_planner_task with includeHeaders=true. Required.'),
      },
    ],
    response: z.void(),
  },
  {
    method: 'patch',
    path: '/planner/tasks/:plannerTaskId/details',
    alias: 'update_planner_task_details',
    description:
      'Update task description, checklist items, and references. REQUIRES If-Match header from get-planner-task-details with includeHeaders=true. Body: { description, checklist, references }.',
    requestFormat: 'json',
    parameters: [
      { name: 'plannerTaskId', type: 'Path', schema: z.string().describe('The Planner task ID.') },
      {
        name: 'body',
        description:
          'Task details to update. Fields: description (string), checklist (object keyed by GUID), references (object keyed by encoded URL).',
        type: 'Body',
        schema: plannerTaskDetails,
      },
      {
        name: 'If-Match',
        type: 'Header',
        schema: z
          .string()
          .describe('ETag from get-planner-task-details with includeHeaders=true. Required.'),
      },
    ],
    response: z.void(),
  },
];
