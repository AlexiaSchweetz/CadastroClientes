using System.ComponentModel.DataAnnotations;

namespace CadastroClientes.Models
{
    public class CadastroDto
    {
        [Required(ErrorMessage = "O nome é obrigatório")]
        [StringLength(100)]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "O e-mail é obrigatório")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "O telefone é obrigatório")]
        [Phone]
        public string Telefone { get; set; } = string.Empty;

        [Required(ErrorMessage = "O CPF é obrigatório")]
        [RegularExpression(@"^\d{11}$")]
        public string Cpf { get; set; } = string.Empty;

        [Required(ErrorMessage = "A senha é obrigatória")]
        [MinLength(6)]
        public string Senha { get; set; } = string.Empty;

        [DataType(DataType.Date)]
        public DateTime DataNascimento { get; set; }
    }
}
