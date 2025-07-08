"use client"

import { useState } from "react"

interface FreteService {
  id: string
  name: string
  price: string
  delivery_time: number
}

interface FreteResult {
  services: FreteService[]
}

export default function FreteCalculator() {
  const [cep, setCep] = useState("")
  const [result, setResult] = useState<FreteResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const res = await fetch("/api/calcula-frete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cepDestino: cep }),
      })
      const data = await res.json()
      if (data?.error) {
        setError("Erro: " + data.error)
      } else if (Array.isArray(data) && data[0]?.error) {
        setError("Erro ao calcular frete: " + data[0].error.message)
      } else {
        setResult(data[0])
      }
    } catch {
      setError("Erro ao consultar o frete.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow p-6 mt-8">
      <h3 className="text-xl font-bold mb-4 text-purple-700">Calcule o Frete</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Digite seu CEP"
          value={cep}
          onChange={e => setCep(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
          required
          pattern="\d{5}-?\d{3}"
        />
        <button
          type="submit"
          className="bg-purple-500 text-white rounded px-4 py-2 hover:bg-purple-600 transition"
          disabled={loading}
        >
          {loading ? "Calculando..." : "Calcular Frete"}
        </button>
      </form>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {result && result.services && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Opções de frete:</h4>
          <ul className="space-y-2">
            {result.services.map((service: FreteService) => (
              <li key={service.id} className="border rounded p-2">
                <div className="font-bold text-purple-700">{service.name}</div>
                <div>Preço: <span className="text-pink-800 font-semibold">R$ {Number(service.price).toFixed(2)}</span></div>
                <div>Prazo: {service.delivery_time} dias úteis</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
