import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import projectDatabaseSupabase from '../../services/projectDatabaseSupabase';
import { Table, Button, Card, Row, Col, ToggleButtonGroup, ToggleButton, Spinner, Alert } from 'react-bootstrap';
import { FiArrowUp } from 'react-icons/fi';
import './projectDetailsTable.css'

const ProjectDetailsTable = () => {
  const [projects, setProjects] = useState([]);
  const [view, setView] = useState('table');
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
      
      <div className='d-flex justify-content-center mb-3'>
        <ToggleButtonGroup type="radio" name="view" value={view} onChange={setView}>
          <ToggleButton id="tbg-radio-1" value={'table'} variant={view === 'table' ? 'primary' : 'outline-primary'}>Table View</ToggleButton>
          <ToggleButton id="tbg-radio-2" value={'card'} variant={view === 'card' ? 'primary' : 'outline-primary'}>Card View</ToggleButton>
        </ToggleButtonGroup>
      </div>
      
      {loading ? (
        <div className='d-flex justify-content-center'>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {view === 'table' ? (
            <Table className='align-items-center justify-content-center' striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Project Name</th>
                  <th>Description</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Team Members</th>
                  <th>Client Name</th>
                  <th>Tech Stack</th>
                  <th>Leader</th>
                  <th>Documents</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr><td colSpan={12} className="text-center">No projects found.</td></tr>
                ) : (
                  projects.map((proj, idx) => (
                    <tr key={proj.id}>
                      <td>{idx + 1}</td>
                      <td>{proj.name || proj.projectName}</td>
                      <td>{proj.description || proj.projectDescription}</td>
                      <td>{proj.start_date || proj.startDate}</td>
                      <td>{proj.end_date || proj.endDate}</td>
                      <td>{proj.status}</td>
                      <td>{(proj.assigned_to || proj.assignedTo || []).join(', ')}</td>
                      <td>{proj.client_name || proj.clientName}</td>
                      <td>{(proj.tech_stack || proj.techStack || []).join(', ')}</td>
                      <td>{proj.leader_of_project || proj.leaderOfProject}</td>
                      <td>
                        {Array.isArray(proj.upload_documents || proj.uploadDocuments) && (proj.upload_documents || proj.uploadDocuments).length > 0 ? (
                          (proj.upload_documents || proj.uploadDocuments).map((file, i) => (
                            <div key={i}>
                              <a href={file.data} download={file.name} style={{ color: '#007bff', textDecoration: 'underline' }}>
                                {file.name}
                              </a>
                            </div>
                          ))
                        ) : (
                          <span style={{ color: '#888' }}>No files</span>
                        )}
                      </td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(proj.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
                     ) : (
             <div className="projects-container-custom">
               {projects.length === 0 ? (
                 <div className="text-center">No projects found.</div>
               ) : (
                 projects.map((proj, idx) => (
                   <Card key={proj.id}>
                     <Card.Body>
                       <div className="d-flex justify-content-between align-items-start mb-3">
                         <div className="flex-grow-1">
                           <h5 className="project-title mb-1">{proj.name || proj.projectName}</h5>
                           <p className="project-subtitle text-muted mb-2">
                             {proj.description || proj.projectDescription ? 
                               (proj.description || proj.projectDescription).substring(0, 80) + ((proj.description || proj.projectDescription).length > 80 ? '...' : '') 
                               : 'No description available'
                             }
                           </p>
                           {proj.client_name || proj.clientName && (
                             <div className="d-flex align-items-center text-muted small mb-1">
                               <span>Client: {proj.client_name || proj.clientName}</span>
                             </div>
                           )}
                         </div>
                       </div>

                       <div className="mb-3">
                         <div className="d-flex align-items-center text-muted small mb-2">
                           <span>Status: {proj.status || 'Not Set'}</span>
                         </div>
                         
                         <div className="d-flex align-items-center text-muted small mb-2">
                           <span>Start: {proj.start_date || proj.startDate}</span>
                         </div>
                         
                         <div className="d-flex align-items-center text-muted small mb-2">
                           <span>End: {proj.end_date || proj.endDate}</span>
                         </div>
                         
                         {(proj.assigned_to || proj.assignedTo || []).length > 0 && (
                           <div className="d-flex align-items-center text-muted small mb-2">
                             <span>Team: {(proj.assigned_to || proj.assignedTo || []).join(', ')}</span>
                           </div>
                         )}
                         
                         {proj.leader_of_project || proj.leaderOfProject && (
                           <div className="d-flex align-items-center text-muted small mb-2">
                             <span>Leader: {proj.leader_of_project || proj.leaderOfProject}</span>
                           </div>
                         )}
                       </div>

                       {(proj.tech_stack || proj.techStack || []).length > 0 && (
                         <div className="mb-3">
                           <small className="text-muted d-block mb-1">Tech Stack:</small>
                           <div className="d-flex flex-wrap gap-1">
                             {(proj.tech_stack || proj.techStack || []).slice(0, 3).map((tech, index) => (
                               <span key={index} className="badge bg-light text-dark small">
                                 {tech}
                               </span>
                             ))}
                             {(proj.tech_stack || proj.techStack || []).length > 3 && (
                               <span className="badge bg-light text-dark small">
                                 +{(proj.tech_stack || proj.techStack || []).length - 3} more
                               </span>
                             )}
                           </div>
                         </div>
                       )}

                       <div className="d-flex justify-content-between align-items-center mt-auto">
                         <Link 
                           to={`/project/${proj.id}`} 
                           className="btn btn-primary btn-sm"
                         >
                           View Details
                         </Link>
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
        </>
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
