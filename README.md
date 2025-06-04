# 🧠 Wumpus World Solver (8-Directional FOL Agent)

A smart agent for the Wumpus World Simulator by @thiagodnf – extended with first-order logic-based reasoning, 8-directional inference, and a complete knowledge-based decision-making engine.

    🔍 Enhanced to infer, visualize, and suggest safe moves while navigating the Wumpus World!

🚀 Features

    ✅ Based on First-Order Logic (FOL) rules
    🧭 Supports 8-directional adjacency reasoning
    🕳️ Deduces pit locations via breeze patterns
    🐍 Confirms Wumpus position via overlapping stenches
    💰 Automatically collects gold
    🎯 Shoots the Wumpus only when its position is confirmed
    📚 Displays dynamic Knowledge Base
    🤖 Suggests safe or risky next moves



![image](https://github.com/user-attachments/assets/7417ef21-04db-425e-ba6d-dca711990bcc)

![image](https://github.com/user-attachments/assets/4cd0fedc-5d2d-4823-956f-cdb9a6fb516e) ![image](https://github.com/user-attachments/assets/2b342204-72b8-4463-86ae-d03b047a7795)

    

🔄 How It Works
1. Perception-Based Learning

The agent updates its knowledge base every turn using game perceptions:

* breeze → possible pit around
* stench → possible Wumpus around
* glitter → gold at current location

2. FOL-Based Inference

    If there's no breeze, all adjacent (8-directional) cells are safe from pits
    If there's no stench, all neighbors are safe from Wumpus
    If a cell is surrounded by breeze/stench positions, possible pit/Wumpus is inferred
    Multiple stench sources overlapping on one cell ⇒ Wumpus confirmed

3. Intelligent Movement

The solver:

+ Moves to safe, unvisited positions
+ Grabs gold if found
+ Shoots confirmed Wumpus
+ As a last resort, risks least-uncertain cells

📦 Getting Started

Clone the project:

```
    git clone github.com/mohammad-ghaderi/wampus-game
```
```
    Run index.html file in the browser or simulation environment
```

📜 Credits

- Original Wumpus Simulator by @thiagodnf
- Enhanced Solver by Mohammad Ghaderi – 2025

🪪 License

This project uses the original simulator’s license. Enhancements are shared under MIT.
Editing wampus-game/README.md at main · mohammad-ghaderi/wampus-game
