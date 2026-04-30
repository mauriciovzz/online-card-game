import {
  InitialGameData,
  GameState,
  Turn,
  PlayerHand,
  PlayedCard,
  PlayerId,
  PlayerQuitProps,
} from "@shared/types";
import { SocketCallback } from "@/types";

export interface GameEvents {
  "game:getData": (
    callback: SocketCallback<InitialGameData>
  ) => void;

  "game:playCard": (
    playerCard: PlayedCard,
    callback: SocketCallback<PlayerHand>
  ) => void;

  "game:drawCard": (
    callback: SocketCallback<PlayerHand>
  ) => void;

  "game:endTurn": (callback: SocketCallback<null>) => void;

  "game:unoCall": (callback: SocketCallback<null>) => void;

  "game:cutCall": (
    playerId: PlayerId,
    callback: SocketCallback<null>
  ) => void;

  "game:leave": (callback: SocketCallback<null>) => void;
}

export interface GameResponses {
  "game:currentData": (newData: GameState) => void;

  "game:hand": (newData: PlayerHand) => void;

  "game:turn": (newData: Turn) => void;

  "game:timeout": (newData: PlayerId) => void;

  "game:playerQuit": (data: PlayerQuitProps) => void;

  "game:won": (newData: PlayerId) => void;
}
