package com.pruebafrisoft.frisoft.response.error;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorType {

	BAD_REQUEST("400", "Solicitud invalida"),
	UNAUTHORIZED("401", "No autenticado"),
	FORBIDDEN("403", "Acceso denegado"),
	NOT_FOUND("404", "Recurso no encontrado"),
	METHOD_NOT_ALLOWED("405", "Metodo no permitido"),
	CONFLICT("409", "Conflicto con el estado actual del recurso"),
	UNPROCESSABLE_ENTITY("422", "La entidad no pudo ser procesada"),
	INTERNAL_SERVER_ERROR("500", "No se pudo establecer conexion con el servidor"),
	SERVICE_UNAVAILABLE("503", "Servicio no disponible");

	private final String code;
	private final String message;

}
