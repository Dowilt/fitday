CREATE TABLE IF NOT EXISTS exercises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    emoji VARCHAR(10) NOT NULL DEFAULT '⭐',
    sets INTEGER NOT NULL DEFAULT 3,
    reps INTEGER NOT NULL DEFAULT 10,
    calories INTEGER NOT NULL DEFAULT 30,
    is_done BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS history (
    id SERIAL PRIMARY KEY,
    date VARCHAR(10) NOT NULL,
    exercises_count INTEGER NOT NULL DEFAULT 0,
    total_calories INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    calorie_goal INTEGER NOT NULL DEFAULT 300,
    notifications BOOLEAN NOT NULL DEFAULT true,
    sound BOOLEAN NOT NULL DEFAULT false,
    vibration BOOLEAN NOT NULL DEFAULT true
);

-- Seed exercises
INSERT INTO exercises (name, emoji, sets, reps, calories) VALUES
    ('Отжимания', '💪', 3, 15, 50),
    ('Приседания', '🧎', 4, 20, 70),
    ('Планка', '🧘', 3, 1, 40),
    ('Бёрпи', '🔥', 3, 10, 90),
    ('Скручивания', '🏋', 3, 20, 45),
    ('Выпады', '🏃', 3, 12, 60);

-- Seed settings
INSERT INTO settings (id, calorie_goal, notifications, sound, vibration)
VALUES (1, 300, true, false, true)
ON CONFLICT (id) DO NOTHING;
