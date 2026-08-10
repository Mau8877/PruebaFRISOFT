package com.pruebafrisoft.frisoft.features.usuarios.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pruebafrisoft.frisoft.features.usuarios.dtos.PerfilResponse;
import com.pruebafrisoft.frisoft.features.usuarios.exceptions.UsuarioNoEncontradoException;
import com.pruebafrisoft.frisoft.features.usuarios.models.Usuario;
import com.pruebafrisoft.frisoft.features.usuarios.services.UsuarioService;
import com.pruebafrisoft.frisoft.response.error.ErrorResponse;
import com.pruebafrisoft.frisoft.response.error.ErrorType;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class PerfilController {

	private final UsuarioService usuarioService;

	@GetMapping("/me")
	public ResponseEntity<?> perfil(Authentication authentication) {
		try {
			Usuario usuario = usuarioService.obtenerPorCorreo(authentication.getName());
			return ResponseEntity.ok(PerfilResponse.from(usuario));
		} catch (UsuarioNoEncontradoException ex) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(ErrorResponse.of(ErrorType.UNAUTHORIZED.getCode(), ex.getMessage()));
		}
	}

}
