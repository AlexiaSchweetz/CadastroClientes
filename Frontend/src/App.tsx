import { useState } from 'react'
import './App.css'

function App() {
  const [page, setPage] = useState("login")
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cpf: "",
    dataNas: "",
    tel: ""
  })
  const [erro, setErro] = useState("")
  const [usuarioLogado, setUsuarioLogado] = useState<{
    nome: string,
    email: string,
    telefone: string,
    cpf: number,
    dataNascimento: Date
  } | null>(null)
  const [viewData, setViewData] = useState(false)

  const handleChange = (e: { target: { name: string, value: any } }) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    if (name === "senha" || name === "confirmarSenha") {
      if (form.senha && form.confirmarSenha && (name === "senha" ? value !== form.confirmarSenha : value !== form.senha)) {
        setErro("As senhas não conferem")
      } else {
        setErro("")
      }
    }
  }

  const CpfChange = (e: { target: { value: string } }) => {
    let value = e.target.value.replace(/\D/g, '')

    if (value.length > 11) value = value.slice(0, 11)

    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

    setForm(prev => ({ ...prev, cpf: value }))
  }

  const TelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1)$2-$3');
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{0,5})/, '($1)$2');
    }

    setForm(prev => ({ ...prev, tel: value }));
  };

  const LoginSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5030/api/Clientes/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, senha: form.senha })
      })
      if (!response.ok) throw new Error("Erro no login")
      const data = await response.json()
      console.log("Usuário logado:", data)
      setUsuarioLogado(data)
      setPage("logado")
    } catch (err) {
      console.error(err)
    }
  }

  const CadastroSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5030/api/Clientes/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          cpf: form.cpf.replace(/\D/g, ""),
          dataNascimento: form.dataNas,
          telefone: form.tel
        })
      })
      if (!response.ok) throw new Error("Erro no cadastro")
      const data = await response.json()
      console.log("Usuário cadastrado:", data)
      setUsuarioLogado(data)
      setPage("logado")
    } catch (err) {
      setErro("Erro ao cadastrar, tente novamente.")
    }
  }

  const formatarData = (data: string | Date) => {
    const d = typeof data === "string" ? new Date(data) : data
    return d.toLocaleDateString("pt-BR")
  }

  const calcularIdade = (data: string | Date) => {
    const nascimento = typeof data === "string" ? new Date(data) : data
    const hoje = new Date()
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const mes = hoje.getMonth() - nascimento.getMonth()
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) idade--
    return idade
  }

  const sair = () => {
    setForm({
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      cpf: "",
      dataNas: "",
      tel: ""
    })

    setUsuarioLogado(null)

    setPage("login")
  }

  return (
    <div className='body'>
      {page === "login" && (
        <>
          <h2 className="title">Login</h2>
          <form onSubmit={LoginSubmit}>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Digite seu email" />
            <input type="password" name="senha" value={form.senha} onChange={handleChange} placeholder="Digite sua senha" />
            <button type="submit">Entrar</button>
          </form>
          <a href="#" onClick={() => setPage("cadastro")}>É novo aqui? Cadastre-se!</a>
        </>
      )}

      {page === "cadastro" && (
        <>
          <h2 className="title">Cadastro</h2>
          <form onSubmit={CadastroSubmit}>
            <input type='text' name="nome" value={form.nome} onChange={handleChange} placeholder='Digite seu nome' />
            <input type='email' name="email" value={form.email} onChange={handleChange} placeholder='Digite seu email' />
            <input type='text' name="cpf" value={form.cpf} onChange={CpfChange} placeholder='Digite seu CPF' />
            <input type='date' name="dataNas" value={form.dataNas} onChange={handleChange} placeholder='Selecione sua data de nascimento' />
            <input type='tel' name="tel" value={form.tel} onChange={TelChange} placeholder='Digite seu telefone' />
            <input type='password' name="senha" value={form.senha} onChange={handleChange} placeholder='Digite sua senha' />
            <input type='password' name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange} placeholder='Confirme sua senha' />

            {erro && <p style={{ color: "red" }}>{erro}</p>}

            <button type="submit" disabled={!!erro || !form.senha || !form.confirmarSenha}>Cadastrar</button>
            <a href="#" onClick={() => setPage("login")}>Já tem cadastro? Faça login agora!</a>
          </form>
        </>
      )}

      {page === "logado" && (
        <>
          <div className='profile'>
            <div className='nav'>
              <h2 className="title">Olá, {usuarioLogado?.nome}</h2>
              <button onClick={sair}>Sair</button>
            </div>
            <div className='data'>
              <h3>Dados:</h3>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setViewData(!viewData)
                }}
                className='view'
              >
                {viewData ? "Esconder" : "Mostrar"}
              </a>
            </div>
            <p>Email: {viewData ? usuarioLogado?.email : "**********"}</p>
            <p>CPF: {viewData ? usuarioLogado?.cpf : "**********"}</p>
            <p>Telefone: {viewData ? usuarioLogado?.telefone : "**********"}</p>
            <p>Data de Nascimento: {viewData && usuarioLogado?.dataNascimento ? formatarData(usuarioLogado?.dataNascimento) : "**********"}</p>
            <p>Idade: {viewData && usuarioLogado?.dataNascimento ? calcularIdade(usuarioLogado?.dataNascimento) + " anos" : "**********"}</p>
          </div>
        </>
      )}
    </div>
  )
}

export default App
