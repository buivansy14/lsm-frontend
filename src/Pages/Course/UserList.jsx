const UserList = ({ users, onSelectUser, selectedUserId }) => {
  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">
        Danh sách người dùng
      </h2>
      <ul className="divide-y">
        {users.map((user) => (
          <li
            key={user._id}
            className={`flex items-center justify-between py-3 px-4 rounded-md cursor-pointer transition ${
              selectedUserId === user._id
                ? 'bg-blue-100 border-l-4 border-blue-500'
                : 'hover:bg-blue-50'
            }`}
            onClick={() => onSelectUser(user._id)}
          >
            <div>
              <h3 className="font-bold text-gray-700">{user.fullName}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
