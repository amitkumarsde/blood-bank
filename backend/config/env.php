<?php

// env.php — Reads the .env file into $_ENV. //


function load_env(string $path): void
{
    // If there is no .env file, just skip — env() will use its defaults.
    if (!is_file($path)) {
        return;
    }

    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);

        if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
    }
}


function env(string $key, string $default = ''): string
{
    // Real environment variables (e.g. set in the Render dashboard) come first.
    $value = getenv($key);
    if ($value !== false) {
        return $value;
    }

    // Fall back to values loaded from the local .env file.
    return $_ENV[$key] ?? $default;
}