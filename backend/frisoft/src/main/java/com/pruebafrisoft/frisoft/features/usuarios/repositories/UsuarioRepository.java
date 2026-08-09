package com.pruebafrisoft.frisoft.features.usuarios.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pruebafrisoft.frisoft.features.usuarios.models.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

	boolean existsByCorreo(String correo);

}
