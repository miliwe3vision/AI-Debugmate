
// chooserole.js
import React, { useState, useEffect, useContext } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaCogs } from 'react-icons/fa';
import './chooserole.css';
import { databaseService } from '../../services/supabase';
import { MyContext } from '../../App';

const RoleList = () => {
  const { userRole, userPermissions } = useContext(MyContext);

  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleName, setRoleName] = useState('');
  const [notice, setNotice] = useState(null);
  const [noticeType, setNoticeType] = useState('success');
  const [permissions, setPermissions] = useState({});

  // Example permission pages
  const pages = [
    'Dashboard',
    'Project Form',
    'Project Description',
    'ChatDual',
    'Feedback',
    'Create Mails',
    'Choose Roles',
    'Overview',
    'profile Setting',
    'API Management',
  ];

  const actions = ['All', 'View', 'Insert', 'Update', 'Delete'];

  // helper: check permission for current user
  const hasPermission = (page, action = 'View') => {
    if (userRole === 'Admin') return true;
    if (!userPermissions) return false;
    const pagePerms = userPermissions[page];
    if (!pagePerms) return false;
    if (pagePerms['All']) return true;
    return !!pagePerms[action];
  };

  // Fetch roles
  const fetchRoles = async () => {
    const { data, error } = await databaseService.getAllUserLogins();
    if (error) {
      setNotice('Failed to load roles: ' + (error.message || 'Unknown error'));
      setNoticeType('error');
      return;
    }

    const uniqueRoles = [...new Set((data || []).map((u) => u.role || 'Employee'))].map(
      (role, idx) => ({ id: idx + 1, name: role })
    );

    setRoles(uniqueRoles);
  };

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingRole(null);
    setRoleName('');
    setShowModal(true);
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        const { error } = await databaseService.deleteRole(id);
        if (error) throw error;
        setNotice('Role deleted');
        setNoticeType('success');
        await fetchRoles();
      } catch (err) {
        setNotice('Delete failed: ' + (err.message || 'Unknown error'));
        setNoticeType('error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRole) {
        const { error } = await databaseService.updateRole(editingRole.id, { name: roleName });
        if (error) throw error;
        setNotice('Role updated successfully');
        setNoticeType('success');
      } else {
        const { error } = await databaseService.createRole({ name: roleName });
        if (error) throw error;
        setNotice('Role created successfully');
        setNoticeType('success');
      }
      await fetchRoles();
      setShowModal(false);
      setRoleName('');
      setEditingRole(null);
    } catch (err) {
      setNotice('Save failed: ' + (err.message || 'Unknown error'));
      setNoticeType('error');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRole(null);
    setRoleName('');
  };

  const handlePermissions = (role) => {
    setEditingRole(role);

    // Load default permissions structure
    const initialPermissions = {};
    pages.forEach((page) => {
      initialPermissions[page] = {};
      actions.forEach((action) => {
        initialPermissions[page][action] = false;
      });
    });
    setPermissions(initialPermissions);
    setShowPermissionModal(true);
  };

  const togglePermission = (page, action) => {
    setPermissions((prev) => ({
      ...prev,
      [page]: {
        ...prev[page],
        [action]: !prev[page][action],
      },
    }));
  };

  const handleSavePermissions = async () => {
    try {
      const { error } = await databaseService.updateRolePermissions(editingRole.name, permissions);
      if (error) throw error;

      setNotice('Permissions updated successfully');
      setNoticeType('success');
      setShowPermissionModal(false);
    } catch (err) {
      setNotice('Failed to update permissions: ' + (err.message || 'Unknown error'));
      setNoticeType('error');
    }
  };

  return (
    <div className="role-list-container">
      {notice && (
        <div className={`notice ${noticeType === 'error' ? 'error' : 'success'}`}>
          {notice}
        </div>
      )}

      <div className="role-header">
        <div className="header-content">
          <h1 className="page-title">Roles List</h1>
          <div className="header-actions">
            {/* Only show Add if user has Insert permission on 'Choose Roles' or Admin */}
            {hasPermission('Choose Roles', 'Insert') && (
              <button className="add-role-btn" onClick={handleAddNew}>
                <FaPlus className="btn-icon" />
                Add New Role
              </button>
            )}

            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-wrapper">
          <table className="role-table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Role Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role, index) => (
                <tr key={role.id}>
                  <td className="role-number">{index + 1}</td>
                  <td className="role-name">{role.name}</td>
                  <td className="role-actions">
                    <div className="action-buttons">
                      {/* Edit allowed if Update permission */}
                      {hasPermission('Choose Roles', 'Update') ? (
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(role)}
                          title="Edit Role"
                        >
                          <FaEdit />
                        </button>
                      ) : null}

                      {/* Permissions allowed if Update permission */}
                      {hasPermission('Choose Roles', 'Update') ? (
                        <button
                          className="edit-btn"
                          title="Permissions"
                          onClick={() => handlePermissions(role)}
                        >
                          <FaCogs />
                        </button>
                      ) : null}

                      {/* Delete allowed if Delete permission */}
                      {hasPermission('Choose Roles', 'Delete') ? (
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(role.id)}
                          title="Delete Role"
                        >
                          <FaTrash />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRoles.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '24px' }}>
                    No roles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit Role */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingRole ? 'Edit Role' : 'Add New Role'}</h2>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="role-form">
              <div className="form-group">
                <label>Role Name</label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  required
                  placeholder="Enter role name"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingRole ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionModal && (
        <div className="modal-overlay" onClick={() => setShowPermissionModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Role Permission</h2>
              <button className="close-btn" onClick={() => setShowPermissionModal(false)}>
                ×
              </button>
            </div>
            <div className="permission-table-wrapper">
              <table className="permission-table">
                <thead>
                  <tr>
                    <th>Page Name</th>
                    {actions.map((action) => (
                      <th key={action}>{action}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <tr key={page}>
                      <td>{page}</td>
                      {actions.map((action) => (
                        <td key={action}>
                          <input
                            type="checkbox"
                            checked={permissions[page]?.[action] || false}
                            onChange={() => togglePermission(page, action)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="form-actions">
              <button className="cancel-btn" onClick={() => setShowPermissionModal(false)}>
                Close
              </button>
              <button className="save-btn" onClick={handleSavePermissions}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleList;
