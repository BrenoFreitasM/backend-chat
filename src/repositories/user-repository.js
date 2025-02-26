import User from '../models/User.js'; // Importa o modelo User (sem chaves {})

const userRepository = {

  findAll: async () => {
    try {
      return await User.find({});
    } catch (error) {
      console.error("Erro ao buscar todos os usuários:", error);
      throw error;
    }
  },

  findUserByEmail: async (email) => {
    try {
      return await User.findOne({ email });
    } catch (error) {
      console.error("Erro ao buscar usuário por email:", error);
      throw error;
    }
  },

  create: async (userData) => {
    try {
      const newUser = new User(userData);
      return await newUser.save();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  },

  findById: async (id) => {
    try {
      return await User.findById(id);
    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error);
      throw error;
    }
  },

  update: async (id, updateData) => {
    try {
      return await User.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw error;
    }
  }
}

export default userRepository; //