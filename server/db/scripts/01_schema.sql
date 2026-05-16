CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    elo INTEGER DEFAULT 1000,

    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(50) NOT NULL,

    element VARCHAR(20) NOT NULL CHECK (
        element IN ('fire', 'water', 'snow')
    ),

    power INTEGER NOT NULL CHECK (
        power >= 1 AND power <= 12
    ),

    color VARCHAR(20) NOT NULL,

    image_url TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    status VARCHAR(20) NOT NULL DEFAULT 'waiting' CHECK (
        status IN ('waiting', 'playing', 'finished')
    ),

    winner_user_id UUID REFERENCES users(id),

    started_at TIMESTAMP,
    finished_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE game_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),

    player_order INTEGER NOT NULL,

    connected BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(game_id, user_id)
);

CREATE TABLE rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,

    round_number INTEGER NOT NULL,

    winner_user_id UUID REFERENCES users(id),

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE round_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    round_id UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,

    user_id UUID NOT NULL REFERENCES users(id),

    card_id UUID NOT NULL REFERENCES cards(id),

    created_at TIMESTAMP DEFAULT NOW()
);