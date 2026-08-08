package com.pruebafrisoft.frisoft.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import com.pruebafrisoft.frisoft.security.JwtProperties;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

	private final JwtProperties jwtProperties;
	private final Key signingKey;

	public JwtUtils(JwtProperties jwtProperties) {
		this.jwtProperties = jwtProperties;
		this.signingKey = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
	}

	public String generateToken(String username) {
		long now = System.currentTimeMillis();
		return Jwts.builder()
				.setSubject(username)
				.setIssuedAt(new Date(now))
				.setExpiration(new Date(now + jwtProperties.getExpiration()))
				.signWith(signingKey, SignatureAlgorithm.HS256)
				.compact();
	}

	public String extractUsername(String token) {
		return parseClaims(token).getSubject();
	}

	public boolean isTokenValid(String token) {
		try {
			parseClaims(token);
			return true;
		} catch (Exception ex) {
			return false;
		}
	}

	private Claims parseClaims(String token) {
		return Jwts.parserBuilder()
				.setSigningKey(signingKey)
				.build()
				.parseClaimsJws(token)
				.getBody();
	}

}
