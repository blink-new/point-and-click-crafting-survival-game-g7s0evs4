# 🏕️ Survivor's Haven: Point-and-Click Crafting Survival Game

A comprehensive point-and-click survival game where players explore environments, gather resources, craft tools and materials, build and upgrade shelters, and defend their base against dynamic threats.

## 🎮 Game Features

### Core Gameplay
- **Point-and-Click Exploration** - Interactive environment with clickable objects
- **Resource Gathering** - Collect wood, stone, food, and rare materials
- **Multi-Tier Crafting System** - Tools → Materials → Structures progression
- **Base Building** - Drag-and-drop construction with grid placement
- **Survival Mechanics** - Health, hunger, and energy management

### Advanced Systems
- **Dynamic Threats** - Wildlife attacks and environmental hazards
- **Day/Night Cycle** - Affects gameplay mechanics and visibility
- **Progressive Shelters** - Upgrade from tent → cabin → fortress
- **Defense Systems** - Build walls, traps, and defensive structures
- **Inventory Management** - Organized storage with capacity limits

## 🛠️ Technical Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom survival theme
- **UI Components**: Radix UI + ShadCN
- **Animations**: Framer Motion
- **State Management**: React Hooks + Context
- **Backend**: Blink SDK (Auth, Database, Storage)

## 🎨 Design System

### Color Palette
- **Primary**: `#8B4513` (Saddle Brown) - Natural, earthy survival aesthetic
- **Accent**: `#FF6B35` (Orange Red) - Fire, energy, alerts, and action
- **Background**: `#2C1810` (Dark Brown) - Immersive woodland atmosphere
- **Dark Mode**: `#1A0F08` (Very Dark Brown) - Deep forest ambiance

### Typography
- **Primary Font**: Inter - Clean, readable interface text
- **Weight Variations**: Regular (400) and Medium (500)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd survivors-haven

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint and Stylelint
npm run lint:js      # Run JavaScript/TypeScript linting
npm run lint:css     # Run CSS linting
```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # ShadCN UI components
│   ├── game/            # Game-specific components
│   └── layout/          # Layout components
├── features/            # Feature-based modules
│   ├── inventory/       # Inventory management
│   ├── crafting/        # Crafting system
│   ├── building/        # Base building
│   └── combat/          # Defense and combat
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── types/               # TypeScript type definitions
└── assets/              # Static assets
```

## 🎯 Game Systems

### Resource Management
- **Wood**: Basic building material from trees
- **Stone**: Durable construction material from rocks
- **Food**: Sustenance from foraging and hunting
- **Metal**: Advanced crafting material from mining
- **Rare Materials**: Special items for high-tier crafting

### Crafting Progression
1. **Basic Tools** - Axe, pickaxe, hunting spear
2. **Advanced Materials** - Refined wood, cut stone, metal ingots
3. **Structures** - Walls, roofs, doors, windows
4. **Defense Systems** - Traps, barriers, watchtowers

### Threat System
- **Wildlife** - Bears, wolves, hostile creatures
- **Environmental** - Storms, cold, natural disasters
- **Resource Scarcity** - Seasonal changes affecting availability

## 🔧 Configuration

### Environment Variables
The game uses Blink SDK for backend services. No additional environment setup required for basic functionality.

### Customization
- Modify `tailwind.config.cjs` for styling changes
- Update `src/lib/gameConfig.ts` for gameplay balance
- Adjust `src/types/` for extending game mechanics

## 📱 Responsive Design

The game is optimized for:
- **Desktop**: Full-featured gameplay experience
- **Tablet**: Touch-optimized interface
- **Mobile**: Simplified UI with essential features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎮 Gameplay Tips

- **Start Small**: Build a basic shelter before exploring far
- **Resource Priority**: Wood and stone are essential early game
- **Day Planning**: Gather during day, craft and build at night
- **Defense First**: Establish perimeter before expanding
- **Tool Progression**: Better tools = faster resource gathering

## 🐛 Known Issues

- Performance optimization needed for large bases
- Mobile touch controls need refinement
- Save system implementation in progress

## 🔮 Roadmap

- [ ] Multiplayer cooperative mode
- [ ] Advanced weather system
- [ ] Seasonal resource changes
- [ ] Achievement system
- [ ] Mod support framework

---

Built with ❤️ using [Blink](https://blink.new) - The AI Full-Stack Engineer