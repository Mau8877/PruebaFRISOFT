package com.pruebafrisoft.frisoft.features.usuarios.services;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.pruebafrisoft.frisoft.features.usuarios.dtos.LoginRequest;
import com.pruebafrisoft.frisoft.features.usuarios.dtos.LoginResponse;
import com.pruebafrisoft.frisoft.features.usuarios.dtos.UsuarioResponse;
import com.pruebafrisoft.frisoft.features.usuarios.exceptions.CredencialesInvalidasException;
import com.pruebafrisoft.frisoft.features.usuarios.exceptions.CuentaInactivaException;
import com.pruebafrisoft.frisoft.features.usuarios.models.RefreshToken;
import com.pruebafrisoft.frisoft.features.usuarios.models.Usuario;
import com.pruebafrisoft.frisoft.features.usuarios.repositories.RefreshTokenRepository;
import com.pruebafrisoft.frisoft.features.usuarios.repositories.UsuarioRepository;
import com.pruebafrisoft.frisoft.security.JwtProperties;
import com.pruebafrisoft.frisoft.utils.JwtUtils;
import com.pruebafrisoft.frisoft.utils.PasswordUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	private static final String TOKEN_TYPE_BEARER = "Bearer";

	private final UsuarioRepository usuarioRepository;
	private final RefreshTokenRepository refreshTokenRepository;
	private final PasswordUtils passwordUtils;
	private final JwtUtils jwtUtils;
	private final JwtProperties jwtProperties;

	public LoginResponse login(LoginRequest request) {
		Usuario usuario = usuarioRepository.findByCorreo(request.correo())
				.orElseThrow(CredencialesInvalidasException::new);

		if (usuario.getFechaEliminacion() != null) {
			throw new CuentaInactivaException();
		}

		if (!passwordUtils.matches(request.password(), usuario.getPasswordHash())) {
			throw new CredencialesInvalidasException();
		}

		String accessToken = jwtUtils.generateToken(usuario.getCorreo());
		String refreshToken = generarRefreshToken(usuario);

		return new LoginResponse(
				accessToken,
				refreshToken,
				TOKEN_TYPE_BEARER,
				jwtProperties.getExpiration() / 1000,
				UsuarioResponse.from(usuario));
	}

	private String generarRefreshToken(Usuario usuario) {
		String token = UUID.randomUUID().toString();
		LocalDateTime ahora = LocalDateTime.now();

		RefreshToken refreshToken = new RefreshToken();
		refreshToken.setUsuario(usuario);
		refreshToken.setTokenHash(hashToken(token));
		refreshToken.setFechaExpiracion(ahora.plusSeconds(jwtProperties.getRefreshExpiration() / 1000));
		refreshToken.setFechaCreacion(ahora);
		refreshToken.setRevocado(false);
		refreshTokenRepository.save(refreshToken);

		return token;
	}

	private static String hashToken(String token) {
		try {
			byte[] hash = MessageDigest.getInstance("SHA-256")
					.digest(token.getBytes(StandardCharsets.UTF_8));
			return HexFormat.of().formatHex(hash);
		} catch (NoSuchAlgorithmException ex) {
			throw new IllegalStateException("SHA-256 no disponible", ex);
		}
	}

}
