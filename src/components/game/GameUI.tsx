// Game UI components for Survivor's Haven

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Heart, 
  Zap, 
  Apple, 
  Thermometer, 
  Package, 
  Hammer, 
  Shield, 
  Clock,
  Sun,
  Moon
} from 'lucide-react';
import type { GameState, UIPanel } from '../../types/game';
import { RESOURCE_DEFINITIONS } from '../../lib/gameConfig';

// Inventory Panel Component
const InventoryPanel: React.FC<{ player: any }> = ({ player }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Inventory</h3>
        <Badge variant="outline">
          {player.inventory.length}/{player.maxInventorySlots}
        </Badge>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: player.maxInventorySlots }).map((_, index) => {
          const item = player.inventory[index];
          return (
            <motion.div
              key={index}
              className={`aspect-square border-2 border-dashed rounded-lg flex items-center justify-center text-2xl ${
                item ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {item && (
                <div className="relative">
                  <span>{RESOURCE_DEFINITIONS[item.type]?.icon || '📦'}</span>
                  {item.quantity > 1 && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-2 text-xs px-1 py-0 min-w-0 h-4"
                    >
                      {item.quantity}
                    </Badge>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Equipped Tool */}
      {player.equippedTool && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Equipped Tool</h4>
          <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-lg">
            <span className="text-2xl">{player.equippedTool.icon}</span>
            <div>
              <p className="font-medium">{player.equippedTool.name}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Progress 
                  value={(player.equippedTool.durability / player.equippedTool.maxDurability) * 100}
                  className="h-1 w-20"
                />
                <span className="text-xs text-muted-foreground">
                  {player.equippedTool.durability}/{player.equippedTool.maxDurability}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Crafting Panel Component
const CraftingPanel: React.FC<{ gameState: GameState; onGameStateChange: (state: GameState) => void }> = ({ 
  gameState, 
  onGameStateChange 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Crafting</h3>
      <p className="text-sm text-muted-foreground">
        Crafting system coming soon! Gather resources to unlock recipes.
      </p>
      
      {/* Quick resource summary */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Available Resources:</h4>
        {gameState.player.inventory.map((resource, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="flex items-center space-x-2">
              <span>{RESOURCE_DEFINITIONS[resource.type]?.icon}</span>
              <span>{RESOURCE_DEFINITIONS[resource.type]?.name}</span>
            </span>
            <Badge variant="outline" className="text-xs">
              {resource.quantity}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

// Building Panel Component
const BuildingPanel: React.FC<{ gameState: GameState; onGameStateChange: (state: GameState) => void }> = ({ 
  gameState, 
  onGameStateChange 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Building</h3>
      <p className="text-sm text-muted-foreground">
        Construction system coming soon! Build shelters and defenses.
      </p>
      
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Current Structures:</h4>
        {gameState.structures.length === 0 ? (
          <p className="text-sm text-muted-foreground">No structures built yet</p>
        ) : (
          gameState.structures.map((structure, index) => (
            <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
              <span className="flex items-center space-x-2">
                <span>{structure.icon}</span>
                <span>{structure.name}</span>
              </span>
              <Badge variant="outline" className="text-xs">
                Level {structure.level}
              </Badge>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Stats Panel Component
const StatsPanel: React.FC<{ player: any; gameState: GameState }> = ({ player, gameState }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Statistics</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Experience:</span>
          <span className="font-medium">{player.experience} XP</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Days Survived:</span>
          <span className="font-medium">{gameState.dayCount}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Resources Collected:</span>
          <span className="font-medium">
            {player.inventory.reduce((total: number, item: any) => total + item.quantity, 0)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Structures Built:</span>
          <span className="font-medium">{gameState.structures.length}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Current Season:</span>
          <span className="font-medium capitalize">{gameState.season}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Weather:</span>
          <span className="font-medium capitalize">{gameState.weather.type}</span>
        </div>
      </div>
    </div>
  );
};

interface GameUIProps {
  gameState: GameState;
  activePanel: UIPanel;
  onPanelChange: (panel: UIPanel) => void;
  onGameStateChange: (newState: GameState) => void;
}

export const GameUI: React.FC<GameUIProps> = ({ 
  gameState, 
  activePanel, 
  onPanelChange,
  onGameStateChange 
}) => {
  const { player } = gameState;
  
  // Calculate day/night status
  const isDaytime = gameState.timeOfDay >= 6 && gameState.timeOfDay < 18;
  const timeIcon = isDaytime ? Sun : Moon;
  const timeColor = isDaytime ? 'text-yellow-500' : 'text-blue-400';
  
  // Format time display
  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = Math.floor((time - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Status Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 pointer-events-auto">
        <Card className="bg-card/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {/* Player Stats */}
              <div className="flex items-center space-x-6">
                {/* Health */}
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <div className="w-24">
                    <Progress 
                      value={(player.stats.health / player.stats.maxHealth) * 100} 
                      className="h-2"
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {player.stats.health}/{player.stats.maxHealth}
                  </span>
                </div>
                
                {/* Hunger */}
                <div className="flex items-center space-x-2">
                  <Apple className="w-5 h-5 text-green-500" />
                  <div className="w-24">
                    <Progress 
                      value={(player.stats.hunger / player.stats.maxHunger) * 100} 
                      className="h-2"
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {player.stats.hunger}/{player.stats.maxHunger}
                  </span>
                </div>
                
                {/* Energy */}
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <div className="w-24">
                    <Progress 
                      value={(player.stats.energy / player.stats.maxEnergy) * 100} 
                      className="h-2"
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {player.stats.energy}/{player.stats.maxEnergy}
                  </span>
                </div>
                
                {/* Warmth */}
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-5 h-5 text-orange-500" />
                  <div className="w-24">
                    <Progress 
                      value={(player.stats.warmth / player.stats.maxWarmth) * 100} 
                      className="h-2"
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {player.stats.warmth}/{player.stats.maxWarmth}
                  </span>
                </div>
              </div>
              
              {/* Time and Day Info */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <timeIcon.type className={`w-5 h-5 ${timeColor}`} />
                  <span className="text-sm font-medium">
                    {formatTime(gameState.timeOfDay)}
                  </span>
                </div>
                <Badge variant="outline">
                  Day {gameState.dayCount}
                </Badge>
                <Badge variant="outline">
                  Level {player.level}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Side Panel */}
      <div className="absolute top-20 right-4 bottom-4 w-80 pointer-events-auto">
        <Card className="h-full bg-card/95 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Game Panel</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full">
            <Tabs value={activePanel} onValueChange={(value) => onPanelChange(value as UIPanel)}>
              <TabsList className="grid w-full grid-cols-4 mx-4 mb-4">
                <TabsTrigger value="inventory" className="text-xs">
                  <Package className="w-4 h-4 mr-1" />
                  Items
                </TabsTrigger>
                <TabsTrigger value="crafting" className="text-xs">
                  <Hammer className="w-4 h-4 mr-1" />
                  Craft
                </TabsTrigger>
                <TabsTrigger value="building" className="text-xs">
                  <Shield className="w-4 h-4 mr-1" />
                  Build
                </TabsTrigger>
                <TabsTrigger value="stats" className="text-xs">
                  <Clock className="w-4 h-4 mr-1" />
                  Stats
                </TabsTrigger>
              </TabsList>
              
              <div className="px-4 pb-4 h-full overflow-y-auto">
                <TabsContent value="inventory" className="mt-0">
                  <InventoryPanel player={player} />
                </TabsContent>
                
                <TabsContent value="crafting" className="mt-0">
                  <CraftingPanel gameState={gameState} onGameStateChange={onGameStateChange} />
                </TabsContent>
                
                <TabsContent value="building" className="mt-0">
                  <BuildingPanel gameState={gameState} onGameStateChange={onGameStateChange} />
                </TabsContent>
                
                <TabsContent value="stats" className="mt-0">
                  <StatsPanel player={player} gameState={gameState} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};