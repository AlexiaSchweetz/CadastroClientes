using System.ComponentModel.DataAnnotations;

namespace CadastroClientes.Models
{
    public class AtualizarClienteDto
    {
        [StringLength(100)]
        public string? Nome { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        [Phone]
        public string? Telefone { get; set; }

        [RegularExpression(@"^\d{11}$")]
        public string? Cpf { get; set; }

        [DataType(DataType.Date)]
        public DateTime? DataNascimento { get; set; }
    }
}
