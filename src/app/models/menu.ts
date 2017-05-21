export class Menu {
    constructor(
        public menuid:string="",
        public label:string="",
        public iconfa:string="",
        public orden:number=0,
        public activo:boolean=false,
        public submenuid:string="",
        public ruta:string="",
        public resalte:string="",
        public tiporesalte:string="",
        public hijos:boolean=false
        ){}
}
