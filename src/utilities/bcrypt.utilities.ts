import bcrypt from 'bcrypt';

export const bcryptHashPassword = async (password: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const bcryptComparePassword = async (
  plainPassword: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
