package com.pruebafrisoft.frisoft.features.usuarios.dtos;

public record RegistroUsuarioRequest(
		String nombre,
		String apellido,
		String correo,
		String password) {

}
