import { Option, Equal, Effect, pipe } from "effect"
import { type Board, type Player, type Position, type Context, type Move, type GameState } from "./schemas.js"
import { WINNING_PATTERNS } from "./constants.js"
import { GameLogicError } from "../../utils/errors.js"
import { mapTuple } from "../../utils/helpers.js"

const Predicate = {
    isOccupied: (position: Position) => (board: Board): boolean => Option.isSome(board[position]),
    isFull: (board: Board): boolean => Object.values(board).every(Option.isSome),
    isMyTurn: (player: Player) => (context: Context): boolean => context.status === "in-progress" && context.currentPlayer === player,
}

const Query = {
    winner: (board: Board): Option.Option<Player> => {
        for (const pattern of WINNING_PATTERNS) {
            if (Option.isSome(board[pattern[0]])
                && Equal.equals(board[pattern[1]], board[pattern[0]])
                && Equal.equals(board[pattern[2]], board[pattern[0]]))
            {
                const winner = board[pattern[0]]
                return winner
            }
        }
        return Option.none()
    },
}

export const Validation = {
    failIfInvalidMove: (move: Move) => (state: GameState): Effect.Effect<GameState, GameLogicError> => pipe(
        Effect.succeed(state),
        Effect.filterOrFail(state => Predicate.isMyTurn(move.player)(state.context), () => new GameLogicError({ message: `Not player ${move.player}'s turn.` })),
        Effect.filterOrFail(state => !Predicate.isOccupied(move.position)(state.board), () => new GameLogicError({ message: `Position ${move.position} has been occupied.` })),
    )
}

export const Transition = {
    assignWinnerIfExist: (state: GameState): GameState => {
        const winner = Query.winner(state.board)
        if (Option.isSome(winner)) return ({ ...state, context: { status: "win", winner: Option.getOrThrow(winner) } })
        if (Predicate.isFull(state.board)) return ({ ...state, context: { status: "draw" } })
        return state
    },
    swapCurrentPlayerIfInProgress: (state: GameState): GameState => state.context.status === "in-progress" ? ({ ...state, context: { ...state.context, currentPlayer: state.context.currentPlayer === "X" ? "O" : "X" } }) : state,
    occupyPosition: (move: Move) => (state: GameState): GameState => ({
        ...state,
        board: mapTuple(state.board, (cell, index) =>
            index === move.position ? Option.some(move.player) : cell
        )
    })
}