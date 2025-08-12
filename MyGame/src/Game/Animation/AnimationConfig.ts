import type { Coordinates, Dimensions } from "../Contracts/RendererContracts";

export enum AnimationId {
    // Player animations
    PlayerIdle = "PlayerIdle",
    PlayerRun = "PlayerRun",
    // PlayerJump = "PlayerJump",
    // PlayerFall = "PlayerFall",
    // PlayerAttack = "PlayerAttack",

    // Meteor Animations
    Meteor = "Meteor",
    MeteorExplosion = "MeteorExplosion",

    // // Environment animations
    // FireBurning = "FireBurning",
    // WaterFlowing = "WaterFlowing",

    // // Miscellaneous animations
    // Explosion = "Explosion",
    // Sparkle = "Sparkle",
}

export type Indices = {
    row: number;
    col: number;
};

export type AnimationConfig = {
    startIndices: Indices;
    endIndices: Indices;
    frameDims: Dimensions;
    imgSrc: string;
    durationMs: number;
    repeatInfinite: boolean; // Optional, defaults to false
};

export const AnimationConfigs: {
    [key in AnimationId]: AnimationConfig;
} = {
    [AnimationId.PlayerRun]: {
        startIndices: { row: 0, col: 0 },
        endIndices: {
            row: 0,
            col: 2,
        },
        frameDims: {
            w: 450,
            h: 760,
        },
        durationMs: 200,
        repeatInfinite: true,
        imgSrc: "/Public/sprites/PlayerSprite.png",
    },
    [AnimationId.PlayerIdle]: {
        startIndices: { row: 0, col: 3 },
        endIndices: {
            row: 0,
            col: 3,
        },
        frameDims: {
            w: 450,
            h: 760,
        },
        durationMs: 16,
        repeatInfinite: false,
        imgSrc: "/Public/sprites/PlayerSprite.png",
    },
    [AnimationId.Meteor]: {
        startIndices: { row: 0, col: 0 },
        endIndices: {
            row: 0,
            col: 0,
        },
        frameDims: {
            w: 273,
            h: 239,
        },
        durationMs: 16,
        repeatInfinite: false,
        imgSrc: "/Public/sprites/meteor.png",
    },
    [AnimationId.MeteorExplosion]: {
        startIndices: { row: 0, col: 0 },
        endIndices: {
            row: 0,
            col: 15,
        },
        frameDims: {
            w: 84,
            h: 85,
        },
        durationMs: 33,
        repeatInfinite: false,
         // This is a one-time animation, so it won't repeat
         // after the explosion is done.
         // The explosion will be removed from the game state.
        imgSrc: "/Public/sprites/Explosion.png",
    }
};

export enum TileId {
    Ground = "Ground",
}

export type TileConfig = {
    coords: Coordinates;
    dims: Dimensions;
    imgSrc: string;
};

export const TilesConfigs: {
    [key in TileId]: TileConfig;
} = {
    [TileId.Ground]: {
        coords: { x: 355, y: 415 },
        dims: { w: 60, h: 32 },
        imgSrc: "/Public/sprites/Tiles.png",
    },
};

export enum AssetIds {
    Background = "Background",
}

export const AssetUrls: {
    [key in AssetIds]: string;
} = {
    [AssetIds.Background]: "/Public/sprites/background.jpg",
};
