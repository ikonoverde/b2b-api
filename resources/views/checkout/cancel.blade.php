<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Pago cancelado - {{ config('app.name') }}</title>
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
            text-align: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .icon {
            width: 64px;
            height: 64px;
            background-color: #dc2626;
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
        }
        p {
            font-size: 1rem;
            color: #57534e;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </div>
        <h1>Pago cancelado</h1>
        <p>Vuelve a la app para intentar de nuevo.</p>
    </div>
</body>
</html>
