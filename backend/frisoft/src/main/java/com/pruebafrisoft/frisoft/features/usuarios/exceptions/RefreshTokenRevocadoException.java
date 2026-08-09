package com.pruebafrisoft.frisoft.features.usuarios.exceptions;

public class RefreshTokenRevocadoException extends RuntimeException {

	public RefreshTokenRevocadoException() {
		super("Refresh token revocado");
	}

}
