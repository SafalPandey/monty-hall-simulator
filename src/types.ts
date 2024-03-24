export type StrategyType = "switch" | "don't switch";
export type ResultType = {
    wins: number;
    loss: number;
    maxIterations: number;
    iterationLog: Map<number, number>;
};