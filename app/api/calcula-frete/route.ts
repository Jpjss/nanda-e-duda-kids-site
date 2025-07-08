import { NextRequest, NextResponse } from "next/server"

// Get the API token from environment variables
const MELHOR_ENVIO_TOKEN = process.env.MELHOR_ENVIO_TOKEN

export async function POST(req: NextRequest) {
  // Check if API token is configured
  if (!MELHOR_ENVIO_TOKEN) {
    console.error("MELHOR_ENVIO_TOKEN environment variable is not configured")
    return NextResponse.json({ 
      error: "Shipping calculation service is not configured. Please contact support." 
    }, { status: 500 })
  }

  const { cepDestino } = await req.json()

  if (!cepDestino || !/^\d{5}-?\d{3}$/.test(cepDestino)) {
    return NextResponse.json({ error: "CEP inválido" }, { status: 400 });
  }

  // Exemplo fixo de origem (substitua pelo seu CEP de origem real)
  const cepOrigem = "74063390"

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
    console.error("Erro ao interpretar resposta da API do Melhor Envio:", e)
    return NextResponse.json({ error: "Erro ao interpretar resposta da API do Melhor Envio." }, { status: 500 })
  }

  if (!response.ok) {
    console.error("Erro da API do Melhor Envio:", data)
    return NextResponse.json({ error: data?.message || JSON.stringify(data) || "Erro desconhecido na API do Melhor Envio." }, { status: response.status })
  }

  // Resposta defensiva para diferentes formatos da API
  if (Array.isArray(data) && data.length > 0 && data[0].services) {
    return NextResponse.json(data[0])
  } else if (data && data.services) {
    return NextResponse.json(data)
  } else {
    return NextResponse.json({ error: "Resposta inesperada da API do Melhor Envio." }, { status: 500 })
  }
}
