import React, { useState } from "react";
import UserService from "../services/UserService";  
function Pages() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  
  const userService = new UserService();
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(email, password);
    // Llamar al servicio de login
    const { token, error } = await userService.login(email, password);

    if (token) {
      // Almacenar el token en localStorage
      localStorage.setItem("token", token);

      // Redirigir a otra página si es necesario
       window.location.href = "/home"; // Ejemplo de redirección
    } else {
      // Mostrar mensaje de error si las credenciales son incorrectas
      setError(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Pages;
