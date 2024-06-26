﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebControlPatrimonial.Models
{
    public class LoginViewModel
    {
        [Required]
        [RegularExpression("^[0-9]*$", ErrorMessage = "Solo ingresar números")]
        [Display(Name ="Dni")]
        public string Dni { get; set; }
        
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Contraseña")]
        public string Clave { get; set; }
    }
}