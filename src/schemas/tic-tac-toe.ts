import { z } from "zod"
import { Option } from "effect"
import type { Player } from "../games/tic-tac-toe/types.js"

const PlayerSchema = z.literal(["X", "O"])
const PositionSchema = z.literal([0, 1, 2, 3, 4, 5, 6, 7, 8])

// Clients send `null` for an empty cell; the game layer works with Option<Player>.
// A codec keeps both directions of that conversion in one place.
const CellCodec = z.codec(
    PlayerSchema.nullable(),
    z.custom<Option.Option<Player>>(Option.isOption),
    {
        decode: cell => cell === null ? Option.none<Player>() : Option.some(cell),
        encode: cell => Option.isSome(cell) ? cell.value : null,
    }
)

const BoardSchema = z.tuple([
    CellCodec, CellCodec, CellCodec,
    CellCodec, CellCodec, CellCodec,
    CellCodec, CellCodec, CellCodec,
])

// `applyMove` only accepts a state that is still in progress, so reject finished games here.
const InProgressContextSchema = z.object({
    status: z.literal("in-progress"),
    currentPlayer: PlayerSchema,
})

const ContextSchema = z.discriminatedUnion("status", [
    InProgressContextSchema,
    z.object({ status: z.literal("win"), winner: PlayerSchema }),
    z.object({ status: z.literal("draw") }),
])

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

// Response side of the same codec, so a returned state can be fed back in as the next move.
export const GameStateSchema = z.object({
    board: BoardSchema,
    context: ContextSchema,
})
