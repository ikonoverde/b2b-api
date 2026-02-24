<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Restablecer contrasena - {{ config('app.name') }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f5f5f4;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 1rem;
        }
        .card {
            background: #fff;
            border-radius: 1rem;
            padding: 2.5rem 2rem;
            max-width: 400px;
            width: 100%;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .icon {
            width: 64px;
            height: 64px;
            background-color: #5E7052;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
        }
        .icon svg { width: 32px; height: 32px; color: #fff; }
        h1 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1c1917;
            margin-bottom: 0.5rem;
            text-align: center;
        }
        .subtitle {
            font-size: 0.875rem;
            color: #57534e;
            line-height: 1.5;
            text-align: center;
            margin-bottom: 1.5rem;
        }
        label {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            color: #1c1917;
            margin-bottom: 0.375rem;
        }
        input[type="email"],
        input[type="password"] {
            width: 100%;
            padding: 0.625rem 0.75rem;
            border: 1px solid #d6d3d1;
            border-radius: 0.5rem;
            font-size: 1rem;
            color: #1c1917;
            background: #fff;
            outline: none;
            transition: border-color 0.15s;
        }
        input[type="email"]:focus,
        input[type="password"]:focus {
            border-color: #5E7052;
            box-shadow: 0 0 0 2px rgba(94, 112, 82, 0.15);
        }
        .field { margin-bottom: 1rem; }
        .error-text {
            color: #dc2626;
            font-size: 0.8125rem;
            margin-top: 0.25rem;
        }
        .error-box {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 0.5rem;
            padding: 0.75rem 1rem;
            margin-bottom: 1rem;
        }
        .error-box p {
            color: #dc2626;
            font-size: 0.8125rem;
        }
        button {
            width: 100%;
            padding: 0.75rem;
            background-color: #5E7052;
            color: #fff;
            border: none;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 0.5rem;
            transition: background-color 0.15s;
        }
        button:hover { background-color: #4d5d43; }
        button:active { background-color: #3d4a35; }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
        </div>
        <h1>Restablecer contrasena</h1>
        <p class="subtitle">Ingresa tu nueva contrasena para continuar.</p>

        @if ($errors->any())
            <div class="error-box">
                @foreach ($errors->all() as $error)
                    <p>{{ $error }}</p>
                @endforeach
            </div>
        @endif

        <form method="POST" action="{{ route('password.update') }}">
            @csrf
            <input type="hidden" name="token" value="{{ $token }}">

            <div class="field">
                <label for="email">Correo electronico</label>
                <input type="email" id="email" name="email" value="{{ old('email', request('email')) }}" required autofocus>
                @error('email')
                    <p class="error-text">{{ $message }}</p>
                @enderror
            </div>

            <div class="field">
                <label for="password">Nueva contrasena</label>
                <input type="password" id="password" name="password" required minlength="8">
                @error('password')
                    <p class="error-text">{{ $message }}</p>
                @enderror
            </div>

            <div class="field">
                <label for="password_confirmation">Confirmar contrasena</label>
                <input type="password" id="password_confirmation" name="password_confirmation" required minlength="8">
            </div>

            <button type="submit">Restablecer contrasena</button>
        </form>
    </div>
</body>
</html>
