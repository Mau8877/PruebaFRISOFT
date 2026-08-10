package com.pruebafrisoft.frisoft.features.usuarios.services;

import java.time.LocalDateTime;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.pruebafrisoft.frisoft.features.usuarios.dtos.RegistroUsuarioRequest;
import com.pruebafrisoft.frisoft.features.usuarios.exceptions.CorreoDuplicadoException;
import com.pruebafrisoft.frisoft.features.usuarios.exceptions.UsuarioNoEncontradoException;
import com.pruebafrisoft.frisoft.features.usuarios.models.Usuario;
import com.pruebafrisoft.frisoft.features.usuarios.repositories.UsuarioRepository;
import com.pruebafrisoft.frisoft.utils.PasswordUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

	private static final Pattern CORREO_PATTERN = Pattern
			.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

	private static final Pattern PASSWORD_PATTERN = Pattern
			.compile("^(?=.*[A-Za-z])(?=.*\\d).{8,}$");

	private final UsuarioRepository usuarioRepository;
	private final PasswordUtils passwordUtils;

	public Usuario registrar(RegistroUsuarioRequest request) {
		validarCamposObligatorios(request);
		validarFormatoCorreo(request.correo());
		validarPoliticaPassword(request.password());
		validarCorreoNoDuplicado(request.correo());

		Usuario usuario = new Usuario();
		usuario.setNombre(request.nombre());
		usuario.setApellido(request.apellido());
		usuario.setCorreo(request.correo());
		usuario.setPasswordHash(passwordUtils.hash(request.password()));
		usuario.setFechaCreacion(LocalDateTime.now());

		return usuarioRepository.save(usuario);
	}

	public Usuario obtenerPorCorreo(String correo) {
		return usuarioRepository.findByCorreo(correo)
				.orElseThrow(UsuarioNoEncontradoException::new);
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

	private void validarFormatoCorreo(String correo) {
		if (!CORREO_PATTERN.matcher(correo).matches()) {
			throw new IllegalArgumentException("El formato del correo no es valido");
		}
	}

	private void validarPoliticaPassword(String password) {
		if (!PASSWORD_PATTERN.matcher(password).matches()) {
			throw new IllegalArgumentException(
					"La contrasena debe tener al menos 8 caracteres e incluir al menos una letra y un numero");
		}
	}

	private void validarCorreoNoDuplicado(String correo) {
		if (usuarioRepository.existsByCorreo(correo)) {
			throw new CorreoDuplicadoException("El correo ya se encuentra registrado");
		}
	}

}
