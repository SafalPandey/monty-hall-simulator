import { StrategyType } from "../types";

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

function getRemainingDoor(chosenDoor: number, revealedDoor: number) {
    return [0, 1, 2].filter(x => ![chosenDoor, revealedDoor].includes(x))[0]
}

function simulate(strategyType: StrategyType, maxIterations: number) {
    const results = {
        wins: 0,
        loss: 0,
        maxIterations,
    }

    for (let gameInstance = 1; gameInstance <= maxIterations; gameInstance++) {
        // Pick a random door index from the array
        let chosenDoor = Math.floor(Math.random() * DOOR_OPTIONS.length)

        const revealedDoor = getRevealedDoor(chosenDoor);

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
            results.wins = results.wins + 1;
        } else {
            results.loss = results.loss + 1;
        }
    }

    return results;
}


export default simulate;