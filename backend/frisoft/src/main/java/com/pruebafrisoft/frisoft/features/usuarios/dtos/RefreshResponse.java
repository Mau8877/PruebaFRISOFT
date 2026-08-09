package com.pruebafrisoft.frisoft.features.usuarios.dtos;

public record RefreshResponse(
		String accessToken,
		String tokenType,
		long expiresIn) {

}
