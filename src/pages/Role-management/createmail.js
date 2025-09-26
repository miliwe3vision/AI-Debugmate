import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaUser, FaEnvelope, FaLock, FaUserTag, FaEye, FaEyeSlash } from 'react-icons/fa';
import './createmail.css';
import { databaseService } from '../../services/supabase';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Employee'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [notice, setNotice] = useState(null);
    const [noticeType, setNoticeType] = useState('success');

    const fetchEmployees = async () => {
        const { data, error } = await databaseService.getAllUserLogins();
        if (error) {
            setNotice('Failed to load users: ' + (error.message || 'Unknown error'));
            setNoticeType('error');
            return;
        }
        const mapped = (data || []).map((u, idx) => ({
            id: u.id || idx + 1,
            name: u.name || '',
            email: u.email || '',
            password: '********',
            role: u.role || 'Employee',
        }));
        setEmployees(mapped);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingEmployee) {
                const updates = { name: formData.name, role: formData.role };
                if (formData.password && formData.password.trim().length > 0) {
                    updates.password = formData.password;
                }
                const { error } = await databaseService.updateUserLoginByEmail(editingEmployee.email, updates);
                if (error) throw error;
                setNotice('Employee updated successfully');
                setNoticeType('success');
            } else {
                const payload = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    permission_roles: {},
                };
                const { error } = await databaseService.createUserLogin(payload);
                if (error) throw error;
                setNotice('Employee created successfully');
                setNoticeType('success');
            }
            await fetchEmployees();
            setFormData({ name: '', email: '', password: '', role: 'Employee' });
            setEditingEmployee(null);
            setShowModal(false);
        } catch (err) {
            setNotice('Save failed: ' + (err.message || 'Unknown error'));
            setNoticeType('error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setFormData({
            name: employee.name,
            email: employee.email,
            password: '',
            role: employee.role
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const employee = employees.find(e => e.id === id);
        if (!employee) return;
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const { error } = await databaseService.deleteUserLoginByEmail(employee.email);
                if (error) throw error;
                setNotice('Employee deleted');
                setNoticeType('success');
                await fetchEmployees();
            } catch (err) {
                setNotice('Delete failed: ' + (err.message || 'Unknown error'));
                setNoticeType('error');
            }
        }
    };

    const handleAddNew = () => {
        setEditingEmployee(null);
        setFormData({ name: '', email: '', password: '', role: 'Employee' });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingEmployee(null);
        setFormData({ name: '', email: '', password: '', role: 'Employee' });
    };

    const togglePasswordVisibility = (employeeId) => {
        setVisiblePasswords(prev => ({
            ...prev,
            [employeeId]: !prev[employeeId]
        }));
    };

    const getActualPassword = (employee) => {
        return '********';
    };

    return (
        <div className="employee-list-container">
            {notice && (
                <div className={`notice ${noticeType === 'error' ? 'error' : 'success'}`}>{notice}</div>
            )}
            
            {/* Header Section */}
            <div className="employee-header">
                <div className="header-content">
                    <h1 className="page-title">Employee List</h1>
                    <div className="header-actions">
                        <button 
                            className="add-employee-btn"
                            onClick={handleAddNew}
                        >
                            <FaPlus className="btn-icon" />
                            New Employee
                        </button>
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
                
            {/* Employee Table */}
            <div className="table-container">
                <div className="table-wrapper">
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>NO.</th>
                                <th>NAME</th>
                                <th>EMAIL-ID</th>
                                <th>PASSWORD</th>
                                <th>ROLE</th>
                                <th>EDIT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((employee, index) => (
                                <tr key={employee.id} className="table-row">
                                    <td className="employee-number">{index + 1}</td>
                                    <td className="employee-name">
                                        <div className="name-cell">
                                            <FaUser className="name-icon" />
                                            {employee.name}
                                        </div>
                                    </td>
                                    <td className="employee-email">
                                        <div className="email-cell">
                                            <FaEnvelope className="email-icon" />
                                            {employee.email}
                                        </div>
                                    </td>
                                    <td className="employee-password">
                                        <div className="password-cell">
                                            <FaLock className="password-icon" />
                                            <span className="password-text">
                                                {visiblePasswords[employee.id] 
                                                    ? getActualPassword(employee) 
                                                    : employee.password
                                                }
                                            </span>
                                            <button 
                                                className="password-toggle-btn"
                                                onClick={() => togglePasswordVisibility(employee.id)}
                                                title={visiblePasswords[employee.id] ? "Hide password" : "Show password"}
                                            >
                                                {visiblePasswords[employee.id] ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="employee-role">
                                        <span className={`role-badge ${employee.role.toLowerCase().replace(" ", "-")}`}>
                                            <FaUserTag className="role-icon" />
                                            {employee.role}
                                        </span>
                                    </td>
                                    <td className="employee-actions">
                                        <div className="action-buttons">
                                            <button 
                                                className="edit-btn"
                                                onClick={() => handleEdit(employee)}
                                                title="Edit Employee"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button 
                                                className="delete-btn"
                                                onClick={() => handleDelete(employee.id)}
                                                title="Delete Employee"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Add/Edit Employee */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
                            <button className="close-btn" onClick={closeModal}>×</button>
                        </div>
                
                        <form onSubmit={handleSubmit} className="employee-form">
                            <div className="form-group">
                                <label htmlFor="name">
                                    <FaUser className="form-icon" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter full name"
                                />
                            </div>
                
                            <div className="form-group">
                                <label htmlFor="email">
                                    <FaEnvelope className="form-icon" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter email address"
                                    disabled={!!editingEmployee}
                                />
                            </div>
                
                            <div className="form-group">
                                <label htmlFor="password">
                                    <FaLock className="form-icon" />
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required={!editingEmployee}
                                    placeholder={editingEmployee ? "Leave blank to keep current" : "Enter password"}
                                />
                            </div>
                
                            <div className="form-group">
                                <label htmlFor="role">
                                    <FaUserTag className="form-icon" />
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Employee">Employee</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Project Manager">Project Manager</option> {/* ✅ Added */}
                                </select>
                            </div>
                
                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="cancel-btn"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit" 
                                    className="save-btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : (editingEmployee ? 'Update' : 'Add Employee')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
