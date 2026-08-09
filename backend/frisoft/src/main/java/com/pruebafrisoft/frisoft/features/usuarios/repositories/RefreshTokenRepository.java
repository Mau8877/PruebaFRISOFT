package com.pruebafrisoft.frisoft.features.usuarios.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pruebafrisoft.frisoft.features.usuarios.models.RefreshToken;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

	Optional<RefreshToken> findByTokenHash(String tokenHash);

}
