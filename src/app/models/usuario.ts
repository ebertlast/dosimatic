export class Usuario {
    constructor(
        public usuario : string = "",
        public clave : string = "",
        public email : string = "",
        public masculino : boolean = true,
        public fechanacimiento : Date = null,
        public activo : boolean = false,
        public fecharegistro : Date = null,
        public nombres : string = "",
        public apellidos : string = "",
        public avatar : string = "",
        public perfilid : string = "",
        public perfil : string = "",
        public token : string = "",
        public firma : string = ""
    ){}
}
