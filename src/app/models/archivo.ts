export class Archivo {
    constructor(
        public archivoid: string = '',
        public nombre: string = '', // URL del archivo en el servidor
        public gestionid: string = '', // Codigo del proceso
        public convencionid: string = '', // Tipo de documento (Manual, Procedimiento, etc...)
        public archivoidaux: string = '', // Si es hijo de otro archivo
        public denominacion: string = '', // Nombre del archivo que aparecerá en el frontend
        public observaciones: string = '',
        public usuario: string = '',
        public usuarionombre: string = '',
        public fecha: Date = null,
        public fechaexp: Date = null,
        public convencion: string = '',
        public gestion: string = '',
        public vinculadoa: string = '',
        public version: number = 0
    ){}
}
