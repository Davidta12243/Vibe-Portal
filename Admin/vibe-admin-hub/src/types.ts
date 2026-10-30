export interface SubSystem {
  id: string;
  name: string;
  category: string;
  port: number;
  liveUrl: string;
  adminUrl: string;
  adminPath: string;
  adminActionLabel: string;
  database: string;
  framework: string;
  color: string;
  iconName: string;
  badgeText: string;
  description: string;
  adminFeatures: string[];
}

export interface CloudTool {
  name: string;
  type: string;
  url: string;
  description: string;
  iconColor: string;
}
