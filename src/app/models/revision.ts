export class Revision {
  constructor(
    public revisionid: number = 0,
    public revisado: boolean = false,
    public archivoid: string = '',
    public usuario: string = '',
    public fecha: Date = null,
    public usuarionombres: string = ''
  ) {}
}
