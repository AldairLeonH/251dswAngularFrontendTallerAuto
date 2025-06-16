import { IPersona } from "./persona";
import { IRol } from "./rol";

export interface IUsuario {
          id?: number;
          nombreUsuario: string;
          password: string;
          rol: IRol;
          persona: IPersona;
}
