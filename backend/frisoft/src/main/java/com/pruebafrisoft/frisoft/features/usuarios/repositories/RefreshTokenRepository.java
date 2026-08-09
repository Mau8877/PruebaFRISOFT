package com.pruebafrisoft.frisoft.features.usuarios.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pruebafrisoft.frisoft.features.usuarios.models.RefreshToken;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

	Optional<RefreshToken> findByTokenHash(String tokenHash);

	@Query("SELECT rt FROM RefreshToken rt JOIN FETCH rt.usuario WHERE rt.tokenHash = :tokenHash")
	Optional<RefreshToken> findByTokenHashConUsuario(@Param("tokenHash") String tokenHash);

}
