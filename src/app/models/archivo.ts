export class Archivo {
    constructor(
        public archivoid:string="",
        public nombre:string="",//URL del archivo en el servidor
        public gestionid:string="",//Codigo del proceso
        public convencionid:string="",//Tipo de documento (Manuel, Procedimiento, etc...)
        public archivoidaux:string="",//Si es hijo de otro archivo
        public denominacion:string="",//Nombre del archivo que aparecerá en el frontend
        public observaciones:string="",
        public usuario:string="",
        public usuarionombres:string="",
    ){}
}
