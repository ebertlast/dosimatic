export class Aprobacion {
  constructor(
    public aprobacionid:number=0,
    public aprobado:boolean=false,
    public archivoid:string="",
    public usuario:string="",
    public fecha:Date=null,
    public usuarionombres:string=""
  ){

  }
}
