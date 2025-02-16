import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("token");
class UserService {
  async login(email, password) {     
    //console.log(email, password, apiUrl);
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        return { token: data.token, error: null };
      } else {
        const data = await response.json();
        return { token: null, error: data.message };
      }
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
      return { token: null, error: "Hubo un problema con el servidor" };
    }
  }
  async list() {
    try {
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`,{
        headers: {
          "Authorization": `Bearer ${token}`,  
        },
      });  
      return response; 
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }
  async get(id) {
    throw new Error("Not implemented");
  }
  async create(data) {
    try {
      console.log("Datos enviados:", { name: data.name, email: data.email, type: data.type, password: data.password });
  
      const response = await fetch(`${apiUrl}/users/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name: data.name, email: data.email, type: data.type, password: data.password }),
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        console.log("Nuevo usuario:", responseData.user);
        
        if (responseData.user && responseData.user.id) {
          return { user: responseData.user, error: null };
        } else {
          return { user: null, error: 'El usuario no contiene un ID válido.' };
        }
      } else {
        return { user: null, error: responseData.message };
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
      return { user: null, error: "Hubo un problema con el servidor" };
    }
  }
  async delete(id) {
    try {      
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        return { data: data.data, mensaje: data.mensaje };
      } else {
        const data = await response.json();
        return { data: null, error: data.message };
      }
    } catch (error) {
      console.error("Error al intentar eliminar un usuario:", error);
      return { token: null, error: "Hubo un problema con el servidor" };
    }
  }
  async update(id, data) {
    try {      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        return await response.json();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  }
}

export default UserService;
