// Main game world component for Survivor's Haven

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { GameState, Position, WorldObject, Player } from '../../types/game';
import { GAME_CONFIG, WORLD_OBJECT_TEMPLATES } from '../../lib/gameConfig';
import { blink } from '../../blink/client';

interface GameWorldProps {
  gameState: GameState;
  onGameStateChange: (newState: GameState) => void;
}

export const GameWorld: React.FC<GameWorldProps> = ({ gameState, onGameStateChange }) => {
  const [cameraPosition, setCameraPosition] = useState<Position>({ x: 0, y: 0 });
  const [selectedObject, setSelectedObject] = useState<WorldObject | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initializeWorld = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Generate initial world objects
      const worldObjects: WorldObject[] = [];
      
      // Add trees
      for (let i = 0; i < 15; i++) {
        const tree: WorldObject = {
          id: `tree_${i}`,
          ...WORLD_OBJECT_TEMPLATES.oak_tree,
          position: {
            x: Math.floor(Math.random() * 18) + 1,
            y: Math.floor(Math.random() * 13) + 1,
          },
        };
        worldObjects.push(tree);
      }
      
      // Add stone deposits
      for (let i = 0; i < 8; i++) {
        const stone: WorldObject = {
          id: `stone_${i}`,
          ...WORLD_OBJECT_TEMPLATES.stone_deposit,
          position: {
            x: Math.floor(Math.random() * 19),
            y: Math.floor(Math.random() * 14),
          },
        };
        worldObjects.push(stone);
      }
      
      // Add berry bushes
      for (let i = 0; i < 10; i++) {
        const bush: WorldObject = {
          id: `bush_${i}`,
          ...WORLD_OBJECT_TEMPLATES.berry_bush,
          position: {
            x: Math.floor(Math.random() * 19),
            y: Math.floor(Math.random() * 14),
          },
        };
        worldObjects.push(bush);
      }
      
      // Add water sources
      for (let i = 0; i < 3; i++) {
        const water: WorldObject = {
          id: `water_${i}`,
          ...WORLD_OBJECT_TEMPLATES.water_spring,
          position: {
            x: Math.floor(Math.random() * 19),
            y: Math.floor(Math.random() * 14),
          },
        };
        worldObjects.push(water);
      }

      // Update game state with new world objects
      onGameStateChange({
        ...gameState,
        worldObjects,
      });

      // Save to database
      await blink.db.gameStates.create({
        id: `game_${gameState.player.id}`,
        userId: gameState.player.id,
        worldObjects: JSON.stringify(worldObjects),
        playerData: JSON.stringify(gameState.player),
        dayCount: gameState.dayCount,
        timeOfDay: gameState.timeOfDay,
        createdAt: new Date(),
      });

    } catch (error) {
      console.error('Failed to initialize world:', error);
    } finally {
      setIsLoading(false);
    }
  }, [gameState, onGameStateChange]);

  // Initialize world objects on first load
  useEffect(() => {
    if (gameState.worldObjects.length === 0) {
      initializeWorld();
    }
  }, [initializeWorld, gameState.worldObjects.length]);

  const handleObjectClick = useCallback(async (worldObject: WorldObject) => {
    if (isLoading) return;
    
    setSelectedObject(worldObject);
    
    // Check if object is harvestable and player has required tool
    if (!worldObject.harvestable) return;
    
    const requiredResource = worldObject.resources.find(r => r.requiredTool);
    const hasRequiredTool = !requiredResource?.requiredTool || 
      gameState.player.equippedTool?.type === requiredResource.requiredTool;
    
    if (!hasRequiredTool) {
      // Show notification about required tool
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate harvesting time
      await new Promise(resolve => setTimeout(resolve, GAME_CONFIG.BASE_HARVEST_TIME));
      
      // Calculate resources gained
      const resourcesGained: { type: string; quantity: number }[] = [];
      
      worldObject.resources.forEach(resourceDrop => {
        if (Math.random() <= resourceDrop.chance) {
          const quantity = Math.floor(
            Math.random() * (resourceDrop.quantity.max - resourceDrop.quantity.min + 1)
          ) + resourceDrop.quantity.min;
          
          resourcesGained.push({
            type: resourceDrop.resourceType,
            quantity,
          });
        }
      });
      
      // Update player inventory
      const updatedInventory = [...gameState.player.inventory];
      
      resourcesGained.forEach(({ type, quantity }) => {
        const existingResource = updatedInventory.find(r => r.type === type);
        if (existingResource) {
          existingResource.quantity += quantity;
        } else {
          // Add new resource (simplified - would need full resource definition)
          updatedInventory.push({
            id: `${type}_${Date.now()}`,
            type: type as any,
            name: type,
            description: '',
            icon: '📦',
            quantity,
            maxStack: 50,
            rarity: 'common',
          });
        }
      });
      
      // Damage the world object
      const updatedWorldObjects = gameState.worldObjects.map(obj => {
        if (obj.id === worldObject.id) {
          const newHealth = Math.max(0, obj.health - 10);
          return {
            ...obj,
            health: newHealth,
            lastHarvested: newHealth <= 0 ? Date.now() : obj.lastHarvested,
          };
        }
        return obj;
      });
      
      // Update game state
      const updatedGameState: GameState = {
        ...gameState,
        player: {
          ...gameState.player,
          inventory: updatedInventory,
          experience: gameState.player.experience + 5,
        },
        worldObjects: updatedWorldObjects,
      };
      
      onGameStateChange(updatedGameState);
      
      // Save progress
      await blink.db.gameStates.update(`game_${gameState.player.id}`, {
        worldObjects: JSON.stringify(updatedWorldObjects),
        playerData: JSON.stringify(updatedGameState.player),
      });
      
    } catch (error) {
      console.error('Failed to harvest resource:', error);
    } finally {
      setIsLoading(false);
      setSelectedObject(null);
    }
  }, [gameState, onGameStateChange, isLoading]);

  const handlePlayerMove = useCallback((newPosition: Position) => {
    const updatedPlayer: Player = {
      ...gameState.player,
      position: newPosition,
    };
    
    onGameStateChange({
      ...gameState,
      player: updatedPlayer,
    });
  }, [gameState, onGameStateChange]);

  // Calculate day/night lighting
  const isDaytime = gameState.timeOfDay >= GAME_CONFIG.NIGHT_END && 
                   gameState.timeOfDay < GAME_CONFIG.NIGHT_START;
  
  const lightingClass = isDaytime ? 'brightness-100' : 'brightness-75 contrast-125';

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-sky-200 to-green-200 dark:from-slate-800 dark:to-slate-900">
      {/* World Grid */}
      <div 
        className={`building-grid transition-all duration-1000 ${lightingClass}`}
        style={{
          transform: `translate(${-cameraPosition.x}px, ${-cameraPosition.y}px)`,
        }}
      >
        {/* Render world objects */}
        {gameState.worldObjects.map((worldObject) => (
          <motion.div
            key={worldObject.id}
            className={`absolute cursor-pointer select-none ${
              worldObject.health <= 0 ? 'opacity-30' : 'opacity-100'
            }`}
            style={{
              gridColumn: `${worldObject.position.x + 1} / span ${worldObject.size.width}`,
              gridRow: `${worldObject.position.y + 1} / span ${worldObject.size.height}`,
              fontSize: '2rem',
            }}
            onClick={() => handleObjectClick(worldObject)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: selectedObject?.id === worldObject.id ? 1.2 : 1,
            }}
          >
            <div className="flex items-center justify-center w-full h-full">
              {worldObject.icon}
            </div>
            
            {/* Health bar for damaged objects */}
            {worldObject.health < worldObject.maxHealth && worldObject.health > 0 && (
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-red-200 rounded">
                <div 
                  className="h-full bg-red-500 rounded transition-all duration-300"
                  style={{ 
                    width: `${(worldObject.health / worldObject.maxHealth) * 100}%` 
                  }}
                />
              </div>
            )}
          </motion.div>
        ))}
        
        {/* Render player */}
        <motion.div
          className="absolute cursor-pointer select-none z-10"
          style={{
            gridColumn: `${gameState.player.position.x + 1}`,
            gridRow: `${gameState.player.position.y + 1}`,
            fontSize: '2rem',
          }}
          animate={{
            gridColumn: `${gameState.player.position.x + 1}`,
            gridRow: `${gameState.player.position.y + 1}`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center justify-center w-full h-full">
            🧑‍🌾
          </div>
        </motion.div>
        
        {/* Render structures */}
        {gameState.structures.map((structure) => (
          <motion.div
            key={structure.id}
            className="absolute cursor-pointer select-none"
            style={{
              gridColumn: `${structure.position.x + 1} / span ${structure.size.width}`,
              gridRow: `${structure.position.y + 1} / span ${structure.size.height}`,
              fontSize: '2rem',
            }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center w-full h-full bg-primary/20 border border-primary rounded">
              {structure.icon}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-card p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm">Processing...</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Click instructions */}
      <div className="absolute top-4 left-4 bg-card/90 p-3 rounded-lg shadow-lg">
        <p className="text-sm text-muted-foreground">
          Click on objects to harvest resources
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Day {gameState.dayCount} • {Math.floor(gameState.timeOfDay)}:00
        </p>
      </div>
    </div>
  );
};