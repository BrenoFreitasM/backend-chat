import userRepository from "../repositories/user-repository.js";
import bcrypt from 'bcrypt'; // Importe o bcrypt para criptografar a senha
import UserRepository from "../repositories/user-repository.js"; // Importe o repositório de usuários

export const list = async (req, res) => {
    try {
        const users = await userRepository.findAll();
        res.status(200).json({ users }); // Simplificado: { users: users } -> { users }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao listar usuários' });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body; // Desestruturação para facilitar o acesso

        // Validação se os campos obrigatórios foram enviados
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        // Validação se já há usuário com esse email
        const findRepeat = await userRepository.findUserByEmail(email);

        if (findRepeat) {
            return res.status(400).json({ message: 'Email já cadastrado.' });
        }

        // Criptografar a senha antes de salvar no banco de dados
        const hashedPassword = await bcrypt.hash(password, 10); // 10 é o número de rounds de sal

        const newUser = await userRepository.create({ // Use a função create do repositório
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: 'Usuário criado com sucesso',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });

    } catch (err) {
        console.error(err); // Log do erro para depuração
        res.status(500).json({ message: 'Erro ao criar usuário' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        // Validação se os campos obrigatórios foram enviados
        if (!name || !email) {
            return res.status(400).json({ message: 'Nome e email são obrigatórios' });
        }

        // Validação se o email já existe
        const existingUserWithEmail = await userRepository.findUserByEmail(email);

        if (existingUserWithEmail && existingUserWithEmail._id.toString() !== id) {
            return res.status(400).json({ message: 'Email já cadastrado.' });
        }

        let updateData = { name, email };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await userRepository.update(id, updateData);

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json({ message: 'Usuário atualizado com sucesso', user: updatedUser });

    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await userRepository.delete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json({ message: 'Usuário deletado com sucesso' });

    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        res.status(500).json({ message: 'Erro ao deletar usuário' });
    }
};