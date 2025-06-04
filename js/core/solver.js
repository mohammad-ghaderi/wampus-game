class WumpusSolver {
    constructor(gridHeight, gridWidth, totalGolds, player) {
        this.width = gridWidth;
        this.height = gridHeight;
        this.player = player;

        this.kb = new Set(); // knowledge base facts
        this.visited = new Set();
        this.safe = new Set();
        this.unsafe = new Set();
        this.possiblePit = new Set();
        this.possibleWumpus = new Set();
        this.confirmedWumpus = new Set();
        this.foundGolds = new Set();
        this.collectedGolds = new Set();
        this.totalGolds = totalGolds;

        // Initial safe and visited at (0,0)
        this.addFact(`safe(0,0)`);
        this.addFact(`visited(0,0)`);
        this.safe.add("0,0");
        this.visited.add("0,0");
    }

    addFact(fact) {
        this.kb.add(fact);
    }

    removeFact(fact) {
        this.kb.delete(fact);
    }

    infer() {
        // Clear sets that are to be recalculated each time
        this.possiblePit.clear();
        this.possibleWumpus.clear();

        console.log(this.kb)
        console.log(this.kb.size)

        // Process breeze and stench facts to update possible pit and wumpus locations
        for (let fact of this.kb) {
            const coords = fact.match(/\d+/g);
            if (!coords) continue;
            const [x, y] = coords.map(Number);

            if (fact.startsWith("breeze(")) {
                // Neighbors could have pit
                const adj = this.getAllAdjacent(x, y, true);
                for (let [nx, ny] of adj) {
                    const key = `${nx},${ny}`;
                    if (!this.safe.has(key) && !this.visited.has(key)) {
                        this.possiblePit.add(key);
                        this.unsafe.add(key);
                        this.addFact(`pit_possible(${nx},${ny})`);
                    }
                }
            }


            if (fact.startsWith("stench(")) {
                // Neighbors could have wumpus
                const adj = this.getAllAdjacent(x, y, true);
                for (let [nx, ny] of adj) {
                    const key = `${nx},${ny}`;
                    if (!this.safe.has(key) && !this.visited.has(key)) {
                        this.possibleWumpus.add(key);
                        this.unsafe.add(key);
                        this.addFact(`wumpus_possible(${nx},${ny})`);
                    }
                }
            }
        }

        // Remove from possiblePit and possibleWumpus any known safe places
        for (let s of this.safe) {
            this.possiblePit.delete(s);
            this.removeFact(`pit_possible(${s})`);
            this.possibleWumpus.delete(s);
            this.removeFact(`wumpus_possible(${s})`);
        }

        // Rule: If a place has no breeze and no stench, all its neighbors (8 directions) are safe
        for (let fact of this.kb) {
            if (fact.startsWith("safe(")) {
                const [x, y] = fact.match(/\d+/g).map(Number);
                if (!this.kb.has(`breeze(${x},${y})`) && !this.kb.has(`stench(${x},${y})`) && this.visited.has(`${x},${y}`)) {
                    const adj = this.getAllAdjacent(x, y, true);
                    for (let [nx, ny] of adj) {
                        const key = `${nx},${ny}`;
                        if (!this.safe.has(key)) {
                            this.safe.add(key);
                            this.addFact(`safe(${nx},${ny})`);
                        }
                        if (this.unsafe.has(key)) this.unsafe.delete(key);
                    }
                }
            }
        }

        // If a place is possibly pit, but any neighbor has no breeze -> it's NOT pit
        for (let pos of [...this.possiblePit]) {
            const [x, y] = pos.split(',').map(Number);
            const neighbors = this.getAllAdjacent(x, y, true);
            if (neighbors.some(([nx, ny]) => !this.kb.has(`breeze(${nx},${ny})`) && this.visited.has(`${nx},${ny}`))) {
                this.possiblePit.delete(pos);
                this.removeFact(`pit_possible(${x},${y})`);
            }
        }

        // Same for wumpus: possible wumpus eliminated if any neighbor has no stench
        for (let pos of [...this.possibleWumpus]) {
            const [x, y] = pos.split(',').map(Number);
            const neighbors = this.getAllAdjacent(x, y, true);
            if (neighbors.some(([nx, ny]) => !this.kb.has(`stench(${nx},${ny})`) && this.visited.has(`${nx},${ny}`))) {
                this.possibleWumpus.delete(pos);
                this.removeFact(`wumpus_possible(${x},${y})`);
            }
        }

        for (let pos of this.visited) {
            const [x, y] = pos.split(',').map(Number);
            if (!this.possiblePit.has(pos) && !this.possibleWumpus.has(pos) && !this.safe.has(pos)) {
                if (this.unsafe.has(pos)) this.unsafe.delete(pos);
                this.safe.add(pos);
                this.addFact(`safe(${x},${y})`);
            }
        }
    }

    getNextMove() {
        console.log('idk1')
        console.log(this.safe)
        this.infer();
        console.log('idk2')
        console.log(this.safe)
        console.log(this.visited)

        // Grab gold if known and not collected
        for (let key of this.foundGolds) {
            if (!this.collectedGolds.has(key)) {
                const [x, y] = key.split(',').map(Number);
                return { x, y, action: 'grab' };
            }
        }

        // Shoot confirmed wumpus
        for (let key of this.confirmedWumpus) {
            const [x, y] = key.split(',').map(Number);
            return { x, y, action: 'shoot' };
        }

        // Move to unvisited safe cell
        for (let key of this.safe) {
            if (!this.visited.has(key)) {
                console.log('key')
                console.log(key)
                const [x, y] = key.split(',').map(Number);
                return { x, y, action: 'move' };
            }
        }

        // If no guaranteed safe moves, risk a possible pit/wumpus cell
        const riskyMoves = [...this.possiblePit, ...this.possibleWumpus].filter(pos => !this.visited.has(pos));
        if (riskyMoves.length > 0) {
            console.log('fuck')
            const rand = riskyMoves[Math.floor(Math.random() * riskyMoves.length)];
            const [x, y] = rand.split(',').map(Number);
            return { x, y, action: 'move_risky' };
        }

        // No moves left - solved or stuck
        return null;
    }

    updatePerception(perceptions) {
        const y = this.player.getPosI();
        const x = this.player.getPosJ();
        const key = `${x},${y}`;
        this.visited.add(key);
        this.safe.add(key);
        this.addFact(`visited(${x},${y})`);
        this.addFact(`safe(${x},${y})`);

        if (perceptions.includes('glitter')) {
            this.addFact(`gold(${x},${y})`);
            this.foundGolds.add(`${x},${y}`);
        }
        if (perceptions.includes('breeze')) {
            this.addFact(`breeze(${x},${y})`);
        }
        if (perceptions.includes('stench')) {
            this.addFact(`stench(${x},${y})`);
        }
    }

    notifyGoldCollected(x, y) {
        this.collectedGolds.add(`${x},${y}`);
    }

    notifyWumpusKilled(x, y) {
        this.confirmedWumpus.delete(`${x},${y}`);
        this.possibleWumpus.delete(`${x},${y}`);
        this.unsafe.delete(`${x},${y}`);
        this.safe.add(`${x},${y}`);
        this.addFact(`wumpus_dead(${x},${y})`);
    }

    getAllAdjacent(x, y, includeDiagonals = false) {
        console.log('this.width, this.height')
        console.log(this.width, this.height)
        const deltas = includeDiagonals
            ? [
                [-1, 0], [1, 0], [0, -1], [0, 1],
                [-1, -1], [-1, 1], [1, -1], [1, 1]
            ]
            : [
                [-1, 0], [1, 0], [0, -1], [0, 1]
            ];
        return deltas
            .map(([dx, dy]) => [x + dx, y + dy])
            .filter(([nx, ny]) => nx >= 0 && nx < this.width && ny >= 0 && ny < this.height);
    }
}
