import React, { useEffect, useState } from 'react';
import projectDatabaseSupabase from '../../services/projectDatabaseSupabase';
import { Button, Card, Spinner, Alert } from 'react-bootstrap';
import { FiArrowUp } from 'react-icons/fi';
import './projectDetailsTable.css'

const ProjectDetailsTable = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      const tableContainer = document.querySelector('.table_container');
      if (tableContainer) {
        setShowScrollTop(tableContainer.scrollTop > 300);
      }
    };

    const tableContainer = document.querySelector('.table_container');
    if (tableContainer) {
      tableContainer.addEventListener('scroll', handleScroll);
      return () => tableContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    const tableContainer = document.querySelector('.table_container');
    if (tableContainer) {
      tableContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await projectDatabaseSupabase.getAllProjects();
      setProjects(projectsData);
      setError(null);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await projectDatabaseSupabase.deleteProject(id);
      if (result.success) {
        await loadProjects(); // Reload the projects
      } else {
        setError('Failed to delete project. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project. Please try again.');
    }
  };

  return (
    <div className='table_container'>
      <h2 className='d-flex align-items-center justify-content-center mb-4'>Project Details</h2>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {loading ? (
  <div className='d-flex justify-content-center'>
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
) : (
  <div className="projects-container-custom ">
    {projects.length === 0 ? (
      <div className="text-center">No projects found.</div>
    ) : (
      projects.map((proj, idx) => (
        <Card key={proj.id} className="mb-3">
          <Card.Body>
            <h5 className="project-title mb-2">{proj.projectName || proj.name}</h5>
            <p className="text-muted mb-3">
              {proj.projectDescription || proj.description || "No description available"}
            </p>
            

            <div className="mb-3 small text-muted">
              <div><strong>Start Date:</strong> {proj.startDate || proj.start_date || "Not Set"}</div>
              <div><strong>End Date:</strong> {proj.endDate || proj.end_date || "Not Set"}</div>
              <div><strong>Status:</strong> {proj.status || "Not Set"}</div>
              <div><strong>Priority:</strong> {proj.priority || "Not Set"}</div>
              <div><strong>Client:</strong> {proj.clientName || proj.client_name || "Not Set"}</div>
              <div><strong>Leader:</strong> {proj.leaderOfProject || proj.leader_of_project || "Not Set"}</div>
              <div><strong>Assigned Role:</strong> {proj.assigned_Role || "Not Set"}</div>

              {(proj.assignedTo || proj.assigned_to_emails || []).length > 0 && (
                <div><strong>Team Members:</strong> {(proj.assignedTo || proj.assigned_to_emails).join(", ")}</div>
              )}

              {(proj.role || []).length > 0 && (
                <div><strong>Roles:</strong> {proj.role.join(", ")}</div>
              )}

              {proj.projectResponsibility && (
                <div><strong>Responsibilities:</strong> {proj.projectResponsibility}</div>
              )}

              {proj.projectScope && (
                <div><strong>Scope:</strong> {proj.projectScope}</div>
              )}

              {(proj.customQuestion && proj.customAnswer) && (
                <div><strong>{proj.customQuestion}:</strong> {proj.customAnswer}</div>
              )}
            </div>

            {(proj.techStack || proj.tech_stack || []).length > 0 && (
              <div className="mb-3">
                <strong className="d-block mb-1">Tech Stack:</strong>
                <div className="d-flex flex-wrap gap-1">
                  {(proj.techStack || proj.tech_stack).map((tech, index) => (
                    <span key={index} className="badge bg-light text-dark small">{tech}</span>
                  ))}
                </div>
              </div>
            )}

            {(proj.uploadDocuments || proj.upload_documents) &&
              (proj.uploadDocuments || proj.upload_documents).length > 0 ? (
              <div className="mb-3">
                <strong className="d-block mb-1">Documents:</strong>
                {(proj.uploadDocuments || proj.upload_documents).map((file, i) => (
                  <div key={i}>
                    <a href={file.data} download={file.name} style={{ color: '#007bff', textDecoration: 'underline' }}>
                      {file.name}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-3"><strong>Documents:</strong> No files</div>
            )}

            <div className="d-flex justify-content-end">
              <Button variant="danger" size="sm" onClick={() => handleDelete(proj.id)}>
                Delete
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))
    )}
  </div>
)}


      
      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="scroll-to-top-btn"
          variant="primary"
          size="sm"
          title="Scroll to top"
        >
          <FiArrowUp />
        </Button>
      )}
    </div>
  );
};

export default ProjectDetailsTable;
