// WumpusSolver class with enhanced reasoning and gold tracking
class WumpusSolver {
    constructor(gridWidth, gridHeight, player, totalGolds) {
        this.width = gridWidth;
        this.height = gridHeight;
        this.kb = new Set();
        this.visited = new Set();
        this.safe = new Set();
        this.unsafe = new Set();
        this.frontier = new Set();
        this.possiblePit = new Set();
        this.possibleWumpus = new Set();
        this.foundGolds = new Set();
        this.totalGolds = totalGolds;
        this.player = player;

        this.addFact(`safe(0,0)`);
        this.addFact(`visited(0,0)`);
        this.safe.add("0,0");
        this.visited.add("0,0");
    }

    addFact(fact) {
        this.kb.add(fact);
    }

    getNextMove() {
        if (this.foundGolds.size >= this.totalGolds) return null;

        // Go to any unvisited gold
        for (let key of this.foundGolds) {
            if (!this.visited.has(key)) {
                const [x, y] = key.split(',').map(Number);
                return { x, y, action: 'grab' };
            }
        }

        // Go to safe unvisited cell
        for (let fact of this.safe) {
            if (!this.visited.has(fact)) {
                const [x, y] = fact.split(',').map(Number);
                return { x, y };
            }
        }

        // Choose least risky unvisited frontier cell (heuristic/random)
        const frontier = Array.from(this.possiblePit).filter(pos => !this.visited.has(pos) && !this.safe.has(pos));
        if (frontier.length > 0) {
            const rand = frontier[Math.floor(Math.random() * frontier.length)];
            const [x, y] = rand.split(',').map(Number);
            return { x, y, risk: true };
        }

        return null; // No known moves
    }
    updatePerception(perceptions) {
        const x = this.player.getPosI();
        const y = this.player.getPosJ();
        const key = `${x},${y}`;
        this.visited.add(key);
        this.safe.add(key);
        this.addFact(`visited(${x},${y})`);
        this.addFact(`safe(${x},${y})`);

        const adjacent = this.getAllAdjacent(x, y);

        if (perceptions.includes('glitter')) {
            this.addFact(`gold(${x},${y})`);
            this.foundGolds.add(`${x},${y}`);
        }

        if (perceptions.includes('breeze')) {
            this.addFact(`breeze(${x},${y})`);
            for (let [nx, ny] of adjacent) {
                const nk = `${nx},${ny}`;
                if (!this.safe.has(nk) && !this.visited.has(nk)) {
                    this.possiblePit.add(nk);
                    this.addFact(`pit_possible(${nx},${ny})`);
                    this.unsafe.add(nk);
                }
            }
        }

        if (perceptions.includes('stench')) {
            this.addFact(`stench(${x},${y})`);
            for (let [nx, ny] of adjacent) {
                const nk = `${nx},${ny}`;
                if (!this.safe.has(nk) && !this.visited.has(nk)) {
                    this.possibleWumpus.add(nk);
                    this.addFact(`wumpus_possible(${nx},${ny})`);
                    this.unsafe.add(nk);
                }
            }
        }

        // No breeze or stench: mark all adjacent safe
        if (!perceptions.includes('breeze') && !perceptions.includes('stench')) {
            for (let [nx, ny] of adjacent) {
                const nk = `${nx},${ny}`;
                if (!this.safe.has(nk)) {
                    this.safe.add(nk);
                    this.addFact(`safe(${nx},${ny})`);
                }
            }
        }
    }

    getAllAdjacent(x, y) {
        const deltas = [
            [-1, 0], [1, 0], [0, -1], [0, 1],
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ];
        const adjacent = [];
        for (let [dx, dy] of deltas) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < this.width && ny < this.height) {
                adjacent.push([nx, ny]);
            }
        }
        return adjacent;
    }
}