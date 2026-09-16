import type { Option } from "effect";

export interface GameState {
    board: Board
    context: Context
}

export interface Move {
  position: Position
  player: Player
}

export interface InProgressGameState extends GameState {
    context: InProgressContext
}

export type Player = "X" | "O"

export type Position = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type Board = [Option.Option<Player>, Option.Option<Player>, Option.Option<Player>, Option.Option<Player>, Option.Option<Player>, Option.Option<Player>, Option.Option<Player>, Option.Option<Player>, Option.Option<Player>]
export type Context = { status: "in-progress", currentPlayer: Player } | { status: "win", winner: Player } | { status: "draw" }

type InProgressContext = Extract<Context, { status: "in-progress" } >