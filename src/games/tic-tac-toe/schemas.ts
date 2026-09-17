import { Schema } from "effect"

export const Player = Schema.Literals(["X", "O"])
export type Player = Schema.Schema.Type<typeof Player>

export const Position = Schema.Literals([0, 1, 2, 3, 4, 5, 6, 7, 8])
export type Position = Schema.Schema.Type<typeof Position>

const Cell = Schema.OptionFromNullOr(Player)

export const Board = Schema.Tuple([Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell])
export type Board = Schema.Schema.Type<typeof Board>

const InProgressContext = Schema.Struct({
    status: Schema.Literal("in-progress"),
    currentPlayer: Player,
})

const WinContext = Schema.Struct({
    status: Schema.Literal("win"),
    winner: Player,
})

const DrawContext = Schema.Struct({
    status: Schema.Literal("draw"),
})

export const Context = Schema.Union([InProgressContext, WinContext, DrawContext])
export type Context = Schema.Schema.Type<typeof Context>

export const Move = Schema.Struct({
    position: Position,
    player: Player,
})
export type Move = Schema.Schema.Type<typeof Move>

export const GameState = Schema.Struct({
    board: Board,
    context: Context,
})
export type GameState = Schema.Schema.Type<typeof GameState>







