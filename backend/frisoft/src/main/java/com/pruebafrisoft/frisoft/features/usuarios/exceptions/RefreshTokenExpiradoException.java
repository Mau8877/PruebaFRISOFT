package com.pruebafrisoft.frisoft.features.usuarios.exceptions;

public class RefreshTokenExpiradoException extends RuntimeException {

	public RefreshTokenExpiradoException() {
		super("Refresh token expirado. Debe re-autenticarse");
	}

}
