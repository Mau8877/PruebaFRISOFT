package com.pruebafrisoft.frisoft.features.usuarios.exceptions;

public class UsuarioNoEncontradoException extends RuntimeException {

	public UsuarioNoEncontradoException() {
		super("El usuario asociado al token ya no existe");
	}

}
