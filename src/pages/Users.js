import React, { useState, useEffect } from "react";
import UserService from "../services/UserService";

function Users() {
  const [users, setUsers] = useState([]); // Estado para almacenar los usuarios
  const [loading, setLoading] = useState(true); // Estado para saber si los datos están cargando
  const [editingUser, setEditingUser] = useState(null); // Usuario en edición
  const [showModal, setShoweditModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", type: "", password:"" }); //nuevo usuario
  const [showAddModal, setShowAddModal] = useState(false);
  const userService = new UserService();
  const [error, setError] = useState('');

  useEffect(() => {
    // Llamada al servicio para obtener la lista de usuarios
    const fetchUsers = async () => {
      try {
        const response = await userService.list(); 
        setUsers(response.data);  
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      } finally {
        setLoading(false);  // Ya terminó de cargar
      }
    };

    fetchUsers();
  }, );  

  // acciones
  //modificacion de usuarios
  const handleEdit = (user) => {  
    setEditingUser({ ...user });
    setShoweditModal(true);
    setShowAddModal(false);
  };
  //modificacion de usuarios
  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      await userService.update(editingUser.id, editingUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? editingUser : user
        )
      );
      setShoweditModal(false);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  //eliminacion de usuarios
  const handleDelete = async (userId) => {    
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (confirmDelete) {
      try {
        const response = await userService.delete(userId); 
        if (response.error) {
          console.error("Error al eliminar usuario:", response.error);
          return;
        }
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId)); 
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      } finally {
        setLoading(false);  // Ya terminó de cargar
      }    
    } else {
      console.log("Eliminación cancelada.");
    }
  };

  const handleAddUser = () => {    
    setNewUser({ name: "", email: "", type: "", password: "" }); // Limpiar formulario
    setShowAddModal(true);
    setShoweditModal(false);
  };
  const handleSaveNewUser = async () => {
    try {
      if (!newUser.password || !newUser.name|| !newUser.email) {
        setError('Por favor, Rellena todos los campos');
        return;
      }
      if (!newUser.type ) {
        setError('Por favor, Selecciona un Tipo');
        return;
      }
      const { user, error } = await userService.create(newUser);  // Asegúrate de desestructurar correctamente
        if (user && user.id) {
          setUsers([...users, user]);  // Agregar el nuevo usuario si tiene ID
          setShowAddModal(false);  // Cerrar el modal
        } else {
          console.error("Error: ", error || 'Usuario no válido');
          // Manejar el error si no hay un id válido
        }
      setShowAddModal(false); // Cerrar modal
    } catch (error) {
      console.error("Error al agregar usuario:", error);
    }
  };
  

  if (loading) {
    return <div>Cargando usuarios...</div>; 
  }

  return (
    <div>
      <h1>Usuarios</h1>
      <button
        onClick={handleAddUser}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-4"
      >
        Agregar Usuario
      </button>
      <div>Lista de usuarios:</div>
      <table className="table-auto w-full mt-4 border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Correo Electrónico</th>
            <th className="border px-4 py-2">Tipo</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.type}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded-lg mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border px-4 py-2 text-center">
                No hay usuarios disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* agregar usuarios */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Agregar Usuario</h2>
            {error && <div className="text-red-500">{error}</div>} 
            <label className="block mb-2">Nombre:</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="border p-2 w-full mb-2"
              placeholder="Nombre"
            />
            <label className="block mb-2">Correo:</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="border p-2 w-full mb-2"
              placeholder="Correo"
            />
            
            <label className="block mb-2">Tipo:</label>
            <select
              value={newUser.type}
              onChange={(e) => {
                console.log(e.target.value);  // Verifica que el valor seleccionado se esté capturando
                setNewUser({ ...newUser, type: e.target.value });
              }}
              className="border p-2 w-full mb-2"
            >
              <option value="">Seleccione un Tipo</option>
              <option value="admin">Admin</option>
              <option value="usuario">Usuario</option>
            </select>
            
            <label className="block mb-2">Password:</label>
            <input
              type="text"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="border p-2 w-full mb-2"
              placeholder="Password"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNewUser}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* modificaion de usuarios */}
      {showModal && editingUser && (
         <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
         <div className="bg-white p-6 rounded shadow-lg w-96">
           <h2 className="text-lg font-bold mb-4">Editar Usuario</h2>
           <label className="block mb-2">Nombre:</label>
           <input
             type="text"
             value={editingUser.name}
             onChange={(e) =>
               setEditingUser({ ...editingUser, name: e.target.value })
             }
             className="border p-2 w-full mb-2"
             placeholder="Nombre"
           />
           <label className="block mb-2">Correo:</label>
           <input
             type="email"
             value={editingUser.email}
             onChange={(e) =>
               setEditingUser({ ...editingUser, email: e.target.value })
             }
             className="border p-2 w-full mb-2"
             placeholder="Correo"
           />
           <label className="block mb-2">Tipo:</label>
           <input
             type="text"
             value={editingUser.type}
             onChange={(e) =>
               setEditingUser({ ...editingUser, type: e.target.value })
             }
             className="border p-2 w-full mb-2"
             placeholder="Tipo"
           />
           <div className="flex justify-end">
             <button
               onClick={() => setShoweditModal(false)}
               className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
             >
               Cancelar
             </button>
             <button
               onClick={handleSaveEdit}
               className="bg-blue-500 text-white px-4 py-2 rounded"
             >
               Guardar
             </button>
           </div>
         </div>
       </div>
      )}
    </div>
  );
}

export default Users;