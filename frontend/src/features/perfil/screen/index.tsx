import { useState } from "react";
import { ApiError } from "../../../lib/http-client";
import { usePerfilQuery, useActualizarPerfilMutation } from "../api";
import { PerfilDetails, PerfilForm } from "../components";
import "../styles";
import type { ActualizarPerfilRequest } from "../types";

export function PerfilScreen() {
  const perfilQuery = usePerfilQuery();
  const mutation = useActualizarPerfilMutation();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  const mutationErrorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.isError
        ? "No se pudo actualizar el perfil. Intenta nuevamente."
        : undefined;

  const queryErrorMessage =
    perfilQuery.error instanceof ApiError
      ? perfilQuery.error.message
      : "No se pudo cargar tu perfil. Intenta nuevamente.";

  const handleSubmit = async (values: ActualizarPerfilRequest) => {
    setSuccessMessage(undefined);
    try {
      await mutation.mutateAsync(values);
      setSuccessMessage("Perfil actualizado correctamente.");
    } catch {
      // El error queda expuesto en mutation.error y se muestra en el formulario.
    }
  };

  return (
    <div className="perfil-page">
      <h2 className="perfil-title">Mi perfil</h2>

      {perfilQuery.isLoading && <p className="perfil-status">Cargando perfil...</p>}

      {perfilQuery.isError && (
        <div className="perfil-page__error">
          <p className="perfil-error" role="alert">
            {queryErrorMessage}
          </p>
          <button type="button" onClick={() => perfilQuery.refetch()}>
            Reintentar
          </button>
        </div>
      )}

      {perfilQuery.data && (
        <div className="perfil-page__content">
          <section className="perfil-card">
            <h3 className="perfil-card__title">Datos actuales</h3>
            <PerfilDetails perfil={perfilQuery.data} />
          </section>

          <section className="perfil-card">
            <h3 className="perfil-card__title">Editar nombre y apellido</h3>
            <PerfilForm
              key={`${perfilQuery.data.nombre}|${perfilQuery.data.apellido}|${perfilQuery.data.fechaActualizacion ?? ""}`}
              nombreInicial={perfilQuery.data.nombre}
              apellidoInicial={perfilQuery.data.apellido}
              onSubmit={handleSubmit}
              isPending={mutation.isPending}
              errorMessage={mutationErrorMessage}
              successMessage={successMessage}
            />
          </section>
        </div>
      )}
    </div>
  );
}
