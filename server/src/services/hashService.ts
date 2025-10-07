import bcrypt from 'bcrypt';

export const hashPassword = async (user: any, saltRounds: number | string) => {
    user.password = await bcrypt.hash(user.password, saltRounds);
};
