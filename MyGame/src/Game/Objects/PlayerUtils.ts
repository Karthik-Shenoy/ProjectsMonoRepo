import { AnimationId } from "../Animation/AnimationConfig";

export enum PlayerState {
    Idle,
    Running,
    Jumping,
}

export enum PlayerDirection {
    L2R,
    R2L,
}

export const PlayerStateToAnimationMap: {
    [key in PlayerState]: AnimationId;
} = {
    [PlayerState.Idle]: AnimationId.PlayerIdle,
    [PlayerState.Jumping]: AnimationId.PlayerIdle,
    [PlayerState.Running]: AnimationId.PlayerRun,
};
