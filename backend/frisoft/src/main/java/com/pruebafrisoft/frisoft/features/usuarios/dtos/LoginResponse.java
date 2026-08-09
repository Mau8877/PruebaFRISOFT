package com.pruebafrisoft.frisoft.features.usuarios.dtos;

public record LoginResponse(
		String accessToken,
		String refreshToken,
		String tokenType,
		long expiresIn,
		UsuarioResponse usuario) {

}
