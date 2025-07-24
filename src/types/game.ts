// Core game types for Survivor's Haven

export interface Position {
  x: number;
  y: number;
}

export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
  description: string;
  icon: string;
  quantity: number;
  maxStack: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export type ResourceType = 
  | 'wood' 
  | 'stone' 
  | 'food' 
  | 'metal' 
  | 'fiber' 
  | 'water' 
  | 'fuel' 
  | 'rare_material';

export interface Tool {
  id: string;
  name: string;
  type: ToolType;
  durability: number;
  maxDurability: number;
  efficiency: number;
  icon: string;
  description: string;
}

export type ToolType = 'axe' | 'pickaxe' | 'spear' | 'hammer' | 'knife' | 'bow';

export interface CraftingRecipe {
  id: string;
  name: string;
  description: string;
  category: CraftingCategory;
  requirements: ResourceRequirement[];
  result: {
    type: 'resource' | 'tool' | 'structure';
    id: string;
    quantity: number;
  };
  craftingTime: number;
  requiredTool?: ToolType;
  unlockLevel: number;
}

export type CraftingCategory = 
  | 'tools' 
  | 'materials' 
  | 'structures' 
  | 'weapons' 
  | 'food' 
  | 'defense';

export interface ResourceRequirement {
  resourceType: ResourceType;
  quantity: number;
}

export interface Structure {
  id: string;
  name: string;
  type: StructureType;
  position: Position;
  size: { width: number; height: number };
  health: number;
  maxHealth: number;
  level: number;
  maxLevel: number;
  icon: string;
  description: string;
  benefits: StructureBenefit[];
}

export type StructureType = 
  | 'shelter' 
  | 'wall' 
  | 'door' 
  | 'window' 
  | 'storage' 
  | 'workbench' 
  | 'fire' 
  | 'trap' 
  | 'watchtower';

export interface StructureBenefit {
  type: 'defense' | 'storage' | 'crafting' | 'comfort' | 'visibility';
  value: number;
}

export interface Player {
  id: string;
  name: string;
  level: number;
  experience: number;
  stats: PlayerStats;
  position: Position;
  inventory: Resource[];
  equippedTool?: Tool;
  maxInventorySlots: number;
}

export interface PlayerStats {
  health: number;
  maxHealth: number;
  hunger: number;
  maxHunger: number;
  energy: number;
  maxEnergy: number;
  warmth: number;
  maxWarmth: number;
}

export interface WorldObject {
  id: string;
  type: WorldObjectType;
  name: string;
  position: Position;
  size: { width: number; height: number };
  resources: ResourceDrop[];
  respawnTime?: number;
  lastHarvested?: number;
  health: number;
  maxHealth: number;
  icon: string;
  harvestable: boolean;
}

export type WorldObjectType = 
  | 'tree' 
  | 'rock' 
  | 'bush' 
  | 'water_source' 
  | 'ore_deposit' 
  | 'animal' 
  | 'ruins';

export interface ResourceDrop {
  resourceType: ResourceType;
  quantity: { min: number; max: number };
  chance: number;
  requiredTool?: ToolType;
}

export interface Threat {
  id: string;
  name: string;
  type: ThreatType;
  position: Position;
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
  detectionRange: number;
  attackRange: number;
  behavior: ThreatBehavior;
  icon: string;
  loot: ResourceDrop[];
}

export type ThreatType = 
  | 'wolf' 
  | 'bear' 
  | 'bandit' 
  | 'storm' 
  | 'cold_snap' 
  | 'wildfire';

export type ThreatBehavior = 
  | 'passive' 
  | 'defensive' 
  | 'aggressive' 
  | 'territorial' 
  | 'environmental';

export interface GameState {
  player: Player;
  worldObjects: WorldObject[];
  structures: Structure[];
  threats: Threat[];
  timeOfDay: number; // 0-24 hours
  dayCount: number;
  season: Season;
  weather: WeatherCondition;
  gameMode: GameMode;
  difficulty: Difficulty;
}

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface WeatherCondition {
  type: WeatherType;
  intensity: number; // 0-1
  duration: number; // minutes
  effects: WeatherEffect[];
}

export type WeatherType = 
  | 'clear' 
  | 'cloudy' 
  | 'rain' 
  | 'storm' 
  | 'snow' 
  | 'fog' 
  | 'wind';

export interface WeatherEffect {
  type: 'visibility' | 'movement' | 'resource_gathering' | 'health' | 'energy';
  modifier: number; // multiplier
}

export type GameMode = 'survival' | 'creative' | 'peaceful';
export type Difficulty = 'easy' | 'normal' | 'hard' | 'extreme';

export interface GameAction {
  type: GameActionType;
  payload: any;
  timestamp: number;
}

export type GameActionType = 
  | 'MOVE_PLAYER'
  | 'HARVEST_RESOURCE'
  | 'CRAFT_ITEM'
  | 'BUILD_STRUCTURE'
  | 'EQUIP_TOOL'
  | 'CONSUME_ITEM'
  | 'ATTACK_THREAT'
  | 'UPGRADE_STRUCTURE'
  | 'SAVE_GAME'
  | 'LOAD_GAME';

export interface GameEvent {
  id: string;
  type: GameEventType;
  title: string;
  description: string;
  timestamp: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actions?: GameEventAction[];
}

export type GameEventType = 
  | 'resource_depleted'
  | 'threat_approaching'
  | 'weather_change'
  | 'structure_damaged'
  | 'tool_broken'
  | 'level_up'
  | 'discovery'
  | 'seasonal_change';

export interface GameEventAction {
  label: string;
  action: GameActionType;
  payload: any;
}

// UI-specific types
export interface UIState {
  activePanel: UIPanel;
  selectedObject?: WorldObject | Structure;
  craftingQueue: CraftingJob[];
  notifications: GameEvent[];
  showGrid: boolean;
  cameraPosition: Position;
  zoomLevel: number;
}

export type UIPanel = 
  | 'inventory' 
  | 'crafting' 
  | 'building' 
  | 'stats' 
  | 'map' 
  | 'settings';

export interface CraftingJob {
  id: string;
  recipeId: string;
  startTime: number;
  duration: number;
  progress: number;
  status: 'queued' | 'in_progress' | 'completed' | 'cancelled';
}