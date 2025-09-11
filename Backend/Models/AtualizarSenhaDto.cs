using System.ComponentModel.DataAnnotations;

namespace CadastroClientes.Models
{
    public class AtualizarSenhaDto
    {
        [Required]
        public string SenhaAtual { get; set; } = string.Empty;

        [Required]
        public string NovaSenha { get; set; } = string.Empty;
    }

}
