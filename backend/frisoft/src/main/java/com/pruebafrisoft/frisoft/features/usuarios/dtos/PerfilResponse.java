package com.pruebafrisoft.frisoft.features.usuarios.dtos;

import java.time.LocalDateTime;

import com.pruebafrisoft.frisoft.features.usuarios.models.Usuario;

public record PerfilResponse(
		Integer idUsuario,
		String nombre,
		String apellido,
		String correo,
		LocalDateTime fechaCreacion,
		LocalDateTime fechaActualizacion) {

	public static PerfilResponse from(Usuario usuario) {
		return new PerfilResponse(
				usuario.getIdUsuario(),
				usuario.getNombre(),
				usuario.getApellido(),
				usuario.getCorreo(),
				usuario.getFechaCreacion(),
				usuario.getFechaActualizacion());
	}

}
