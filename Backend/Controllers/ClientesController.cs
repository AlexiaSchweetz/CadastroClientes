using CadastroClientes.Data;
using CadastroClientes.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace CadastroClientes.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClientesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] CadastroDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cliente = new Cliente
            {
                Nome = dto.Nome,
                Email = dto.Email,
                Telefone = dto.Telefone,
                Cpf = dto.Cpf,
                DataNascimento = dto.DataNascimento,
                SenhaHash = HashPassword(dto.Senha)
            };

            _context.Clientes.Add(cliente);
            _context.SaveChanges();

            var resultado = new
            {
                cliente.Id,
                cliente.Nome,
                cliente.Email,
                cliente.Telefone,
                cliente.Cpf,
                cliente.DataNascimento
            };

            return Ok(resultado);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto login)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cliente = _context.Clientes.FirstOrDefault(c => c.Email == login.Email);
            if (cliente == null)
                return BadRequest("Cliente não encontrado.");

            if (cliente.SenhaHash != HashPassword(login.Senha))
                return BadRequest("Senha incorreta.");

            var resultado = new
            {
                cliente.Id,
                cliente.Nome,
                cliente.Email,
                cliente.Telefone,
                cliente.Cpf,
                cliente.DataNascimento
            };

            return Ok(resultado);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var clientes = _context.Clientes
                .Select(c => new
                {
                    c.Id,
                    c.Nome,
                    c.Email,
                    c.Telefone,
                    c.Cpf,
                    c.Senha  // ⚠️ somente para teste
                })
                .ToList();

            return Ok(clientes);
        }

        [HttpPatch("{id}")]
        public IActionResult Atualizar(int id, [FromBody] AtualizarClienteDto dto)
        {
            var cliente = _context.Clientes.FirstOrDefault(c => c.Id == id);
            if (cliente == null) return NotFound("Cliente não encontrado.");

            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (dto.Nome != null) cliente.Nome = dto.Nome;
            if (dto.Email != null) cliente.Email = dto.Email;
            if (dto.Telefone != null) cliente.Telefone = dto.Telefone;
            if (dto.DataNascimento != null) cliente.DataNascimento = dto.DataNascimento.Value;

            _context.SaveChanges();

            return Ok(cliente);
        }

        [HttpPatch("alterar-senha/{id}")]
        public IActionResult AlterarSenha(int id, [FromBody] AtualizarSenhaDto dto)
        {
            var cliente = _context.Clientes.Find(id);
            if (cliente == null) return NotFound();

            if (cliente.SenhaHash != HashPassword(dto.SenhaAtual))
                return BadRequest("Senha atual incorreta.");

            cliente.SenhaHash = HashPassword(dto.NovaSenha);
            _context.SaveChanges();

            return Ok(new { message = "Senha alterada com sucesso!" });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var cliente = _context.Clientes.FirstOrDefault(c => c.Id == id);
            if (cliente == null) return NotFound("Cliente não encontrado.");

            _context.Clientes.Remove(cliente);
            _context.SaveChanges();

            return Ok(new { message = "Cliente deletado com sucesso." });
        }



        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}
