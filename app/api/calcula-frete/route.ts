import { NextRequest, NextResponse } from "next/server"

// Nunca exponha o token no frontend!
const MELHOR_ENVIO_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNTVkMmIzZGRhMDA3MDU3NDRjODY3MTg2YWU0YzkzYjAwNzNjMmE5NTAwYzA2YTk4YzZkODBhZGM5Njc2M2Y0YjBmMDRkMDJiZGYwYTQ2NmUiLCJpYXQiOjE3NTAwMzk4NjIuODMyODg5LCJuYmYiOjE3NTAwMzk4NjIuODMyODkxLCJleHAiOjE3ODE1NzU4NjIuODIwOTQsInN1YiI6IjlmMmExNmEzLTRlMzItNGJhZi1iN2ZmLTFjMzVhMzM3ZmEyMCIsInNjb3BlcyI6WyJjYXJ0LXJlYWQiLCJjYXJ0LXdyaXRlIiwiY29tcGFuaWVzLXJlYWQiLCJjb21wYW5pZXMtd3JpdGUiLCJjb3Vwb25zLXJlYWQiLCJjb3Vwb25zLXdyaXRlIiwibm90aWZpY2F0aW9ucy1yZWFkIiwib3JkZXJzLXJlYWQiLCJwcm9kdWN0cy1yZWFkIiwicHJvZHVjdHMtZGVzdHJveSIsInByb2R1Y3RzLXdyaXRlIiwicHVyY2hhc2VzLXJlYWQiLCJzaGlwcGluZy1jYWxjdWxhdGUiLCJzaGlwcGluZy1jYW5jZWwiLCJzaGlwcGluZy1jaGVja291dCIsInNoaXBwaW5nLWNvbXBhbmllcyIsInNoaXBwaW5nLWdlbmVyYXRlIiwic2hpcHBpbmctcHJldmlldyIsInNoaXBwaW5nLXByaW50Iiwic2hpcHBpbmctc2hhcmUiLCJzaGlwcGluZy10cmFja2luZyIsImVjb21tZXJjZS1zaGlwcGluZyIsInRyYW5zYWN0aW9ucy1yZWFkIiwidXNlcnMtcmVhZCIsInVzZXJzLXdyaXRlIiwid2ViaG9va3MtcmVhZCIsIndlYmhvb2tzLXdyaXRlIiwid2ViaG9va3MtZGVsZXRlIiwidGRlYWxlci13ZWJob29rIl19.FmUDTsumwi94o15zRSbZTwE_WRBUCoBXZw6n7SZZFG6HyOp-FsAymBfSGt58PnponVz-Lc5z7fmNEQevVQl204KEmJqD2LZTSfQ3HeAhQ5cqWpfrYRXRuUdV5wFBoEe4R3vnPBvxSkGLIAR2NShdg2zZkI0SKEVnipPUtNHhUzfgwzRzvL9mLZbHzHXbDQ_N6bY4LpNXqe89-O8ouZNGoHs1VASd3FcVsRvlBZYLG3ALqH-kW_gvALbApf6rtr54ittNveN3vHkiYYOaOY2TLy8L53xk6V3vIJUZx6KJ59ZLWnPkawCJwnWCOWN188DCD0t76QiQHqG7ydJ-4EIYGfy64UIW0c69aSMovmNrE9iaggDvEMScdzAqiaZTw7mS8LVqf0AhM2P9Hz6YB2CvQZ3J1tTGOiCzHcyOqSobinQ_RM_eW84EFY4skBpQV3oOeETxxjVglF1HaKCMZnCsmqKczEsrfqjOvDDwydgNTzeS6osbxTbC-AZmy-znOgrXVzFzJqZAzsJY5FeGjwITx3VvdmB4aabUhIbovvAkrPH-0JiNkQzzktMCXjH__kvg2M8a245XyeIAlGvhtuddTBZqLb3ChvNGsT0N2w4KtOLosqI__GNzq1NyD_EvcM-JERzdl4TfIUohwaumjtaacThfBMQoXphqi831MY2eZ6c"

export async function POST(req: NextRequest) {
  const { cepDestino } = await req.json()

  // Exemplo fixo de origem (substitua pelo seu CEP de origem real)
  const cepOrigem = "01001-000"

  // Exemplo fixo de pacote (ajuste conforme seus produtos)
  const payload = {
    from: { postal_code: cepOrigem },
    to: { postal_code: cepDestino },
    products: [
      {
        id: "1",
        width: 20,
        height: 5,
        length: 25,
        weight: 0.4,
        insurance_value: 100,
        quantity: 1,
      },
    ],
    options: { receipt: false, own_hand: false, collect: false },
    services: [], // vazio = todos os serviços disponíveis
  }

  const response = await fetch("https://api.melhorenvio.com.br/v2/me/shipment/calculate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MELHOR_ENVIO_TOKEN}`,
      Accept: "application/json",
    },
    body: JSON.stringify([payload]),
  })

  let data
  try {
    data = await response.json()
  } catch (e) {
    return NextResponse.json({ error: "Erro ao interpretar resposta da API do Melhor Envio." }, { status: 500 })
  }

  if (!response.ok) {
    return NextResponse.json({ error: data?.message || "Erro desconhecido na API do Melhor Envio." }, { status: response.status })
  }

  return NextResponse.json(data)
}
