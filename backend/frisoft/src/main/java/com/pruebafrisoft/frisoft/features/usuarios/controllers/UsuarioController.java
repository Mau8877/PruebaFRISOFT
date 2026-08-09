package com.pruebafrisoft.frisoft.features.usuarios.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pruebafrisoft.frisoft.features.usuarios.dtos.RegistroUsuarioRequest;
import com.pruebafrisoft.frisoft.features.usuarios.dtos.UsuarioResponse;
import com.pruebafrisoft.frisoft.features.usuarios.exceptions.CorreoDuplicadoException;
import com.pruebafrisoft.frisoft.features.usuarios.models.Usuario;
import com.pruebafrisoft.frisoft.features.usuarios.services.UsuarioService;
import com.pruebafrisoft.frisoft.response.error.ErrorResponse;
import com.pruebafrisoft.frisoft.response.error.ErrorType;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UsuarioController {

	private final UsuarioService usuarioService;

	@PostMapping("/registro")
	public ResponseEntity<?> registrar(@RequestBody RegistroUsuarioRequest request) {
		try {
			Usuario usuario = usuarioService.registrar(request);
			return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioResponse.from(usuario));
		} catch (IllegalArgumentException ex) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(ErrorResponse.of(ErrorType.BAD_REQUEST.getCode(), ex.getMessage()));
		} catch (CorreoDuplicadoException ex) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body(ErrorResponse.of(ErrorType.CONFLICT.getCode(), ex.getMessage()));
		}
	}

}
