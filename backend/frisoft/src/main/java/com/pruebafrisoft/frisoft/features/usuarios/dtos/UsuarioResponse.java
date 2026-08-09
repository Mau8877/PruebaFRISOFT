package com.pruebafrisoft.frisoft.features.usuarios.dtos;

import java.time.LocalDateTime;

import com.pruebafrisoft.frisoft.features.usuarios.models.Usuario;

public record UsuarioResponse(
		Integer idUsuario,
		String nombre,
		String apellido,
		String correo,
		LocalDateTime fechaCreacion) {

	public static UsuarioResponse from(Usuario usuario) {
		return new UsuarioResponse(
				usuario.getIdUsuario(),
				usuario.getNombre(),
				usuario.getApellido(),
				usuario.getCorreo(),
				usuario.getFechaCreacion());
	}

}
