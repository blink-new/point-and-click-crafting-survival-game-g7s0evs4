// Game configuration and constants for Survivor's Haven

import type { 
  Resource, 
  Tool, 
  CraftingRecipe, 
  WorldObject, 
  Threat,
  ResourceType,
  ToolType,
  StructureType 
} from '../types/game';

// Game balance constants
export const GAME_CONFIG = {
  // Time system (in milliseconds)
  DAY_DURATION: 20 * 60 * 1000, // 20 minutes real time = 1 game day
  NIGHT_START: 18, // 6 PM
  NIGHT_END: 6, // 6 AM
  
  // Player stats
  PLAYER_MAX_HEALTH: 100,
  PLAYER_MAX_HUNGER: 100,
  PLAYER_MAX_ENERGY: 100,
  PLAYER_MAX_WARMTH: 100,
  PLAYER_STARTING_INVENTORY_SLOTS: 20,
  
  // Resource gathering
  BASE_HARVEST_TIME: 2000, // 2 seconds
  TOOL_EFFICIENCY_MULTIPLIER: 1.5,
  RESOURCE_RESPAWN_TIME: 5 * 60 * 1000, // 5 minutes
  
  // Crafting
  BASE_CRAFT_TIME: 3000, // 3 seconds
  CRAFTING_QUEUE_MAX: 5,
  
  // Building
  GRID_SIZE: 32, // pixels per grid cell
  MAX_STRUCTURES: 100,
  STRUCTURE_PLACEMENT_RANGE: 5, // grid cells
  
  // Combat
  BASE_PLAYER_DAMAGE: 10,
  THREAT_SPAWN_CHANCE: 0.1, // per minute
  THREAT_MAX_COUNT: 10,
  
  // Weather
  WEATHER_CHANGE_INTERVAL: 10 * 60 * 1000, // 10 minutes
  SEASON_DURATION: 7, // game days
} as const;

// Starting resources for new players
export const STARTING_RESOURCES: Partial<Resource>[] = [
  {
    type: 'wood',
    quantity: 10,
  },
  {
    type: 'stone',
    quantity: 5,
  },
  {
    type: 'food',
    quantity: 3,
  },
];

// Resource definitions
export const RESOURCE_DEFINITIONS: Record<ResourceType, Omit<Resource, 'id' | 'quantity'>> = {
  wood: {
    type: 'wood',
    name: 'Wood',
    description: 'Basic building material from trees',
    icon: '🪵',
    maxStack: 50,
    rarity: 'common',
  },
  stone: {
    type: 'stone',
    name: 'Stone',
    description: 'Durable material for construction',
    icon: '🪨',
    maxStack: 50,
    rarity: 'common',
  },
  food: {
    type: 'food',
    name: 'Food',
    description: 'Restores hunger and health',
    icon: '🍖',
    maxStack: 20,
    rarity: 'common',
  },
  metal: {
    type: 'metal',
    name: 'Metal Ore',
    description: 'Raw metal for advanced crafting',
    icon: '⚙️',
    maxStack: 30,
    rarity: 'uncommon',
  },
  fiber: {
    type: 'fiber',
    name: 'Plant Fiber',
    description: 'Flexible material for tools and rope',
    icon: '🌾',
    maxStack: 40,
    rarity: 'common',
  },
  water: {
    type: 'water',
    name: 'Fresh Water',
    description: 'Essential for survival',
    icon: '💧',
    maxStack: 10,
    rarity: 'common',
  },
  fuel: {
    type: 'fuel',
    name: 'Fuel',
    description: 'Burns to provide heat and light',
    icon: '🔥',
    maxStack: 25,
    rarity: 'common',
  },
  rare_material: {
    type: 'rare_material',
    name: 'Rare Crystal',
    description: 'Mysterious material with unknown properties',
    icon: '💎',
    maxStack: 5,
    rarity: 'rare',
  },
};

// Tool definitions
export const TOOL_DEFINITIONS: Record<ToolType, Omit<Tool, 'id' | 'durability'>> = {
  axe: {
    name: 'Axe',
    type: 'axe',
    maxDurability: 100,
    efficiency: 2.0,
    icon: '🪓',
    description: 'Cuts wood efficiently',
  },
  pickaxe: {
    name: 'Pickaxe',
    type: 'pickaxe',
    maxDurability: 80,
    efficiency: 1.8,
    icon: '⛏️',
    description: 'Mines stone and metal ore',
  },
  spear: {
    name: 'Spear',
    type: 'spear',
    maxDurability: 60,
    efficiency: 1.5,
    icon: '🔱',
    description: 'Hunting weapon for food and defense',
  },
  hammer: {
    name: 'Hammer',
    type: 'hammer',
    maxDurability: 120,
    efficiency: 1.3,
    icon: '🔨',
    description: 'Essential for construction',
  },
  knife: {
    name: 'Knife',
    type: 'knife',
    maxDurability: 40,
    efficiency: 1.2,
    icon: '🔪',
    description: 'Versatile cutting tool',
  },
  bow: {
    name: 'Bow',
    type: 'bow',
    maxDurability: 50,
    efficiency: 2.2,
    icon: '🏹',
    description: 'Ranged hunting and defense weapon',
  },
};

// Basic crafting recipes
export const CRAFTING_RECIPES: CraftingRecipe[] = [
  // Tools
  {
    id: 'craft_axe',
    name: 'Stone Axe',
    description: 'A basic axe for cutting wood',
    category: 'tools',
    requirements: [
      { resourceType: 'wood', quantity: 2 },
      { resourceType: 'stone', quantity: 3 },
      { resourceType: 'fiber', quantity: 1 },
    ],
    result: { type: 'tool', id: 'axe', quantity: 1 },
    craftingTime: 5000,
    unlockLevel: 1,
  },
  {
    id: 'craft_pickaxe',
    name: 'Stone Pickaxe',
    description: 'A basic pickaxe for mining',
    category: 'tools',
    requirements: [
      { resourceType: 'wood', quantity: 2 },
      { resourceType: 'stone', quantity: 4 },
      { resourceType: 'fiber', quantity: 1 },
    ],
    result: { type: 'tool', id: 'pickaxe', quantity: 1 },
    craftingTime: 6000,
    unlockLevel: 1,
  },
  {
    id: 'craft_spear',
    name: 'Wooden Spear',
    description: 'A simple hunting spear',
    category: 'weapons',
    requirements: [
      { resourceType: 'wood', quantity: 3 },
      { resourceType: 'stone', quantity: 1 },
      { resourceType: 'fiber', quantity: 2 },
    ],
    result: { type: 'tool', id: 'spear', quantity: 1 },
    craftingTime: 4000,
    unlockLevel: 1,
  },
  
  // Structures
  {
    id: 'craft_basic_shelter',
    name: 'Basic Shelter',
    description: 'A simple tent for protection',
    category: 'structures',
    requirements: [
      { resourceType: 'wood', quantity: 8 },
      { resourceType: 'fiber', quantity: 6 },
    ],
    result: { type: 'structure', id: 'shelter', quantity: 1 },
    craftingTime: 10000,
    unlockLevel: 1,
  },
  {
    id: 'craft_wooden_wall',
    name: 'Wooden Wall',
    description: 'Basic defensive wall',
    category: 'defense',
    requirements: [
      { resourceType: 'wood', quantity: 4 },
      { resourceType: 'fiber', quantity: 2 },
    ],
    result: { type: 'structure', id: 'wall', quantity: 1 },
    craftingTime: 3000,
    requiredTool: 'hammer',
    unlockLevel: 2,
  },
  {
    id: 'craft_storage_box',
    name: 'Storage Box',
    description: 'Increases inventory capacity',
    category: 'structures',
    requirements: [
      { resourceType: 'wood', quantity: 6 },
      { resourceType: 'fiber', quantity: 3 },
    ],
    result: { type: 'structure', id: 'storage', quantity: 1 },
    craftingTime: 7000,
    requiredTool: 'hammer',
    unlockLevel: 2,
  },
  
  // Materials
  {
    id: 'craft_rope',
    name: 'Rope',
    description: 'Useful for many crafting recipes',
    category: 'materials',
    requirements: [
      { resourceType: 'fiber', quantity: 5 },
    ],
    result: { type: 'resource', id: 'fiber', quantity: 3 },
    craftingTime: 2000,
    unlockLevel: 1,
  },
];

// World object templates
export const WORLD_OBJECT_TEMPLATES = {
  oak_tree: {
    type: 'tree' as const,
    name: 'Oak Tree',
    size: { width: 2, height: 2 },
    health: 30,
    maxHealth: 30,
    icon: '🌳',
    harvestable: true,
    resources: [
      { resourceType: 'wood' as ResourceType, quantity: { min: 3, max: 6 }, chance: 1.0, requiredTool: 'axe' as ToolType },
      { resourceType: 'fiber' as ResourceType, quantity: { min: 1, max: 2 }, chance: 0.3 },
    ],
    respawnTime: 10 * 60 * 1000, // 10 minutes
  },
  stone_deposit: {
    type: 'rock' as const,
    name: 'Stone Deposit',
    size: { width: 1, height: 1 },
    health: 20,
    maxHealth: 20,
    icon: '🪨',
    harvestable: true,
    resources: [
      { resourceType: 'stone' as ResourceType, quantity: { min: 2, max: 4 }, chance: 1.0, requiredTool: 'pickaxe' as ToolType },
      { resourceType: 'metal' as ResourceType, quantity: { min: 1, max: 1 }, chance: 0.1, requiredTool: 'pickaxe' as ToolType },
    ],
    respawnTime: 15 * 60 * 1000, // 15 minutes
  },
  berry_bush: {
    type: 'bush' as const,
    name: 'Berry Bush',
    size: { width: 1, height: 1 },
    health: 10,
    maxHealth: 10,
    icon: '🫐',
    harvestable: true,
    resources: [
      { resourceType: 'food' as ResourceType, quantity: { min: 1, max: 3 }, chance: 1.0 },
      { resourceType: 'fiber' as ResourceType, quantity: { min: 1, max: 1 }, chance: 0.2 },
    ],
    respawnTime: 5 * 60 * 1000, // 5 minutes
  },
  water_spring: {
    type: 'water_source' as const,
    name: 'Natural Spring',
    size: { width: 1, height: 1 },
    health: 999,
    maxHealth: 999,
    icon: '💧',
    harvestable: true,
    resources: [
      { resourceType: 'water' as ResourceType, quantity: { min: 2, max: 4 }, chance: 1.0 },
    ],
    respawnTime: 1 * 60 * 1000, // 1 minute
  },
};

// Threat templates
export const THREAT_TEMPLATES = {
  wolf: {
    name: 'Wolf',
    type: 'wolf' as const,
    health: 40,
    maxHealth: 40,
    damage: 15,
    speed: 2,
    detectionRange: 8,
    attackRange: 1,
    behavior: 'aggressive' as const,
    icon: '🐺',
    loot: [
      { resourceType: 'food' as ResourceType, quantity: { min: 2, max: 4 }, chance: 1.0 },
      { resourceType: 'fiber' as ResourceType, quantity: { min: 1, max: 2 }, chance: 0.7 },
    ],
  },
  bear: {
    name: 'Bear',
    type: 'bear' as const,
    health: 80,
    maxHealth: 80,
    damage: 25,
    speed: 1.5,
    detectionRange: 6,
    attackRange: 1,
    behavior: 'territorial' as const,
    icon: '🐻',
    loot: [
      { resourceType: 'food' as ResourceType, quantity: { min: 4, max: 8 }, chance: 1.0 },
      { resourceType: 'fiber' as ResourceType, quantity: { min: 2, max: 4 }, chance: 1.0 },
      { resourceType: 'rare_material' as ResourceType, quantity: { min: 1, max: 1 }, chance: 0.1 },
    ],
  },
};

// Structure benefits
export const STRUCTURE_BENEFITS = {
  shelter: [
    { type: 'comfort' as const, value: 20 },
    { type: 'defense' as const, value: 10 },
  ],
  wall: [
    { type: 'defense' as const, value: 30 },
  ],
  storage: [
    { type: 'storage' as const, value: 20 },
  ],
  watchtower: [
    { type: 'visibility' as const, value: 50 },
    { type: 'defense' as const, value: 15 },
  ],
  workbench: [
    { type: 'crafting' as const, value: 25 },
  ],
};

// UI Constants
export const UI_CONFIG = {
  INVENTORY_GRID_COLS: 5,
  INVENTORY_GRID_ROWS: 4,
  CRAFTING_SLOTS: 9,
  NOTIFICATION_DURATION: 5000,
  ANIMATION_DURATION: 300,
  TOOLTIP_DELAY: 500,
} as const;