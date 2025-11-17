import React, { useEffect, useState } from 'react'
import './Dashboard.css'

const Dashboard = () => {

  const [planilha, setPlanilha] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await fetch('http://localhost:3000/dashboard/formulario-masculino')
        const results = await response.json()

        if (results.status === 'success') {
          setPlanilha(results.data)
        } else {
          setError(results.data)
        }
      } catch (error) {
        setError(`Erro de conexão ao servidor ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [])

  if (isLoading) {
    return <div>Carregando os dados...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div>${planilha}</div>
  )
}

export default Dashboard