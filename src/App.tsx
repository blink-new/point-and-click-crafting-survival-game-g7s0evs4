// Main App component for Survivor's Haven

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GameWorld } from './components/game/GameWorld';
import { GameUI } from './components/game/GameUI';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Loader2, Play, Settings } from 'lucide-react';
import { blink } from './blink/client';
import type { GameState, Player, UIPanel } from './types/game';
import { GAME_CONFIG, STARTING_RESOURCES } from './lib/gameConfig';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [activePanel, setActivePanel] = useState<UIPanel>('inventory');
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize authentication
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user);
      setLoading(state.isLoading);
    });
    return unsubscribe;
  }, []);

  // Helper function to create starting inventory
  const createStartingInventory = useCallback(() => {
    return STARTING_RESOURCES.map((resource, index) => ({
      id: `start_${resource.type}_${index}`,
      type: resource.type!,
      name: resource.type!,
      description: '',
      icon: '📦',
      quantity: resource.quantity!,
      maxStack: 50,
      rarity: 'common' as const,
    }));
  }, []);

  const loadGameState = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to load existing game state
      const existingGame = await blink.db.gameStates.list({
        where: { userId: user.id },
        limit: 1,
      });

      if (existingGame.length > 0) {
        const savedGame = existingGame[0];
        const worldObjects = JSON.parse(savedGame.worldObjects || '[]');
        const playerData = JSON.parse(savedGame.playerData || '{}');

        setGameState({
          player: {
            id: user.id,
            name: user.email?.split('@')[0] || 'Survivor',
            level: playerData.level || 1,
            experience: playerData.experience || 0,
            stats: {
              health: playerData.stats?.health || GAME_CONFIG.PLAYER_MAX_HEALTH,
              maxHealth: GAME_CONFIG.PLAYER_MAX_HEALTH,
              hunger: playerData.stats?.hunger || GAME_CONFIG.PLAYER_MAX_HUNGER,
              maxHunger: GAME_CONFIG.PLAYER_MAX_HUNGER,
              energy: playerData.stats?.energy || GAME_CONFIG.PLAYER_MAX_ENERGY,
              maxEnergy: GAME_CONFIG.PLAYER_MAX_ENERGY,
              warmth: playerData.stats?.warmth || GAME_CONFIG.PLAYER_MAX_WARMTH,
              maxWarmth: GAME_CONFIG.PLAYER_MAX_WARMTH,
            },
            position: playerData.position || { x: 10, y: 7 },
            inventory: playerData.inventory || createStartingInventory(),
            maxInventorySlots: GAME_CONFIG.PLAYER_STARTING_INVENTORY_SLOTS,
          },
          worldObjects,
          structures: [],
          threats: [],
          timeOfDay: savedGame.timeOfDay || 8, // Start at 8 AM
          dayCount: savedGame.dayCount || 1,
          season: 'spring',
          weather: {
            type: 'clear',
            intensity: 0,
            duration: 0,
            effects: [],
          },
          gameMode: 'survival',
          difficulty: 'normal',
        });
      } else {
        // Create new game state
        const newGameState: GameState = {
          player: {
            id: user.id,
            name: user.email?.split('@')[0] || 'Survivor',
            level: 1,
            experience: 0,
            stats: {
              health: GAME_CONFIG.PLAYER_MAX_HEALTH,
              maxHealth: GAME_CONFIG.PLAYER_MAX_HEALTH,
              hunger: GAME_CONFIG.PLAYER_MAX_HUNGER,
              maxHunger: GAME_CONFIG.PLAYER_MAX_HUNGER,
              energy: GAME_CONFIG.PLAYER_MAX_ENERGY,
              maxEnergy: GAME_CONFIG.PLAYER_MAX_ENERGY,
              warmth: GAME_CONFIG.PLAYER_MAX_WARMTH,
              maxWarmth: GAME_CONFIG.PLAYER_MAX_WARMTH,
            },
            position: { x: 10, y: 7 }, // Center of the world
            inventory: createStartingInventory(),
            maxInventorySlots: GAME_CONFIG.PLAYER_STARTING_INVENTORY_SLOTS,
          },
          worldObjects: [], // Will be populated by GameWorld component
          structures: [],
          threats: [],
          timeOfDay: 8, // Start at 8 AM
          dayCount: 1,
          season: 'spring',
          weather: {
            type: 'clear',
            intensity: 0,
            duration: 0,
            effects: [],
          },
          gameMode: 'survival',
          difficulty: 'normal',
        };

        setGameState(newGameState);
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
    } finally {
      setLoading(false);
    }
  }, [user, createStartingInventory]);

  // Load or create game state when user is authenticated
  useEffect(() => {
    if (user && !gameState) {
      loadGameState();
    }
  }, [user, gameState, loadGameState]);

  // Game time progression
  useEffect(() => {
    if (!gameState || !gameStarted) return;

    const interval = setInterval(() => {
      setGameState(prevState => {
        if (!prevState) return prevState;

        const timeIncrement = 24 / (GAME_CONFIG.DAY_DURATION / 1000); // Time per second
        let newTimeOfDay = prevState.timeOfDay + timeIncrement;
        let newDayCount = prevState.dayCount;

        // Handle day transition
        if (newTimeOfDay >= 24) {
          newTimeOfDay = 0;
          newDayCount += 1;
        }

        return {
          ...prevState,
          timeOfDay: newTimeOfDay,
          dayCount: newDayCount,
        };
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [gameState, gameStarted]);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleGameStateChange = (newState: GameState) => {
    setGameState(newState);
  };

  // Loading screen
  if (loading) {
    return (
      <div className="game-container flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Loading Survivor's Haven</h2>
            <p className="text-muted-foreground">Preparing your survival adventure...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authentication required
  if (!user) {
    return (
      <div className="game-container flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">🏕️ Survivor's Haven</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Please sign in to start your survival adventure
            </p>
            <Button onClick={() => blink.auth.login()}>
              Sign In to Play
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Game start screen
  if (!gameStarted && gameState) {
    return (
      <div className="game-container flex items-center justify-center bg-gradient-to-b from-sky-200 to-green-200 dark:from-slate-800 dark:to-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="w-96 bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <div className="text-6xl mb-4">🏕️</div>
                <CardTitle className="text-2xl mb-2">Survivor's Haven</CardTitle>
                <p className="text-muted-foreground">
                  Point-and-Click Crafting Survival Game
                </p>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm">
                  Welcome, <strong>{gameState.player.name}</strong>!
                </p>
                <p className="text-xs text-muted-foreground">
                  Explore • Gather • Craft • Build • Survive
                </p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleStartGame} 
                  className="w-full" 
                  size="lg"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Adventure
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {/* TODO: Settings */}}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                <p>Day {gameState.dayCount} • Level {gameState.player.level}</p>
                <p>Click objects to interact • Use panels to manage resources</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Main game
  if (!gameState) {
    return (
      <div className="game-container flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Failed to load game state</p>
            <Button onClick={loadGameState} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="game-container relative">
      {/* Game World */}
      <GameWorld 
        gameState={gameState} 
        onGameStateChange={handleGameStateChange}
      />
      
      {/* Game UI */}
      <GameUI 
        gameState={gameState}
        activePanel={activePanel}
        onPanelChange={setActivePanel}
        onGameStateChange={handleGameStateChange}
      />
    </div>
  );
}

export default App;