@php
    $serif = "Georgia, 'Times New Roman', serif";
    $sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    $mono = "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";

    $products = $sampleRequest->products_interested ?? [];

    $rows = array_filter([
        'Negocio' => $sampleRequest->business_name,
        'Contacto' => $sampleRequest->contact_name,
        'Correo' => $sampleRequest->email,
        'Teléfono' => $sampleRequest->phone,
        'Tipo de negocio' => $sampleRequest->business_type,
        'Volumen' => $sampleRequest->client_volume,
        'Perfil social' => $sampleRequest->social_url,
    ]);
@endphp
<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Nueva solicitud de muestras gratis</title>
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
        {{ $sampleRequest->business_name }} solicitó muestras gratis desde la campaña de Mérida.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#dce7e8;">
        <tr>
            <td align="center" style="padding:32px 16px;">
                <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:#ebf6f7; border:1px solid #dce7e8;">

                    {{-- Header / wordmark --}}
                    <tr>
                        <td class="pad" style="padding:28px 40px 24px 40px; border-bottom:1px solid #dce7e8;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="font-family:{{ $sans }}; font-size:18px; font-weight:600; letter-spacing:-0.01em; color:#0f1d1e;">
                                        Ikono<span style="color:#1a9d11;">verde</span>
                                    </td>
                                    <td align="right" style="font-family:{{ $sans }}; font-size:11px; font-weight:500; letter-spacing:0.06em; color:#586767; text-transform:uppercase;">
                                        Panel de administración
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Hero --}}
                    <tr>
                        <td class="pad" style="padding:40px 40px 8px 40px;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td valign="middle" style="width:40px; height:40px; background-color:#006871; border-radius:20px; text-align:center; font-family:{{ $sans }}; font-size:22px; line-height:40px; color:#f3fafa;">
                                        &#9679;
                                    </td>
                                    <td valign="middle" style="padding-left:16px; font-family:{{ $sans }}; font-size:12px; font-weight:500; letter-spacing:0.06em; color:#006871; text-transform:uppercase;">
                                        Campaña de Mérida
                                    </td>
                                </tr>
                            </table>
                            <h1 style="margin:24px 0 0 0; font-family:{{ $serif }}; font-size:34px; line-height:1.1; font-weight:400; letter-spacing:-0.01em; color:#0f1d1e;">
                                Nueva solicitud de muestras
                            </h1>
                        </td>
                    </tr>

                    {{-- Intro copy --}}
                    <tr>
                        <td class="pad" style="padding:16px 40px 8px 40px; font-family:{{ $sans }}; font-size:15px; line-height:1.55; color:#3a4a4b;">
                            Un negocio solicitó muestras gratis desde la campaña de Mérida.
                        </td>
                    </tr>

                    {{-- Business details --}}
                    <tr>
                        <td class="pad" style="padding:24px 40px 8px 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4fafa; border:1px solid #dce7e8;">
                                <tr>
                                    <td style="padding:18px 20px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:{{ $sans }}; font-size:13px;">
                                            @foreach($rows as $label => $value)
                                            <tr>
                                                <td style="padding:6px 0; color:#586767; {{ $loop->first ? '' : 'border-top:1px solid #e4eeef;' }}">{{ $label }}</td>
                                                <td align="right" style="padding:6px 0; font-family:{{ $sans }}; font-size:13px; color:#0f1d1e; {{ $loop->first ? '' : 'border-top:1px solid #e4eeef;' }}">{{ $value }}</td>
                                            </tr>
                                            @endforeach
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Products of interest --}}
                    @if($products !== [])
                    <tr>
                        <td class="pad" style="padding:28px 40px 0 40px; font-family:{{ $sans }}; font-size:11px; font-weight:500; letter-spacing:0.06em; color:#586767; text-transform:uppercase;">
                            Productos de interés
                        </td>
                    </tr>
                    <tr>
                        <td class="pad" style="padding:12px 40px 0 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                @foreach($products as $product)
                                <tr>
                                    <td style="padding:10px 0; font-family:{{ $sans }}; font-size:14px; color:#0f1d1e; border-bottom:1px solid #e4eeef;">{{ $product }}</td>
                                </tr>
                                @endforeach
                            </table>
                        </td>
                    </tr>
                    @endif

                    {{-- Linked account --}}
                    @if($sampleRequest->user)
                    <tr>
                        <td class="pad" style="padding:28px 40px 0 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="font-family:{{ $sans }}; font-size:13px; color:#586767;">Usuario asociado</td>
                                    <td align="right" style="font-family:{{ $sans }}; font-size:13px; font-weight:500; color:#0f1d1e;">{{ $sampleRequest->user->name }} &lt;{{ $sampleRequest->user->email }}&gt;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    @endif

                    {{-- CTA --}}
                    <tr>
                        <td class="pad" style="padding:32px 40px 8px 40px;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" bgcolor="#006871" style="background-color:#006871;">
                                        <a href="{{ $adminUrl }}" target="_blank" style="display:inline-block; padding:13px 32px; font-family:{{ $sans }}; font-size:14px; font-weight:600; letter-spacing:0.01em; color:#f3fafa; text-decoration:none;">
                                            Ver solicitudes
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td class="pad" style="padding:36px 40px 32px 40px; border-top:1px solid #dce7e8;">
                            <div style="font-family:{{ $sans }}; font-size:13px; line-height:1.55; color:#586767;">
                                Gracias,<br>
                                <span style="color:#0f1d1e; font-weight:600;">Ikono<span style="color:#1a9d11;">verde</span></span>
                            </div>
                            <div style="margin-top:14px; font-family:{{ $sans }}; font-size:11px; line-height:1.5; color:#8a9696;">
                                Notificación interna del panel de administración.
                            </div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
