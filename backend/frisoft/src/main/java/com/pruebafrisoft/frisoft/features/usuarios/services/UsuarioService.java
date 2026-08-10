package com.pruebafrisoft.frisoft.features.usuarios.services;

import java.time.LocalDateTime;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.pruebafrisoft.frisoft.features.usuarios.dtos.ActualizarPerfilRequest;
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

	private static final int NOMBRE_APELLIDO_LONGITUD_MINIMA = 2;
	private static final int NOMBRE_APELLIDO_LONGITUD_MAXIMA = 150;

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

	public Usuario actualizarPerfil(String correo, ActualizarPerfilRequest request) {
		validarNombreOApellido(request.nombre(), "nombre");
		validarNombreOApellido(request.apellido(), "apellido");

		Usuario usuario = obtenerPorCorreo(correo);
		usuario.setNombre(request.nombre().trim());
		usuario.setApellido(request.apellido().trim());
		usuario.setFechaActualizacion(LocalDateTime.now());

		return usuarioRepository.save(usuario);
	}

	private void validarNombreOApellido(String valor, String campo) {
		if (esVacio(valor)) {
			throw new IllegalArgumentException("El " + campo + " es obligatorio");
		}
		int longitud = valor.trim().length();
		if (longitud < NOMBRE_APELLIDO_LONGITUD_MINIMA || longitud > NOMBRE_APELLIDO_LONGITUD_MAXIMA) {
			throw new IllegalArgumentException(
					"El " + campo + " debe tener entre " + NOMBRE_APELLIDO_LONGITUD_MINIMA + " y "
							+ NOMBRE_APELLIDO_LONGITUD_MAXIMA + " caracteres");
		}
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
