package com.pruebafrisoft.frisoft.features.usuarios.exceptions;

public class CuentaInactivaException extends RuntimeException {

	public CuentaInactivaException() {
		super("La cuenta no se encuentra activa");
	}

}
