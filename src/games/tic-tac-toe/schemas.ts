import { Schema } from "effect"

export const PlayerSchema = Schema.Literals(["X", "O"])
export type Player = Schema.Schema.Type<typeof PlayerSchema>

export const PositionSchema = Schema.Literals([0, 1, 2, 3, 4, 5, 6, 7, 8])
export type Position = Schema.Schema.Type<typeof PositionSchema>

const CellSchema = Schema.OptionFromNullOr(PlayerSchema)

export const BoardSchema = Schema.Tuple([CellSchema, CellSchema, CellSchema, CellSchema, CellSchema, CellSchema, CellSchema, CellSchema, CellSchema])
export type Board = Schema.Schema.Type<typeof BoardSchema>

const InProgressContextSchema = Schema.Struct({
    status: Schema.Literal("in-progress"),
    currentPlayer: PlayerSchema,
})

const WinContextSchema = Schema.Struct({
    status: Schema.Literal("win"),
    winner: PlayerSchema,
})

const DrawContextSchema = Schema.Struct({
    status: Schema.Literal("draw"),
})

export const ContextSchema = Schema.Union([InProgressContextSchema, WinContextSchema, DrawContextSchema])
export type Context = Schema.Schema.Type<typeof ContextSchema>

export const MoveSchema = Schema.Struct({
    position: PositionSchema,
    player: PlayerSchema,
})
export type Move = Schema.Schema.Type<typeof MoveSchema>

export const GameStateSchema = Schema.Struct({
    board: BoardSchema,
    context: ContextSchema,
})
export type GameState = Schema.Schema.Type<typeof GameStateSchema>

export const ApplyMoveSchema = Schema.Struct({
    move: MoveSchema,
    state: GameStateSchema,
})
export type ApplyMove = Schema.Schema.Type<typeof ApplyMoveSchema>







