@php
    $serif = "Georgia, 'Times New Roman', serif";
    $sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    $mono = "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";
@endphp
<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Restablece tu contraseña</title>
    <style>
        body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table { border-collapse: collapse; }
        img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
        a { color: #006871; }
        .num { font-variant-numeric: tabular-nums; }
        @media only screen and (max-width: 620px) {
            .container { width: 100% !important; }
            .pad { padding-left: 24px !important; padding-right: 24px !important; }
        }
    </style>
</head>
<body style="margin:0; padding:0; background-color:#dce7e8;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; font-size:1px; line-height:1px; color:#dce7e8;">
        Restablece la contraseña de tu cuenta. El enlace vence en {{ $expiresInMinutes }} minutos.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#dce7e8;">
        <tr>
            <td align="center" style="padding:32px 16px;">
                <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:#ebf6f7; border:1px solid #dce7e8;">
                    <tr>
                        <td class="pad" style="padding:28px 40px 24px 40px; border-bottom:1px solid #dce7e8;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="font-family:{{ $sans }}; font-size:18px; font-weight:600; letter-spacing:-0.01em; color:#0f1d1e;">
                                        Ikono<span style="color:#1a9d11;">verde</span>
                                    </td>
                                    <td align="right" style="font-family:{{ $sans }}; font-size:11px; font-weight:500; letter-spacing:0.06em; color:#586767; text-transform:uppercase;">
                                        Seguridad de la cuenta
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="pad" style="padding:40px 40px 8px 40px;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td valign="middle" style="width:40px; height:40px; background-color:#006871; border-radius:20px; text-align:center; font-family:{{ $mono }}; font-size:15px; letter-spacing:0.12em; line-height:40px; color:#f3fafa;">
                                        &#9679;&#9679;&#9679;
                                    </td>
                                    <td valign="middle" style="padding-left:16px; font-family:{{ $sans }}; font-size:12px; font-weight:500; letter-spacing:0.06em; color:#006871; text-transform:uppercase;">
                                        Restablecer contraseña
                                    </td>
                                </tr>
                            </table>
                            <h1 style="margin:24px 0 0 0; font-family:{{ $serif }}; font-size:34px; line-height:1.1; font-weight:400; letter-spacing:-0.01em; color:#0f1d1e;">
                                Restablece tu contraseña
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td class="pad" style="padding:16px 40px 8px 40px; font-family:{{ $sans }}; font-size:15px; line-height:1.55; color:#3a4a4b;">
                            Hola {{ $user->name }}. Recibimos una solicitud para restablecer la contraseña de tu cuenta.
                        </td>
                    </tr>
                    <tr>
                        <td class="pad" style="padding:24px 40px 8px 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4fafa; border:1px solid #dce7e8;">
                                <tr>
                                    <td style="padding:18px 20px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:{{ $sans }}; font-size:13px;">
                                            <tr>
                                                <td style="padding:6px 0; color:#586767;">Cuenta</td>
                                                <td align="right" style="padding:6px 0; font-family:{{ $mono }}; font-size:13px; color:#0f1d1e;">{{ $user->email }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0; color:#586767; border-top:1px solid #e4eeef;">El enlace vence en</td>
                                                <td align="right" class="num" style="padding:6px 0; font-family:{{ $mono }}; font-size:13px; color:#0f1d1e; border-top:1px solid #e4eeef;">{{ $expiresInMinutes }} minutos</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="pad" style="padding:32px 40px 8px 40px;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" bgcolor="#006871" style="background-color:#006871;">
                                        <a href="{{ $resetUrl }}" target="_blank" style="display:inline-block; padding:13px 32px; font-family:{{ $sans }}; font-size:14px; font-weight:600; letter-spacing:0.01em; color:#f3fafa; text-decoration:none;">
                                            Restablecer contraseña
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="pad" style="padding:20px 40px 0 40px; font-family:{{ $sans }}; font-size:14px; line-height:1.55; color:#3a4a4b;">
                            Si no solicitaste este cambio, ignora este correo. Tu contraseña actual seguirá funcionando.
                        </td>
                    </tr>
                    <tr>
                        <td class="pad" style="padding:28px 40px 0 40px; font-family:{{ $sans }}; font-size:11px; font-weight:500; letter-spacing:0.06em; color:#586767; text-transform:uppercase;">
                            ¿Problemas con el botón?
                        </td>
                    </tr>
                    <tr>
                        <td class="pad" style="padding:10px 40px 0 40px; font-family:{{ $sans }}; font-size:12px; line-height:1.55; color:#586767;">
                            Copia y pega esta dirección en tu navegador:<br>
                            <a href="{{ $resetUrl }}" target="_blank" style="font-family:{{ $mono }}; font-size:12px; color:#006871; text-decoration:underline; word-break:break-all;">{{ $resetUrl }}</a>
                        </td>
                    </tr>
                    <tr>
                        <td class="pad" style="padding:36px 40px 32px 40px; border-top:1px solid #dce7e8;">
                            <div style="font-family:{{ $sans }}; font-size:13px; line-height:1.55; color:#586767;">
                                Gracias,<br>
                                <span style="color:#0f1d1e; font-weight:600;">Ikono<span style="color:#1a9d11;">verde</span></span>
                            </div>
                            <div style="margin-top:14px; font-family:{{ $sans }}; font-size:11px; line-height:1.5; color:#8a9696;">
                                Si no reconoces esta solicitud, responde a este correo.
                            </div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
