jQuery.extend(jQuery.validator.messages, {
    required: "Este campo es requerido.",
    remote: "Presta atención a este campo.",
    email: "Introduzca una dirección de correo válida.",
    url: "Introduzca una URL válida.",
    date: "Introduzca una fecha válida.",
    dateISO: "Introduzca una fecha válida (ISO).",
    number: "Ingrese un número válido.",
    digits: "Ingrese solo dígitos.",
    creditcard: "Introduzca un número de tarjeta de crédito válida.",
    equalTo: "Introduzca el mismo valor de nuevo.",
    accept: "Introduzca un valor con una extensión válida.",
    maxlength: jQuery.validator.format("Ingrese no más de {0} caracteres."),
    minlength: jQuery.validator.format("Introduzca al menos {0} caracteres."),
    rangelength: jQuery.validator.format("Intoduzca un valor entre {0} y {1} caracteres de longitud."),
    range: jQuery.validator.format("Intoduzca un valor entre {0} y {1}."),
    max: jQuery.validator.format("Ingrese un valor menor o igual a {0}."),
    min: jQuery.validator.format("Ingrese un valor mayor o igual que {0}.")
});