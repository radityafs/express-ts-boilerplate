const UserMapper = (user: any) => {
  return {
    id: user.uid,
    name: user.name,
    email: user.email,
  };
};

export default UserMapper;
