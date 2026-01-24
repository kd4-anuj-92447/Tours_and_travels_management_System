import CustomerNavbar from "./CustomerNavbar";
import { getUserRole } from "../utils/auth";

const MyProfile = () => {
  return (
    <>
      <CustomerNavbar />

      <div className="container mt-4">
        <h3>My Profile</h3>

        <table className="table table-bordered mt-3">
          <tbody>
            <tr>
              <th>Email</th>
              <td>customer@email.com</td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>Not Provided</td>
            </tr>
            <tr>
              <th>Role</th>
              <td>{getUserRole()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MyProfile;
