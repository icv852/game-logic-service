import { Effect, pipe } from "effect";
import type { GameLogicError } from "../../utils/errors.js";
import { Validation, Transition } from "./functions.js";
import type { GameState, Move } from "./schemas.js";

export const applyMove = (data: { move: Move, state: GameState }): Effect.Effect<GameState, GameLogicError> => {
    const { move, state } = data
    return pipe(
        Effect.succeed(state),
        Effect.flatMap(Validation.failIfInvalidMove(move)),
        Effect.map(Transition.occupyPosition(move)),
        Effect.map(Transition.assignWinnerIfExist),
        Effect.map(Transition.swapCurrentPlayerIfInProgress),
    )
}