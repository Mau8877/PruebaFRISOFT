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
import com.pruebafrisoft.frisoft.features.usuarios.dtos.LogoutResponse;
import com.pruebafrisoft.frisoft.features.usuarios.dtos.RefreshResponse;
import com.pruebafrisoft.frisoft.features.usuarios.dtos.UsuarioResponse;
import com.pruebafrisoft.frisoft.features.usuarios.exceptions.CredencialesInvalidasException;
import com.pruebafrisoft.frisoft.features.usuarios.exceptions.CuentaInactivaException;
import com.pruebafrisoft.frisoft.features.usuarios.exceptions.RefreshTokenExpiradoException;
import com.pruebafrisoft.frisoft.features.usuarios.exceptions.RefreshTokenInvalidoException;
import com.pruebafrisoft.frisoft.features.usuarios.exceptions.RefreshTokenRevocadoException;
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

	public RefreshResponse refresh(String refreshToken) {
		if (refreshToken == null || refreshToken.isBlank()) {
			throw new RefreshTokenInvalidoException();
		}
		RefreshToken token = buscarTokenActivo(refreshToken);
		Usuario usuario = token.getUsuario();
		if (usuario.getFechaEliminacion() != null) {
			throw new CuentaInactivaException();
		}
		String accessToken = jwtUtils.generateToken(usuario.getCorreo());
		return new RefreshResponse(accessToken, TOKEN_TYPE_BEARER, jwtProperties.getExpiration() / 1000);
	}

	public LogoutResponse logout(String refreshToken) {
		if (refreshToken != null && !refreshToken.isBlank()) {
			String hash = hashToken(refreshToken);
			refreshTokenRepository.findByTokenHash(hash)
					.filter(rt -> !rt.isRevocado())
					.ifPresent(rt -> {
						rt.setRevocado(true);
						refreshTokenRepository.save(rt);
					});
		}
		return new LogoutResponse("Sesion cerrada correctamente");
	}

	private RefreshToken buscarTokenActivo(String refreshToken) {
		RefreshToken token = refreshTokenRepository.findByTokenHashConUsuario(hashToken(refreshToken))
				.orElseThrow(RefreshTokenInvalidoException::new);
		if (token.isRevocado()) {
			throw new RefreshTokenRevocadoException();
		}
		if (token.getFechaExpiracion().isBefore(LocalDateTime.now())) {
			throw new RefreshTokenExpiradoException();
		}
		return token;
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
