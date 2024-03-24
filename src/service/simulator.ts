import { ResultType, StrategyType } from "../types";

const DOOR_OPTIONS = ["gold", "goat", "goat"];

function getRandomElement(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRevealedDoor(chosenIndex: number) {
    if (chosenIndex === 0) {
        return 1; // reveal the first goat if "gold" is picked
    }

    // Reveal the other "goat" if any goat is chosen.
    // this works because there are only 3 choices
    return 3 - chosenIndex
}

function getRevealedDoorRandomly(chosenIndex: number) {
    // Reveal a door randomly from non chosen doors
    return getRandomElement(Array.from(DOOR_OPTIONS.keys()).filter(x => chosenIndex !== x))
}

function getRemainingDoor(chosenDoor: number, revealedDoor: number) {
    const indexesToExclude = [chosenDoor, revealedDoor];

    return Array.from(DOOR_OPTIONS.keys()).filter(x => !indexesToExclude.includes(x))[0]
}

function simulate(options: { strategyType: StrategyType, maxIterations: number, randomizeRevealedDoor?: boolean }) {
    const { strategyType, maxIterations, randomizeRevealedDoor } = options
    const results: ResultType = {
        wins: 0,
        loss: 0,
        maxIterations,
        iterationLog: new Map()
    }

    for (let gameInstance = 1; gameInstance <= maxIterations; gameInstance++) {
        // Pick a random door index from the array
        let chosenDoor = Math.floor(Math.random() * DOOR_OPTIONS.length)

        const revealedDoor = randomizeRevealedDoor ? getRevealedDoorRandomly(chosenDoor) : getRevealedDoor(chosenDoor);

        switch (strategyType) {
            case "switch":
                {
                    // If the strategy is to switch, we replace the chosenDoor with the 
                    // remainingDoor (neither chosen nor revealed)
                    chosenDoor = getRemainingDoor(chosenDoor, revealedDoor)

                    break;
                }

            case "don't switch": {
                break;
            }
        }

        const choice = DOOR_OPTIONS[chosenDoor];

        if (choice === "gold") {
            results.wins += 1;
        } else {
            results.loss += 1;
        }
        results.iterationLog.set(gameInstance, (results.wins / gameInstance) * 100)
    }

    return results;
}


export default simulate;