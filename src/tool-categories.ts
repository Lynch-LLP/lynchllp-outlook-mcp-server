export interface ToolCategory {
  name: string;
  pattern: RegExp;
  description: string;
  requiresOrgMode?: boolean;
}

export const TOOL_CATEGORIES: Record<string, ToolCategory> = {
  mail: {
    name: 'mail',
    pattern: /mail|attachment|draft/i,
    description: 'Email operations (read, send, manage folders, attachments)',
  },
  calendar: {
    name: 'calendar',
    pattern: /calendar|event/i,
    description: 'Calendar and event management',
  },
  files: {
    name: 'files',
    pattern: /drive|file|upload|download|folder|item/i,
    description: 'OneDrive file and folder operations',
  },
  personal: {
    name: 'personal',
    pattern:
      /mail|calendar|drive|contact|todo|onenote|attachment|draft|event|file|folder|search|query|people|insight|mailbox|category/i,
    description:
      'Personal productivity tools (mail, calendar, files, contacts, tasks, notes, search, people, insights)',
  },
  work: {
    name: 'work',
    pattern:
      /team|channel|chat|sharepoint|planner|site|list|shared|search|query|meeting|presence|place|room|subscription|group/i,
    description:
      'Organization/work tools (Teams, SharePoint, shared mailboxes, search, meetings, presence)',
    requiresOrgMode: true,
  },
  excel: {
    name: 'excel',
    pattern: /excel|worksheet|workbook|range|chart/i,
    description: 'Excel spreadsheet operations',
  },
  contacts: {
    name: 'contacts',
    pattern: /contact/i,
    description: 'Outlook contacts management',
  },
  tasks: {
    name: 'tasks',
    pattern: /todo|planner|task/i,
    description: 'Task and planning tools (To Do, Planner)',
  },
  onenote: {
    name: 'onenote',
    pattern: /onenote|notebook|section|page/i,
    description: 'OneNote notebook operations',
  },
  search: {
    name: 'search',
    pattern: /search|query/i,
    description: 'Microsoft Search capabilities',
  },
  users: {
    name: 'users',
    pattern: /user|list-users|manager|direct-report|photo|membership/i,
    description: 'User directory and profile access',
    requiresOrgMode: true,
  },
  presence: {
    name: 'presence',
    pattern: /presence|status-message/i,
    description: 'User presence and status management',
    requiresOrgMode: true,
  },
  meetings: {
    name: 'meetings',
    pattern: /meeting|online-meeting|attendance/i,
    description: 'Online meetings management',
    requiresOrgMode: true,
  },
  groups: {
    name: 'groups',
    pattern: /group/i,
    description: 'Microsoft 365 group operations',
    requiresOrgMode: true,
  },
  places: {
    name: 'places',
    pattern: /room|place/i,
    description: 'Room and place directory',
    requiresOrgMode: true,
  },
  sharepoint: {
    name: 'sharepoint',
    pattern: /sharepoint|site|list/i,
    description: 'SharePoint site and list operations',
    requiresOrgMode: true,
  },
  all: {
    name: 'all',
    pattern: /.*/,
    description: 'All available tools',
  },
};

export function getCombinedPresetPattern(presets: string[]): string {
  const patterns = presets.map((preset) => {
    const category = TOOL_CATEGORIES[preset];
    if (!category) {
      throw new Error(
        `Unknown preset: ${preset}. Available presets: ${Object.keys(TOOL_CATEGORIES).join(', ')}`
      );
    }
    return category.pattern.source;
  });
  return patterns.join('|');
}

export function listPresets(): Array<{
  name: string;
  description: string;
  requiresOrgMode?: boolean;
}> {
  return Object.values(TOOL_CATEGORIES).map((category) => ({
    name: category.name,
    description: category.description,
    requiresOrgMode: category.requiresOrgMode,
  }));
}

export function presetRequiresOrgMode(preset: string): boolean {
  const category = TOOL_CATEGORIES[preset];
  return category?.requiresOrgMode || false;
}
