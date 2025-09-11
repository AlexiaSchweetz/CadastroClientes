import { useState, useRef, useEffect } from "react";
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
    id: number,
    nome: string,
    email: string,
    telefone: string,
    cpf: number,
    dataNascimento: Date
  } | null>(null)
  const [viewData, setViewData] = useState(false)
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const validarCpf = (cpf: string) => {
    const numeros = cpf.replace(/\D/g, "");

    if (numeros.length !== 11) return false;
    if (/^(\d)\1+$/.test(numeros)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(numeros[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== parseInt(numeros[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(numeros[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== parseInt(numeros[10])) return false;

    return true;
  };

  const formatarCpf = (cpf: string | number | undefined) => {
    if (!cpf) return "";
    let c = cpf.toString().replace(/\D/g, "");
    if (c.length !== 11) return c;
    return c.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  const formatarData = (data: string | Date) => {
    const d = typeof data === "string" ? new Date(data) : data
    return d.toLocaleDateString("pt-BR")
  }

  const formatarDataInput = (data: string | Date) => {
    const d = typeof data === "string" ? new Date(data) : data;
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`; // formato YYYY-MM-DD
  };

  const calcularIdade = (data: string | Date) => {
    const nascimento = typeof data === "string" ? new Date(data) : data
    const hoje = new Date()
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const mes = hoje.getMonth() - nascimento.getMonth()
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) idade--
    return idade
  }

  const atualizarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioLogado) return;

    try {
      const body = {
        nome: form.nome || usuarioLogado.nome,
        email: form.email || usuarioLogado.email,
        telefone: form.tel || usuarioLogado.telefone,
        dataNascimento: form.dataNas ? new Date(form.dataNas).toISOString() : null
      };

      const response = await fetch(`http://localhost:5030/api/Clientes/${usuarioLogado.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error("Erro ao atualizar");

      const data = await response.json();
      setUsuarioLogado(prev => ({
        ...prev!,
        nome: data.nome || prev!.nome,
        email: data.email || prev!.email,
        telefone: data.telefone || prev!.telefone,
        dataNascimento: data.dataNascimento ? new Date(data.dataNascimento) : prev!.dataNascimento
      }));
      setPage("logado");
      console.log("Cliente atualizado:", data);
    } catch (err) {
      console.error(err);
    }
  };


  const atualizarSenha = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuarioLogado) return;

    try {
      const response = await fetch(`http://localhost:5030/api/Clientes/alterar-senha/${usuarioLogado.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          SenhaAtual: senhaAtual,
          NovaSenha: novaSenha
        })
      });

      if (!response.ok) throw new Error("Erro ao atualizar senha");

      console.log("Senha atualizada com sucesso");
      setPage("logado");
    } catch (err) {
      console.error(err);
    }
  };


  const deletarCliente = async () => {
    if (!usuarioLogado) return;

    if (!window.confirm("Tem certeza que deseja deletar sua conta?")) return;

    try {
      const response = await fetch(`http://localhost:5030/api/Clientes/${usuarioLogado.id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Erro ao deletar");

      const data = await response.json();
      console.log(data.message);

      sair();
    } catch (err) {
      console.error(err);
    }
  };



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
          <a href="#" onClick={() => {
            setForm({
              nome: "",
              email: "",
              senha: "",
              confirmarSenha: "",
              cpf: "",
              dataNas: "",
              tel: ""
            });
            setPage("cadastro");
          }}>É novo aqui? Cadastre-se!</a>
        </>
      )}

      {page === "cadastro" && (
        <>
          <h2 className="title">Cadastro</h2>
          <form onSubmit={CadastroSubmit}>
            <input type='text' name="nome" value={form.nome} onChange={handleChange} placeholder='Digite seu nome' />
            <input type='email' name="email" value={form.email} onChange={handleChange} placeholder='Digite seu email' />
            <input type='text' name="cpf" value={form.cpf} onChange={CpfChange} onBlur={() => {
              if (!validarCpf(form.cpf)) setErro("CPF inválido");
              else setErro("");
            }} placeholder='Digite seu CPF' />
            <input type='date' name="dataNas" value={form.dataNas} onChange={handleChange} />
            <input type='tel' name="tel" value={form.tel} onChange={TelChange} placeholder='Digite seu telefone' />
            <input type='password' name="senha" value={form.senha} onChange={handleChange} placeholder='Digite sua senha' />
            <input type='password' name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange} placeholder='Confirme sua senha' />

            {erro && <p style={{ color: "red" }}>{erro}</p>}

            <button type="submit" disabled={!!erro || !form.senha || !form.confirmarSenha || !validarCpf}>Cadastrar</button>
            <a href="#" onClick={() => setPage("login")}>Já tem cadastro? Faça login agora!</a>
          </form>
        </>
      )}

      {page === "logado" && (
        <>
          <div className='profile'>
            <div className='nav'>
              <h2 className="title">Olá, {usuarioLogado?.nome}</h2>
              <div className="dropdown" ref={menuRef}>
                <button onClick={() => setOpen(!open)} className="dropbtn">
                  <img width={"25px"} src="/assets/config.svg" />
                </button>
                {open && (
                  <div className="dropdown-content">
                    <button onClick={() => setPage("changePass")}>Alterar Senha</button>
                    <button onClick={sair}>Sair</button>
                    <button className="danger" onClick={deletarCliente}>Excluir Perfil</button>
                  </div>
                )}
              </div>
            </div>
            <div className='data'>
              <h3>Dados:</h3>
              <div className="hotbar">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setViewData(!viewData)
                  }}
                  className='view'
                >
                  {viewData ? <img className='icon' width={"20px"} src='/assets/hide.svg' /> : <img className='icon' width={"20px"} src='/assets/show.svg' />}
                </a>
                <a href="#" onClick={() => setPage("edit")} className="view"><img src="/assets/edit.svg" width={"20px"} /></a>
              </div>
            </div>
            <p>Email: {viewData ? usuarioLogado?.email : "**********"}</p>
            <p>CPF: {viewData ? formatarCpf(usuarioLogado?.cpf) : "**********"}</p>
            <p>Telefone: {viewData ? usuarioLogado?.telefone : "**********"}</p>
            <p>Data de Nascimento: {viewData && usuarioLogado?.dataNascimento ? formatarData(usuarioLogado?.dataNascimento) : "**********"}</p>
            <p>Idade: {viewData && usuarioLogado?.dataNascimento ? calcularIdade(usuarioLogado?.dataNascimento) + " anos" : "**********"}</p>
          </div>
        </>
      )}

      {page === "edit" && (
        <>
          <h2 className="title">Editar Perfil</h2>
          <form onSubmit={atualizarCliente}>
            <input type='text' name="nome" value={form.nome || usuarioLogado?.nome} onChange={handleChange} />
            <input type='email' name="email" value={form.email || usuarioLogado?.email} onChange={handleChange} />
            <input type='text' name="cpf" value={usuarioLogado?.cpf} disabled />
            <input type='date' name="dataNas" value={
              form.dataNas || (usuarioLogado?.dataNascimento ? formatarDataInput(usuarioLogado.dataNascimento) : "")
            } onChange={handleChange} />
            <input type='tel' name="tel" value={form.tel || usuarioLogado?.telefone} onChange={TelChange} />

            {erro && <p style={{ color: "red" }}>{erro}</p>}

            <button type="submit" style={{ width: "auto" }} disabled={!!erro}>Salvar Edições</button>
            <a href="#" onClick={() => setPage("logado")}>Cancelar</a>
          </form>
        </>
      )}

      {page === "changePass" && (
        <>
          <h2 className="title">Trocar Senha</h2>
          <form onSubmit={atualizarSenha}>
            <input type='password' name="senhaAtual"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)} placeholder='Digite sua senha atual' />
            <input type='password' name="novaSenha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)} placeholder='Digite sua nova senha' />
            <input type='password' name="confirmarNovaSenha"
              value={confirmarNovaSenha}
              onChange={(e) => setConfirmarNovaSenha(e.target.value)} placeholder='Confirme sua nova senha' />

            {erro && <p style={{ color: "red" }}>{erro}</p>}

            <button type="submit" disabled={!!erro || !senhaAtual || !novaSenha || !confirmarNovaSenha}>Confirmar</button>
            <a href="#" onClick={() => setPage("logado")}>Cancelar</a>
          </form>
        </>
      )}
    </div>
  )
}

export default App
