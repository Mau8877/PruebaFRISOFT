package com.pruebafrisoft.frisoft.features.usuarios.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pruebafrisoft.frisoft.features.usuarios.models.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

	boolean existsByCorreo(String correo);

	Optional<Usuario> findByCorreo(String correo);

}
