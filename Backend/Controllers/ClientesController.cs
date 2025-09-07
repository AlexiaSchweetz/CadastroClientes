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

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}
