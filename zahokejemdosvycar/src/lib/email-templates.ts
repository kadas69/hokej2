interface CodeEmailParams {
  firstName: string
  code: string
}

export function buildCodeEmailHtml({ firstName, code }: CodeEmailParams): string {
  return `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Váš soutěžní kód</title>
</head>
<body style="margin:0;padding:0;background-color:#E8ECF0;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#E8ECF0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#FFFFFF;border-radius:12px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#010D5D 0%,#D10A10 100%);padding:32px 24px;text-align:center;">
              <h1 style="margin:0;color:#FFFFFF;font-size:24px;font-weight:700;">
                Za hokejem do Švýcar! 🏒
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">
                Soutěž s CNN Prima NEWS
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 24px;">
              <p style="margin:0 0 16px;color:#1A1A2E;font-size:16px;line-height:1.5;">
                Ahoj <strong>${firstName}</strong>,
              </p>
              <p style="margin:0 0 8px;color:#1A1A2E;font-size:16px;line-height:1.5;">
                děkujeme za registraci do soutěže! Správně jsi odpověděl/a na soutěžní otázku
                a tady je tvůj jedinečný soutěžní kód:
              </p>
              <p style="margin:0 0 24px;color:#D10A10;font-size:14px;font-weight:600;line-height:1.5;">
                Tento kód je tvůj los do soutěže — uschovej si ho!
              </p>

              <!-- Code box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:24px;background-color:#F3F4F6;border-radius:8px;border:2px dashed #010D5D;">
                    <span style="font-size:32px;font-weight:800;letter-spacing:4px;color:#010D5D;">
                      ${code}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Prize overview -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr>
                  <td style="padding:20px;background-color:#FFFBEB;border-radius:8px;border-left:4px solid #FFD700;">
                    <p style="margin:0 0 12px;color:#1A1A2E;font-size:15px;font-weight:700;">
                      Co můžeš vyhrát?
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0;color:#1A1A2E;font-size:14px;line-height:1.6;">
                          🏆 Zájezd na MS v hokeji do Švýcarska
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;color:#1A1A2E;font-size:14px;line-height:1.6;">
                          🎬 Prima+ voucher na 1 měsíc zdarma
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;color:#1A1A2E;font-size:14px;line-height:1.6;">
                          🛒 Kaufland poukázka 500 Kč
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;color:#1A1A2E;font-size:14px;line-height:1.6;">
                          🧢 Hokejový merch balíček
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Next steps -->
              <p style="margin:24px 0 16px;color:#1A1A2E;font-size:16px;line-height:1.5;">
                <strong>Co dál?</strong>
              </p>
              <p style="margin:0 0 24px;color:#6B7280;font-size:15px;line-height:1.6;">
                Přejdi na naši stránku, zadej svůj kód a vyber si sedadlo v letadle.
                Výhru zjistíš po ukončení soutěže — držíme palce!
              </p>

              <!-- CTA button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://zahokejemdosvycar.cz/letadlo"
                       style="display:inline-block;padding:14px 32px;background-color:#D10A10;color:#FFFFFF;font-size:16px;font-weight:600;text-decoration:none;border-radius:8px;">
                      Vybrat si sedadlo ✈️
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 24px;background-color:#F9FAFB;border-top:1px solid #E5E7EB;text-align:center;">
              <p style="margin:0;color:#9CA3AF;font-size:12px;line-height:1.5;">
                Tento e-mail byl odeslán automaticky v rámci soutěže „Za hokejem do Švýcar" pořádané CNN Prima NEWS.
                <br />
                <a href="https://zahokejemdosvycar.cz/pravidla" style="color:#6B7280;text-decoration:underline;">Pravidla soutěže</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function buildCodeEmailSubject(): string {
  return 'Tvůj soutěžní kód – Za hokejem do Švýcar! 🏒'
}
