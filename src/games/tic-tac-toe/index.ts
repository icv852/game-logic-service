import { Effect, pipe } from "effect";
import type { GameLogicError } from "../../utils/errors.js";
import { Validation, Transition } from "./functions.js";
import type { GameState, InProgressGameState, Move } from "./types.js";

export const applyMove = (move: Move) => (state: InProgressGameState): Effect.Effect<GameState, GameLogicError> => {
    return pipe(
        Effect.succeed(state),
        Effect.flatMap(Validation.failIfInvalidMove(move)),
        Effect.map(Transition.occupyPosition(move)),
        Effect.map(Transition.assignWinnerIfExist),
        Effect.map(Transition.swapCurrentPlayerIfInProgress),
    )
}