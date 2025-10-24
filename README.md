<h1>🧑‍💻 Cadastro de Clientes</h1>



Sistema completo de cadastro, login e gerenciamento de clientes usando React no front-end e .NET 7 no back-end, com funcionalidades de edição, exclusão de conta e alteração de senha.

<h3>🔧 Tecnologias</h3>

<ul>
  <li>Front-end: React + TypeScript, CSS</li>
  <li>Back-end: .NET 7, C#, Entity Framework Core</li>
  <li>Banco de Dados: SQL Server (ou outro relacional)</li>
  <li>Segurança: Senhas armazenadas como hash SHA256</li>
</ul>

<h3>🚀 Funcionalidades</h3>

<ul>
  <li>Cadastro de usuários com validação de CPF</li>
  <li>Login com e-mail e senha</li>
  <li>Visualização de perfil com dados sensíveis ocultáveis</li>
  <li>Edição de informações pessoais (exceto CPF)</li>
  <li>Alteração de senha com validação da senha atual</li>
  <li>Exclusão de conta com confirmação</li>
  <li>Dropdown de configurações para ações rápidas</li>
</ul>

<h3>📂 Estrutura do Projeto</h3>

/frontend<br>
  /src<br>
    App.tsx<br>
    App.css<br>
/backend<br>
  /Controllers<br>
    ClientesController.cs<br>
  /Models<br>
    Cliente.cs<br>
    CadastroDto.cs<br>
    LoginDto.cs<br>
    AtualizarClienteDto.cs<br>
    AtualizarSenhaDto.cs<br>
  /Data<br>
    AppDbContext.cs<br><br>

<h3>💻 Como Rodar</h3>
<b>Back-end</b>

<ol>
  <li>Abra a pasta backend no Visual Studio ou VS Code.</li>
  <li>Configure a string de conexão do banco de dados em AppDbContext.cs.</li>
  <li>Execute as migrações ou crie o banco manualmente.</li>
  <li>Rode a API: <br><br> dotnet run <br><br></li>
</ol>

API disponível em: http://localhost:5030

<b>Front-end</b>

<ol>
  <li>Abra a pasta frontend.</li>
  <li>Instale dependências: <br><br> npm install <br><br></li>
  <li>Inicie o projeto: <br><br> npm start <br><br></li>
</ol>

Front disponível em: http://localhost:3000

<h3>📦 Rotas da API</h3>
<b>Cadastro</b><br><br>

<b>POST</b> /api/Clientes/register

{<br>
  "nome": "Ana Letícia",<br>
  "email": "ana@email.com",<br>
  "senha": "senha123",<br>
  "cpf": "12345678901",
  "dataNascimento": "1990-01-01",<br>
  "telefone": "(21)98765-4321"<br>
}<br><br>

<b>Login</b><br><br>

<b>POST</b> /api/Clientes/login

{<br>
  "email": "ana@email.com",<br>
  "senha": "senha123"<br>
}<br><br>

<b>Atualizar Dados</b>

<b>PATCH</b> /api/Clientes/{id}

{<br>
  "nome": "Novo Nome",<br>
  "email": "novo@email.com",<br>
  "telefone": "(21)99999-9999",<br>
  "dataNascimento": "1991-02-02"<br>
}<br><br>

<b>Alterar Senha</b>

<b>PATCH</b> /api/Clientes/alterar-senha/{id}

{<br>
  "SenhaAtual": "senha123",<br>
  "NovaSenha": "novaSenha123"<br>
}<br><br>

<b>Deletar Usuário</b>

<b>DELETE</b> /api/Clientes/{id}

<h3>🔒 Segurança</h3>

<ul>
  <li>Senhas nunca são armazenadas em texto puro, apenas hash SHA256</li>
  <li>CPF é validado antes de salvar</li>
  <li>Dados sensíveis podem ser ocultados na interface</li>
</ul>

<!-- <h3>🎨 Telas do App</h3>
<b>Login</b>

<b>Cadastro</b>

<b>Perfil</b>

<b>Edição de Dados</b>
-->
<h3>⚡ Dicas</h3>

<ul>
  <li>Certifique-se de que front-end e back-end estão rodando nas portas corretas (3000 e 5030)</li>
  <li>Use Postman ou Insomnia para testar as rotas da API</li>
  <li>Futuras melhorias: autenticação JWT, interface responsiva e integração com alertas de sucesso/erro</li>
</ul>
