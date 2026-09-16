import { z } from "zod"
import { Option } from "effect"
import type { Board, Player } from "../games/tic-tac-toe/types.js"

const PlayerSchema = z.literal(["X", "O"])
const PositionSchema = z.literal([0, 1, 2, 3, 4, 5, 6, 7, 8])

// Clients send `null` for an empty cell; the game layer works with Option<Player>.
const CellSchema = PlayerSchema.nullable().transform(cell => cell === null ? Option.none<Player>() : Option.some(cell))

const BoardSchema = z.tuple([
    CellSchema, CellSchema, CellSchema,
    CellSchema, CellSchema, CellSchema,
    CellSchema, CellSchema, CellSchema,
]).transform(cells => cells as Board)

// `applyMove` only accepts a state that is still in progress, so reject finished games here.
const InProgressContextSchema = z.object({
    status: z.literal("in-progress"),
    currentPlayer: PlayerSchema,
})

export const ApplyMoveSchema = z.object({
    move: z.object({
        position: PositionSchema,
        player: PlayerSchema,
    }),
    state: z.object({
        board: BoardSchema,
        context: InProgressContextSchema,
    }),
})
