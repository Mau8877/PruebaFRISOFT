import type { Perfil } from "../types";

interface PerfilDetailsProps {
  perfil: Perfil;
}

function formatearFecha(fecha: string | null): string {
  if (!fecha) return "—";
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

export function PerfilDetails({ perfil }: PerfilDetailsProps) {
  return (
    <dl className="perfil-details">
      <div className="perfil-details__row">
        <dt>Nombre</dt>
        <dd>{perfil.nombre}</dd>
      </div>
      <div className="perfil-details__row">
        <dt>Apellido</dt>
        <dd>{perfil.apellido}</dd>
      </div>
      <div className="perfil-details__row">
        <dt>Correo</dt>
        <dd>{perfil.correo}</dd>
      </div>
      <div className="perfil-details__row">
        <dt>Miembro desde</dt>
        <dd>{formatearFecha(perfil.fechaCreacion)}</dd>
      </div>
      <div className="perfil-details__row">
        <dt>Última actualización</dt>
        <dd>{formatearFecha(perfil.fechaActualizacion)}</dd>
      </div>
    </dl>
  );
}
