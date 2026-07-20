import {
  InitialGameData,
  GameState,
  Turn,
  PlayedCard,
  PlayerId,
  PlayerQuit,
  HandState,
  NotificationInfo,
  CutInfo,
  TimeoutRes,
  EffectInfo,
  EmptyResponse,
} from "@shared/types";
import { SocketCallback } from "@/types";

export interface GameClientEvents {
  "game:getData": (callback: SocketCallback<InitialGameData>) => void;

  "game:playCard": (
    playerCard: PlayedCard,
    callback: SocketCallback<EmptyResponse>,
  ) => void;

  "game:drawCard": (callback: SocketCallback<EmptyResponse>) => void;

  "game:endTurn": (callback: SocketCallback<EmptyResponse>) => void;

  "game:endStack": (callback: SocketCallback<EmptyResponse>) => void;

  "game:unoCall": (callback: SocketCallback<NotificationInfo>) => void;

  "game:cutCall": (
    playerId: PlayerId,
    callback: SocketCallback<NotificationInfo>,
  ) => void;

  "game:leave": (callback: SocketCallback<EmptyResponse>) => void;
}

export interface GameServerEvents {
  "game:currentData": (newData: GameState) => void;

  "game:hand": (newData: HandState) => void;

  "game:newTurn": (newData: Turn) => void;

  "game:timeout": (newData: TimeoutRes) => void;

  "game:unoCalled": (data: NotificationInfo) => void;

  "game:gotCut": (data: CutInfo) => void;

  "game:playerQuit": (data: PlayerQuit) => void;

  "game:effect": (data: EffectInfo) => void;
}
