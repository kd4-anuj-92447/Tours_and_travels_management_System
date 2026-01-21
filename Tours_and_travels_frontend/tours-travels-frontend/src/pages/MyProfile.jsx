import { getUser } from "../utils/auth";

const MyProfile = () => {
  const user = getUser();

  return (
    <div className="container mt-4">
      <h2>Profile</h2>
      <p>Name: {user?.name}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
};

export default MyProfile;
