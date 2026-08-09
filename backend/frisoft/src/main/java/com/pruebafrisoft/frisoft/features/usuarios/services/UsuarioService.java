package com.pruebafrisoft.frisoft.features.usuarios.services;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.pruebafrisoft.frisoft.features.usuarios.dtos.RegistroUsuarioRequest;
import com.pruebafrisoft.frisoft.features.usuarios.models.Usuario;
import com.pruebafrisoft.frisoft.features.usuarios.repositories.UsuarioRepository;
import com.pruebafrisoft.frisoft.utils.PasswordUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

	private final UsuarioRepository usuarioRepository;
	private final PasswordUtils passwordUtils;

	public Usuario registrar(RegistroUsuarioRequest request) {
		validarCamposObligatorios(request);

		Usuario usuario = new Usuario();
		usuario.setNombre(request.nombre());
		usuario.setApellido(request.apellido());
		usuario.setCorreo(request.correo());
		usuario.setPasswordHash(passwordUtils.hash(request.password()));
		usuario.setFechaCreacion(LocalDateTime.now());

		return usuarioRepository.save(usuario);
	}

	private void validarCamposObligatorios(RegistroUsuarioRequest request) {
		if (esVacio(request.nombre())) {
			throw new IllegalArgumentException("El nombre es obligatorio");
		}
		if (esVacio(request.apellido())) {
			throw new IllegalArgumentException("El apellido es obligatorio");
		}
		if (esVacio(request.correo())) {
			throw new IllegalArgumentException("El correo es obligatorio");
		}
		if (esVacio(request.password())) {
			throw new IllegalArgumentException("La contrasena es obligatoria");
		}
	}

	private boolean esVacio(String valor) {
		return valor == null || valor.isBlank();
	}

}
